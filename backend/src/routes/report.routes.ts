import { Router } from 'express';
import { ReportController } from '../controllers/report.controller.js';
import { validate } from '../middleware/validate.js';
import { authenticate, requireActiveUser } from '../middleware/auth.js';
import {
  createReportSchema,
  getReportsFilterSchema,
  reportIdParamSchema,
} from '../validators/report.validator.js';

export const reportRouter = Router();

// Enforce server-side authentication and active user verification on all report routes
reportRouter.use(authenticate, requireActiveUser);

// List reports with filters and pagination (scoped by user role)
reportRouter.get('/', validate(getReportsFilterSchema), ReportController.getReports);

// Create new report (idempotent with clientId)
reportRouter.post('/', validate(createReportSchema), ReportController.createReport);

// Aggregated dashboard metrics & KPI telemetry (role-scoped)
reportRouter.get('/statistics', ReportController.getStats);

// Get single report by UUID (role-authorized)
reportRouter.get('/:id', validate(reportIdParamSchema), ReportController.getReportById);

// Update report (draft updates, status transitions, coordinator assignment)
reportRouter.patch('/:id', validate(reportIdParamSchema), ReportController.updateReport);
