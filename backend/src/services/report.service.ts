import { prisma } from '../config/database.js';
import { AppError } from '../utils/appError.js';
import {
  CreateReportInput,
  ReportFilterOptions,
  ReportResponseDTO,
  UpdateReportInput,
} from '../types/report.js';
import { PaginationMeta } from '../types/api.js';
import { Prisma } from '@prisma/client';
import { AuthUser } from '../types/auth.js';

export class ReportService {
  /**
   * Helper to ensure a valid creator user exists in the database
   */
  private static async resolveCreatorUser(providedId?: string): Promise<string> {
    if (providedId) {
      const existingUser = await prisma.user.findUnique({ where: { id: providedId } });
      if (existingUser) return existingUser.id;
    }

    // Fall back to the first available user in the database
    const defaultUser = await prisma.user.findFirst();
    if (defaultUser) return defaultUser.id;

    // If database is completely empty, initialize a default field worker
    const fallbackUser = await prisma.user.create({
      data: {
        fullName: 'Field Worker Demo',
        email: 'field.worker@fieldtrack.local',
        passwordHash: '$2b$10$demoHashPlaceholderForLocalTestingOnly',
        role: 'FIELD_WORKER',
      },
    });
    return fallbackUser.id;
  }

  /**
   * Create a new report or return existing if clientId matches (idempotent offline sync)
   */
  static async createReport(
    input: CreateReportInput,
    user?: AuthUser
  ): Promise<{ report: ReportResponseDTO; isDuplicate: boolean }> {
    // 1. Idempotency Check via clientId
    if (input.clientId) {
      const existing = await prisma.report.findUnique({
        where: { clientId: input.clientId },
        include: {
          createdBy: { select: { id: true, fullName: true, email: true, role: true } },
          assignedTo: { select: { id: true, fullName: true, email: true, role: true } },
          history: {
            orderBy: { createdAt: 'desc' },
            include: { actor: { select: { id: true, fullName: true, email: true, role: true } } },
          },
          attachments: true,
        },
      });

      if (existing) {
        return {
          report: existing as unknown as ReportResponseDTO,
          isDuplicate: true,
        };
      }
    }

    // 2. Resolve Creator User according to RBAC
    let creatorId: string;
    if (user) {
      if (user.role === 'FIELD_WORKER') {
        // Field workers can only create reports as themselves
        creatorId = user.id;
      } else {
        // Coordinators and Admins can create reports on behalf of other users if specified
        creatorId = input.createdById || user.id;
      }
    } else {
      creatorId = await this.resolveCreatorUser(input.createdById);
    }

    // 3. Create Report in Database
    const newReport = await prisma.report.create({
      data: {
        clientId: input.clientId || null,
        title: input.title,
        description: input.description,
        category: input.category,
        location: input.location,
        latitude: input.latitude ?? null,
        longitude: input.longitude ?? null,
        priority: input.priority ?? 'MEDIUM',
        status: input.status ?? 'SUBMITTED',
        createdById: creatorId,
        assignedToId: input.assignedToId || null,
        clientCreatedAt: input.clientCreatedAt ? new Date(input.clientCreatedAt) : null,
        submittedAt: input.status !== 'DRAFT' ? new Date() : null,
      },
      include: {
        createdBy: { select: { id: true, fullName: true, email: true, role: true } },
        assignedTo: { select: { id: true, fullName: true, email: true, role: true } },
        attachments: true,
      },
    });

    // 4. Record Audit History for creation
    await prisma.reportHistory.create({
      data: {
        reportId: newReport.id,
        actorId: user?.id || creatorId,
        action: 'REPORT_CREATED',
        newValue: newReport.status,
        description: `Incident report filed under category ${newReport.category} with priority ${newReport.priority}`,
      },
    });

    return {
      report: newReport as unknown as ReportResponseDTO,
      isDuplicate: false,
    };
  }

