import { prisma } from '../config/database.js';
import { AppError } from '../utils/appError.js';
import { CreateReportInput, ReportFilterOptions, ReportResponseDTO } from '../types/report.js';
import { PaginationMeta } from '../types/api.js';
import { Prisma } from '@prisma/client';

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
        email: 'field.worker@fieldsync.local',
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
    input: CreateReportInput
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

    // 2. Resolve Creator User
    const creatorId = await this.resolveCreatorUser(input.createdById);

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
        actorId: creatorId,
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
   * Retrieve report by UUID with full relational hierarchy
   */
  static async getReportById(id: string): Promise<ReportResponseDTO> {
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

    return report as unknown as ReportResponseDTO;
  }

  /**
   * List reports with filtering, searching, and pagination
   */
  static async getReports(
    filters: ReportFilterOptions
  ): Promise<{ reports: ReportResponseDTO[]; meta: PaginationMeta }> {
    const page = Math.max(1, filters.page || 1);
    const limit = Math.min(100, Math.max(1, filters.limit || 10));
    const skip = (page - 1) * limit;

    const where: Prisma.ReportWhereInput = {};

    if (filters.status) where.status = filters.status;
    if (filters.priority) where.priority = filters.priority;
    if (filters.category) where.category = filters.category;
    if (filters.createdById) where.createdById = filters.createdById;
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
}
