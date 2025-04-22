import { createWriteStream } from 'fs';
import { promisify } from 'util';
import { pipeline } from 'stream';
import htmlPdf from 'html-pdf-node';

const streamPipeline = promisify(pipeline);

interface AnalysisData {
  feasibilityColor: string;
  feasibilityTitle: string;
  feasibilityExplanation: string;
  executiveSummary: string;
  projectedOutcome: string;
  investmentStrategy: Array<{
    title: string;
    allocationPercentage?: number;
    description: string;
    assets: string[];
  }>;
  riskAssessment: string;
  nextSteps: string[];
  userData?: {
    email: string;
    fullName: string;
  };
  formData?: {
    age: number;
    country: string;
    primaryGoal: string;
    targetInvestmentAmount: number;
    targetYears: number;
  };
}

export class PDFService {
  static async generateReportPDF(analysisData: AnalysisData): Promise<Buffer> {
    const htmlContent = this.generateHTML(analysisData);
    
    const options = {
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '20mm',
        bottom: '20mm',
        left: '20mm'
      }
    };

    const file = {
      content: htmlContent
    };

    return new Promise((resolve, reject) => {
      htmlPdf.generatePdf(file, options, (error: Error | null, buffer: Buffer) => {
        if (error) {
          reject(error);
        } else {
          resolve(buffer);
        }
      });
    });
  }

  private static generateHTML(data: AnalysisData): string {
    const date = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const feasibilityColorMap: Record<string, string> = {
      'GREEN': '#10B981',
      'YELLOW': '#F59E0B',
      'RED': '#EF4444'
    };

    const color = feasibilityColorMap[data.feasibilityColor] || '#6B7280';

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Financial Analysis Report</title>
        <style>
          @page { margin: 0; }
          body { 
            font-family: 'Helvetica', 'Arial', sans-serif; 
            line-height: 1.6; 
            color: #1F2937; 
            padding: 40px; 
            max-width: 800px;
            margin: 0 auto;
          }
          .header { 
            border-bottom: 3px solid ${color}; 
            padding-bottom: 20px; 
            margin-bottom: 40px;
          }
          .title { 
            font-size: 32px; 
            font-weight: bold; 
            color: #111827; 
            margin-bottom: 10px;
          }
          .subtitle { 
            font-size: 16px; 
            color: #6B7280; 
            margin-bottom: 20px;
          }
          .status-badge { 
            display: inline-block; 
            padding: 8px 16px; 
            background: ${color}15; 
            color: ${color}; 
            border-radius: 20px; 
            font-weight: bold;
            margin: 10px 0;
          }
          .section { 
            margin: 30px 0; 
            page-break-inside: avoid;
          }
          .section-title { 
            font-size: 20px; 
            font-weight: bold; 
            color: #374151; 
            margin-bottom: 15px;
            border-left: 4px solid ${color};
            padding-left: 12px;
          }
          .grid-2 { 
            display: grid; 
            grid-template-columns: 1fr 1fr; 
            gap: 20px; 
            margin: 20px 0;
          }
          .card { 
            background: #F9FAFB; 
            padding: 20px; 
            border-radius: 8px; 
            border-left: 4px solid ${color};
          }
          .strategy-item { 
            margin: 15px 0; 
            padding: 15px; 
            background: white; 
            border: 1px solid #E5E7EB; 
            border-radius: 6px;
          }
          .asset-tag { 
            display: inline-block; 
            background: #EEF2FF; 
            color: #4F46E5; 
            padding: 4px 8px; 
            border-radius: 4px; 
            font-size: 12px; 
            margin: 2px;
          }
          .footer { 
            margin-top: 40px; 
            padding-top: 20px; 
            border-top: 1px solid #E5E7EB; 
            font-size: 12px; 
            color: #6B7280; 
            text-align: center;
          }
          .page-break { page-break-before: always; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">Financial Strategy Report</div>
          <div class="subtitle">AI-Powered Investment Analysis • Generated on ${date}</div>
          <div class="status-badge">${data.feasibilityColor}: ${data.feasibilityTitle}</div>
        </div>

        <div class="section">
          <div class="section-title">Executive Summary</div>
          <p>${data.executiveSummary}</p>
        </div>

        <div class="section">
          <div class="section-title">Feasibility Assessment</div>
          <div class="card">
            <strong>Status:</strong> ${data.feasibilityTitle}<br>
            <strong>Explanation:</strong> ${data.feasibilityExplanation}
          </div>
        </div>

        <div class="section">
          <div class="section-title">Financial Projection</div>
          <p>${data.projectedOutcome}</p>
        </div>

        <div class="page-break"></div>

        <div class="section">
          <div class="section-title">Investment Strategy</div>
          ${data.investmentStrategy.map(strategy => `
            <div class="strategy-item">
              <strong>${strategy.title}</strong> ${strategy.allocationPercentage ? `(${strategy.allocationPercentage}%)` : ''}
              <p>${strategy.description}</p>
              <div>
                ${strategy.assets.map(asset => `<span class="asset-tag">${asset}</span>`).join('')}
              </div>
            </div>
          `).join('')}
        </div>

        <div class="section">
          <div class="section-title">Risk Assessment</div>
          <p>${data.riskAssessment}</p>
        </div>

        <div class="section">
          <div class="section-title">Action Plan</div>
          <ul>
            ${data.nextSteps.map(step => `<li>${step}</li>`).join('')}
          </ul>
        </div>

        <div class="footer">
          <p>This report is generated by Artificial Intelligence for educational purposes only.</p>
          <p>© ${new Date().getFullYear()} Financial Advisor. Confidential & Proprietary.</p>
          <p>Report ID: ${Date.now()}</p>
        </div>
      </body>
      </html>
    `;
  }
}