  /**
   * Retrieve report by UUID with full relational hierarchy and role enforcement
   */
  static async getReportById(id: string, user?: AuthUser): Promise<ReportResponseDTO> {
    const report = await prisma.report.findUnique({
      where: { id },
      include: {
        createdBy: { select: { id: true, fullName: true, email: true, role: true } },
        assignedTo: { select: { id: true, fullName: true, email: true, role: true } },
        history: {
          orderBy: { createdAt: 'desc' },
          include: { actor: { select: { id: true, fullName: true, email: true, role: true } } },
        },
        attachments: true,
      },
    });

    if (!report) {
      throw AppError.notFound(`Report with ID ${id} was not found`);
    }

    // RBAC: Field workers can only view their own reports
    if (user && user.role === 'FIELD_WORKER' && report.createdById !== user.id) {
      throw AppError.forbidden('Forbidden: Field workers can only view their own reports');
    }

    return report as unknown as ReportResponseDTO;
  }

  /**
   * List reports with filtering, searching, pagination, and role-based scoping
   */
  static async getReports(
    filters: ReportFilterOptions,
    user?: AuthUser
  ): Promise<{ reports: ReportResponseDTO[]; meta: PaginationMeta }> {
    const page = Math.max(1, filters.page || 1);
    const limit = Math.min(100, Math.max(1, filters.limit || 10));
    const skip = (page - 1) * limit;

    const where: Prisma.ReportWhereInput = {};

    // RBAC: Field workers are strictly isolated to their own reports
    if (user && user.role === 'FIELD_WORKER') {
      where.createdById = user.id;
    } else if (filters.createdById) {
      where.createdById = filters.createdById;
    }

    if (filters.status) where.status = filters.status;
    if (filters.priority) where.priority = filters.priority;
    if (filters.category) where.category = filters.category;
    if (filters.assignedToId) where.assignedToId = filters.assignedToId;

    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
        { location: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const [total, reports] = await Promise.all([
      prisma.report.count({ where }),
      prisma.report.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          createdBy: { select: { id: true, fullName: true, email: true, role: true } },
          assignedTo: { select: { id: true, fullName: true, email: true, role: true } },
        },
      }),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    const meta: PaginationMeta = {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };

    return {
      reports: reports as unknown as ReportResponseDTO[],
      meta,
    };
  }

  /**
   * Update report with role-based validation and audit logging
   */
  static async updateReport(
    id: string,
    input: UpdateReportInput,
    user: AuthUser
  ): Promise<ReportResponseDTO> {
    const existing = await prisma.report.findUnique({
      where: { id },
      include: { createdBy: true, assignedTo: true },
    });

    if (!existing) {
      throw AppError.notFound(`Report with ID ${id} was not found`);
    }

    // Role-based authorization rules:
    if (user.role === 'FIELD_WORKER') {
      if (existing.createdById !== user.id) {
        throw AppError.forbidden('Forbidden: You can only edit your own reports');
      }
      if (existing.status !== 'DRAFT') {
        throw AppError.forbidden(
          'Forbidden: Field workers can only modify reports while in DRAFT status'
        );
      }
      if (input.assignedToId !== undefined) {
        throw AppError.forbidden('Forbidden: Field workers cannot assign reports');
      }
      if (input.status && input.status !== 'DRAFT' && input.status !== 'SUBMITTED') {
        throw AppError.forbidden(
          'Forbidden: Field workers may only transition drafts to SUBMITTED'
        );
      }
    }

    // Prepare update data
    const data: Prisma.ReportUpdateInput = {};
    if (input.title !== undefined) data.title = input.title;
    if (input.description !== undefined) data.description = input.description;
    if (input.category !== undefined) data.category = input.category;
    if (input.location !== undefined) data.location = input.location;
    if (input.latitude !== undefined) data.latitude = input.latitude;
    if (input.longitude !== undefined) data.longitude = input.longitude;
    if (input.priority !== undefined) data.priority = input.priority;
    if (input.status !== undefined) {
      data.status = input.status;
      if (input.status === 'RESOLVED') {
        data.resolvedAt = new Date();
      } else if (input.status === 'SUBMITTED' && !existing.submittedAt) {
        data.submittedAt = new Date();
      }
    }
    if (input.assignedToId !== undefined) {
      if (input.assignedToId) {
        data.assignedTo = { connect: { id: input.assignedToId } };
      } else {
        data.assignedTo = { disconnect: true };
      }
    }

    const updated = await prisma.report.update({
      where: { id },
      data,
      include: {
        createdBy: { select: { id: true, fullName: true, email: true, role: true } },
        assignedTo: { select: { id: true, fullName: true, email: true, role: true } },
        history: {
          orderBy: { createdAt: 'desc' },
          include: { actor: { select: { id: true, fullName: true, email: true, role: true } } },
        },
        attachments: true,
      },
    });

    // Record audit history for status change or assignment
    if (input.status && input.status !== existing.status) {
      await prisma.reportHistory.create({
        data: {
          reportId: id,
          actorId: user.id,
          action: 'STATUS_UPDATED',
          previousValue: existing.status,
          newValue: input.status,
          description: `Status updated from ${existing.status} to ${input.status} by ${user.fullName}`,
        },
      });
    }

    if (input.assignedToId !== undefined && input.assignedToId !== existing.assignedToId) {
      await prisma.reportHistory.create({
        data: {
          reportId: id,
          actorId: user.id,
          action: 'COORDINATOR_ASSIGNED',
          previousValue: existing.assignedToId || 'UNASSIGNED',
          newValue: input.assignedToId || 'UNASSIGNED',
          description: `Assignment updated by ${user.fullName}`,
        },
      });
    }

    return updated as unknown as ReportResponseDTO;
  }

