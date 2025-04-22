import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export class EmailService {
  // Create email transporter (connection to email server)
  private static transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  // Send analysis report via email
  static async sendAnalysisReport(email: string, analysisData: any, reportUrl: string): Promise<boolean> {
    try {
      console.log(`📧 Attempting to send email to: ${email}`);
      
      // If no SMTP config, use mock for development
      if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
        console.log('⚠️ No email configuration found. Using mock email service.');
        console.log(`📋 Mock: Would send to ${email} with report: ${reportUrl}`);
        console.log('📊 Analysis status:', analysisData.feasibilityTitle);
        return true; // Return success in development
      }

      const feasibilityColor = analysisData.feasibilityColor;
      let colorText = '';
      let colorClass = '';
      
      switch (feasibilityColor) {
        case 'GREEN':
          colorText = '🟢 ON TRACK';
          colorClass = 'green';
          break;
        case 'YELLOW':
          colorText = '🟡 CHALLENGING';
          colorClass = 'yellow';
          break;
        case 'RED':
          colorText = '🔴 UNREALISTIC';
          colorClass = 'red';
          break;
        default:
          colorText = '⚪ ANALYSIS COMPLETE';
          colorClass = 'gray';
      }

      // Create beautiful HTML email
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif; 
              line-height: 1.6; 
              color: #333; 
              max-width: 600px; 
              margin: 0 auto; 
              padding: 20px; 
              background: #f9fafb;
            }
            .email-container { 
              background: white; 
              border-radius: 12px; 
              overflow: hidden; 
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header { 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
              color: white; 
              padding: 40px 30px; 
              text-align: center; 
            }
            .logo { 
              font-size: 28px; 
              font-weight: bold; 
              margin-bottom: 10px;
              letter-spacing: 1px;
            }
            .tagline { 
              font-size: 16px; 
              opacity: 0.9; 
              margin-bottom: 20px;
            }
            .content { 
              padding: 40px 30px; 
            }
            .status-badge { 
              display: inline-block; 
              padding: 12px 24px; 
              border-radius: 25px; 
              font-weight: bold; 
              font-size: 16px;
              margin: 20px 0;
            }
            .green { background: #d1fae5; color: #065f46; }
            .yellow { background: #fef3c7; color: #92400e; }
            .red { background: #fee2e2; color: #991b1b; }
            .gray { background: #e5e7eb; color: #374151; }
            .button { 
              display: inline-block; 
              padding: 16px 32px; 
              background: #4f46e5; 
              color: white; 
              text-decoration: none; 
              border-radius: 8px; 
              font-weight: bold; 
              font-size: 16px;
              margin: 25px 0;
              text-align: center;
            }
            .summary-box { 
              background: #f8fafc; 
              padding: 20px; 
              border-radius: 8px; 
              border-left: 4px solid #4f46e5;
              margin: 20px 0;
            }
            .footer { 
              margin-top: 40px; 
              padding-top: 20px; 
              border-top: 1px solid #e5e7eb; 
              font-size: 12px; 
              color: #6b7280; 
              text-align: center;
            }
            .highlight { 
              font-weight: bold; 
              color: #1f2937; 
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <div class="logo">Financial Advisor</div>
              <div class="tagline">AI-Powered Investment Strategy</div>
            </div>
            
            <div class="content">
              <h2>Hello,</h2>
              <p>Your financial analysis report is ready! Here's what we found:</p>
              
              <div class="status-badge ${colorClass}">
                ${colorText}
              </div>
              
              <h3>${analysisData.feasibilityTitle}</h3>
              <p>${analysisData.feasibilityExplanation}</p>
              
              <div class="summary-box">
                <p><span class="highlight">Executive Summary:</span><br>
                ${analysisData.executiveSummary.substring(0, 250)}${analysisData.executiveSummary.length > 250 ? '...' : ''}</p>
                
                <p><span class="highlight">Projection:</span><br>
                ${analysisData.projectedOutcome.substring(0, 200)}${analysisData.projectedOutcome.length > 200 ? '...' : ''}</p>
              </div>
              
              <div style="text-align: center;">
                <a href="${reportUrl}" class="button">View Complete Report</a>
                <p style="font-size: 14px; color: #6b7280; margin-top: 10px;">
                  Click above to see your full analysis with charts and recommendations
                </p>
              </div>
              
              <div class="footer">
                <p>This report was generated by Financial Advisor AI.</p>
                <p><strong>Disclaimer:</strong> This is for educational purposes only. Consult a financial advisor for professional advice.</p>
                <p>© ${new Date().getFullYear()} Financial Advisor. All rights reserved.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `;

      // Plain text version for email clients that don't support HTML
      const textContent = `Financial Analysis Report\n\n` +
        `Status: ${analysisData.feasibilityTitle}\n` +
        `Summary: ${analysisData.executiveSummary.substring(0, 200)}...\n` +
        `View full report: ${reportUrl}\n\n` +
        `Generated by Financial Advisor AI`;

      // Email configuration
      const mailOptions = {
        from: `"Financial Advisor" <${process.env.SMTP_FROM || process.env.SMTP_USER || 'noreply@financial-advisor.com'}>`,
        to: email,
        subject: `Your Financial Analysis Report - ${analysisData.feasibilityTitle}`,
        html: htmlContent,
        text: textContent
      };

      // Send the email
      const info = await this.transporter.sendMail(mailOptions);
      console.log(`✅ Email sent successfully! Message ID: ${info.messageId}`);
      return true;
      
    } catch (error: any) {
      console.error('❌ Email sending failed:', error.message);
      // In development, still return true to not break the flow
      if (process.env.NODE_ENV === 'development') {
        console.log('⚠️ Development mode: Continuing without email');
        return true;
      }
      return false;
    }
  }

  // Test email connection
  static async testConnection(): Promise<boolean> {
    try {
      // In development without SMTP config, just return true
      if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
        console.log('📧 Development mode: No email configuration required');
        return true;
      }
      
      await this.transporter.verify();
      console.log('✅ SMTP connection verified successfully');
      return true;
    } catch (error: any) {
      console.error('❌ SMTP connection failed:', error.message);
      console.log('⚠️ Continuing in development mode');
      return process.env.NODE_ENV === 'development'; // Return true in development
    }
  }
}