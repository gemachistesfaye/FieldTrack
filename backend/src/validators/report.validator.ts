import { z } from 'zod';

export const createReportSchema = z.object({
  body: z.object({
    clientReportId: z.string().uuid().optional(),
    title: z.string().min(3, 'Title must be at least 3 characters').max(150),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    category: z.enum([
      'WATER_POINT',
      'EQUIPMENT',
      'SERVICE_INTERRUPTION',
      'SAFETY_CONCERN',
      'MAINTENANCE_REQUEST',
      'OTHER',
    ]),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).default('MEDIUM'),
    locationName: z.string().min(2, 'Location name is required'),
    latitude: z.number().min(-90).max(90).optional().nullable(),
    longitude: z.number().min(-180).max(180).optional().nullable(),
    address: z.string().optional().nullable(),
    clientCreatedAt: z.string().datetime().optional().nullable(),
  }),
});

export const updateReportStatusSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    workflowStatus: z.enum([
      'DRAFT',
      'SUBMITTED',
      'ASSIGNED',
      'IN_PROGRESS',
      'RESOLVED',
      'REJECTED',
    ]),
    notes: z.string().optional(),
  }),
});

export const assignReportSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    assignedToId: z.string().uuid('Valid coordinator ID is required'),
    notes: z.string().optional(),
  }),
});