  /**
   * Calculate aggregated report & operational statistics scoped by user role
   */
  static async getReportStats(user: AuthUser): Promise<Record<string, unknown>> {
    const isWorker = user.role === 'FIELD_WORKER';
    const whereClause: Prisma.ReportWhereInput = isWorker ? { createdById: user.id } : {};

    // Execute parallel aggregation queries
    const [
      totalReports,
      drafts,
      submitted,
      assigned,
      inProgress,
      resolved,
      rejected,
      critical,
      high,
      medium,
      low,
      awaitingAssignment,
    ] = await Promise.all([
      prisma.report.count({ where: whereClause }),
      prisma.report.count({ where: { ...whereClause, status: 'DRAFT' } }),
      prisma.report.count({ where: { ...whereClause, status: 'SUBMITTED' } }),
      prisma.report.count({ where: { ...whereClause, status: 'ASSIGNED' } }),
      prisma.report.count({ where: { ...whereClause, status: 'IN_PROGRESS' } }),
      prisma.report.count({ where: { ...whereClause, status: 'RESOLVED' } }),
      prisma.report.count({ where: { ...whereClause, status: 'REJECTED' } }),
      prisma.report.count({ where: { ...whereClause, priority: 'CRITICAL' } }),
      prisma.report.count({ where: { ...whereClause, priority: 'HIGH' } }),
      prisma.report.count({ where: { ...whereClause, priority: 'MEDIUM' } }),
      prisma.report.count({ where: { ...whereClause, priority: 'LOW' } }),
      isWorker
        ? Promise.resolve(0)
        : prisma.report.count({ where: { status: 'SUBMITTED', assignedToId: null } }),
    ]);

    const baseStats = {
      totalReports,
      drafts,
      submitted,
      assigned,
      inProgress,
      resolved,
      rejected,
      highPriority: critical + high,
      awaitingAssignment,
      statusBreakdown: {
        DRAFT: drafts,
        SUBMITTED: submitted,
        ASSIGNED: assigned,
        IN_PROGRESS: inProgress,
        RESOLVED: resolved,
        REJECTED: rejected,
      },
      priorityBreakdown: {
        CRITICAL: critical,
        HIGH: high,
        MEDIUM: medium,
        LOW: low,
      },
    };

    // For Administrator: include system user stats
    if (user.role === 'ADMIN') {
      const [totalUsers, activeFieldWorkers, totalCoordinators, totalAdmins] = await Promise.all([
        prisma.user.count(),
        prisma.user.count({ where: { role: 'FIELD_WORKER', isActive: true } }),
        prisma.user.count({ where: { role: 'COORDINATOR', isActive: true } }),
        prisma.user.count({ where: { role: 'ADMIN', isActive: true } }),
      ]);

      return {
        ...baseStats,
        totalUsers,
        activeFieldWorkers,
        totalCoordinators,
        totalAdmins,
      };
    }

    return baseStats;
  }
}
