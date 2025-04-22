import { Router } from 'express';
import { authenticate, AuthenticatedRequest } from '../middleware/auth.middleware';
import { EmailService } from '../services/email.service';
import { PDFService } from '../services/pdf.service';
import { DatabaseService } from '../services/database.service';
import { createObjectCsvStringifier } from 'csv-writer';

const router = Router();

// POST /api/export/email - Send report via email
router.post('/email', authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const { analysisId, email } = req.body;
    const userId = req.userId;

    if (!analysisId || !email) {
      return res.status(400).json({
        success: false,
        error: 'Analysis ID and email are required',
      });
    }

    // Get analysis from database
    const analysis = await DatabaseService.getAnalysisBySessionId(analysisId);
    
    if (!analysis) {
      return res.status(404).json({
        success: false,
        error: 'Analysis not found',
      });
    }

    // Check ownership
    if (analysis.userId !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this analysis',
      });
    }

    const reportUrl = `${process.env.FRONTEND_URL}/report/${analysisId}`;
    const sent = await EmailService.sendAnalysisReport(email, analysis.analysisResult, reportUrl);

    if (sent) {
      res.json({
        success: true,
        message: 'Report emailed successfully',
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to send email. Please check SMTP configuration.',
      });
    }
  } catch (error: any) {
    console.error('Email export error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send email',
      details: error.message,
    });
  }
});

// GET /api/export/pdf/:sessionId - Generate PDF report
router.get('/pdf/:sessionId', authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.userId;

    const analysis = await DatabaseService.getAnalysisBySessionId(sessionId);
    
    if (!analysis) {
      return res.status(404).json({
        success: false,
        error: 'Analysis not found',
      });
    }

    if (analysis.userId !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this analysis',
      });
    }

    const pdfBuffer = await PDFService.generateReportPDF({
      ...analysis.analysisResult,
      userData: {
        email: req.user?.email || '',
        fullName: req.user?.fullName || '',
      },
      formData: analysis.formData,
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="financial-report-${sessionId}.pdf"`);
    res.send(pdfBuffer);
  } catch (error: any) {
    console.error('PDF export error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate PDF',
      details: error.message,
    });
  }
});

// GET /api/export/csv/:sessionId - Export as CSV
router.get('/csv/:sessionId', authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.userId;

    const analysis = await DatabaseService.getAnalysisBySessionId(sessionId);
    
    if (!analysis) {
      return res.status(404).json({
        success: false,
        error: 'Analysis not found',
      });
    }

    if (analysis.userId !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this analysis',
      });
    }

    // Prepare CSV data
    const csvStringifier = createObjectCsvStringifier({
      header: [
        { id: 'field', title: 'FIELD' },
        { id: 'value', title: 'VALUE' },
      ],
    });

    const records = [
      { field: 'Analysis ID', value: sessionId },
      { field: 'Date', value: analysis.createdAt },
      { field: 'Feasibility', value: analysis.analysisResult.feasibilityColor },
      { field: 'Goal', value: analysis.formData.primaryGoal },
      { field: 'Target Amount', value: analysis.formData.targetInvestmentAmount },
      { field: 'Time Horizon (Years)', value: analysis.formData.targetYears },
      { field: 'Age', value: analysis.formData.age },
      { field: 'Annual Income', value: analysis.formData.annualIncome },
      { field: 'Monthly Investment', value: analysis.formData.monthlyInvestmentCapacity },
      { field: 'Existing Savings', value: analysis.formData.existingSavings },
    ];

    // Add investment strategy
    analysis.analysisResult.investmentStrategy.forEach((strategy: any, index: number) => {
      records.push({
        field: `Strategy ${index + 1}`,
        value: `${strategy.title} (${strategy.allocationPercentage || 0}%)`,
      });
    });

    const csvString = csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(records);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="financial-data-${sessionId}.csv"`);
    res.send(csvString);
  } catch (error: any) {
    console.error('CSV export error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate CSV',
      details: error.message,
    });
  }
});

// GET /api/export/test-email - Test email configuration (admin only)
router.get('/test-email', authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const testResult = await EmailService.testConnection();
    
    res.json({
      success: testResult,
      message: testResult ? 'Email service is working' : 'Email service failed',
      configuration: {
        hasSmtpHost: !!process.env.SMTP_HOST,
        hasSmtpUser: !!process.env.SMTP_USER,
        hasSmtpPassword: !!process.env.SMTP_PASSWORD ? '***' : false,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Email test failed',
      details: error.message,
    });
  }
});

export default router;