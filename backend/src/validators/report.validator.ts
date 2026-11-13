import { z } from 'zod';

export const createReportSchema = z.object({
  body: z.object({
    clientId: z.string().uuid('Client ID must be a valid UUID').optional(),
    title: z
      .string({ required_error: 'Title is required' })
      .trim()
      .min(3, 'Title must be at least 3 characters')
      .max(150, 'Title cannot exceed 150 characters'),
    description: z
      .string({ required_error: 'Description is required' })
      .trim()
      .min(10, 'Description must be at least 10 characters'),
    category: z.enum(
      [
        'WATER',
        'EQUIPMENT',
        'ELECTRICAL',
        'INFRASTRUCTURE',
        'SAFETY',
        'SERVICE_INTERRUPTION',
        'OTHER',
      ],
      {
        errorMap: () => ({
          message:
            'Category must be one of: WATER, EQUIPMENT, ELECTRICAL, INFRASTRUCTURE, SAFETY, SERVICE_INTERRUPTION, OTHER',
        }),
      }
    ),
    location: z
      .string({ required_error: 'Location is required' })
      .trim()
      .min(2, 'Location must be at least 2 characters')
      .max(255, 'Location cannot exceed 255 characters'),
    priority: z
      .enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], {
        errorMap: () => ({ message: 'Priority must be LOW, MEDIUM, HIGH, or CRITICAL' }),
      })
      .default('MEDIUM'),
    status: z
      .enum(['DRAFT', 'SUBMITTED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'])
      .default('SUBMITTED'),
    latitude: z.number().min(-90).max(90).optional().nullable(),
    longitude: z.number().min(-180).max(180).optional().nullable(),
    createdById: z.string().uuid('CreatedById must be a valid UUID').optional(),
    assignedToId: z.string().uuid('AssignedToId must be a valid UUID').optional().nullable(),
    clientCreatedAt: z.string().datetime().optional().nullable(),
  }),
});

export const getReportsFilterSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    status: z
      .enum(['DRAFT', 'SUBMITTED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'])
      .optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
    category: z
      .enum([
        'WATER',
        'EQUIPMENT',
        'ELECTRICAL',
        'INFRASTRUCTURE',
        'SAFETY',
        'SERVICE_INTERRUPTION',
        'OTHER',
      ])
      .optional(),
    createdById: z.string().uuid('CreatedById must be a valid UUID').optional(),
    assignedToId: z.string().uuid('AssignedToId must be a valid UUID').optional(),
    search: z.string().trim().min(1).optional(),
  }),
});

export const reportIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid report identifier format (expected UUID)'),
  }),
});
