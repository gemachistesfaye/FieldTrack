import { Router } from 'express';
import { ReportController } from '../controllers/report.controller.js';
import { validate } from '../middleware/validate.js';
import {
  createReportSchema,
  getReportsFilterSchema,
  reportIdParamSchema,
} from '../validators/report.validator.js';

export const reportRouter = Router();

// List reports with filters and pagination
reportRouter.get('/', validate(getReportsFilterSchema), ReportController.getReports);

// Create new report (idempotent with clientId)
reportRouter.post('/', validate(createReportSchema), ReportController.createReport);

// Get single report by UUID
reportRouter.get('/:id', validate(reportIdParamSchema), ReportController.getReportById);
