import { Request, Response, NextFunction } from 'express';
import { ReportService } from '../services/report.service.js';
import { ApiResponse } from '../utils/apiResponse.js';

export class ReportController {
  /**
   * POST /api/reports - Create new report (idempotent with clientId)
   */
  static async createReport(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { report, isDuplicate } = await ReportService.createReport(req.body);

      if (isDuplicate) {
        ApiResponse.success(
          res,
          report,
          'Existing report returned (idempotent duplicate prevented)',
          200,
          { isDuplicate: true }
        );
        return;
      }

      ApiResponse.created(res, report, 'Report created successfully', { isDuplicate: false });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/reports/:id - Retrieve single report by ID
   */
  static async getReportById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const report = await ReportService.getReportById(req.params.id);
      ApiResponse.success(res, report, 'Report retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/reports - List reports with pagination and filtering
   */
  static async getReports(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { reports, meta } = await ReportService.getReports(req.query);
      ApiResponse.success(
        res,
        reports,
        'Reports retrieved successfully',
        200,
        meta as unknown as Record<string, unknown>
      );
    } catch (error) {
      next(error);
    }
  }
}
