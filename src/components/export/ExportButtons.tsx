import React, { useState } from 'react';
import { generatePDF, prepareForPDFCapture, restoreAfterPDFCapture } from '../../services/pdfGenerator';

interface ExportButtonsProps {
  sessionId: string;
  analysisData: any;
}

const ExportButtons: React.FC<ExportButtonsProps> = ({ sessionId, analysisData }) => {
  const [email, setEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  const handleEmailExport = async () => {
    if (!email || !email.includes('@')) {
      setMessage('Please enter a valid email address');
      setMessageType('error');
      return;
    }

    setIsSending(true);
    setMessage('');

    // Simulate email sending
    setTimeout(() => {
      setMessage(`Report link copied to clipboard! Send to: ${email}`);
      setMessageType('success');

      // Copy shareable link to clipboard
      const shareUrl = `${window.location.origin}/#report-${sessionId}`;
      navigator.clipboard.writeText(shareUrl);

      setIsSending(false);
      setEmail('');
    }, 1000);
  };

  // In your ExportButtons.tsx, update the PDF export function:
  const handlePDFExport = async () => {
    try {
      // Prepare the report for better PDF capture
      if (typeof prepareForPDFCapture === 'function') {
        prepareForPDFCapture();
      }

      // Wait a bit for styles to apply
      await new Promise(resolve => setTimeout(resolve, 100));

      await generatePDF(analysisData, 'report-content');

      // Restore styles
      if (typeof restoreAfterPDFCapture === 'function') {
        restoreAfterPDFCapture();
      }

      setMessage('Beautiful PDF downloaded successfully! 🎨');
      setMessageType('success');
    } catch (error) {
      setMessage('Failed to generate PDF. Please try again.');
      setMessageType('error');
    }
  };

  const handleCSVExport = () => {
    // Generate simple CSV
    const csvContent = [
      ['Field', 'Value'],
      ['Feasibility', analysisData.feasibilityTitle],
      ['Goal', analysisData.formData?.primaryGoal || 'N/A'],
      ['Target Amount', `$${analysisData.formData?.targetInvestmentAmount || 0}`],
      ['Time Horizon', `${analysisData.formData?.targetYears || 0} years`],
      ...analysisData.investmentStrategy.map((s: any) => [
        s.title,
        `${s.allocationPercentage || 0}% - ${s.description.substring(0, 50)}...`
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financial-data-${sessionId}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    setMessage('CSV downloaded successfully!');
    setMessageType('success');
  };

  const handleShareLink = () => {
    const shareUrl = `${window.location.origin}/#report-${sessionId}`;
    navigator.clipboard.writeText(shareUrl);
    setMessage('Shareable link copied to clipboard!');
    setMessageType('success');
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Export & Share</h3>

      {message && (
        <div className={`mb-4 p-3 rounded-lg ${messageType === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message}
        </div>
      )}

      <div className="space-y-4">
        {/* Email Export */}
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email (will copy link to clipboard)"
            className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <button
            onClick={handleEmailExport}
            disabled={isSending || !email}
            className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isSending ? 'Copying Link...' : 'Copy & Email Link'}
          </button>
        </div>

        {/* File Exports */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={handlePDFExport}
            className="p-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
          >
            Download PDF
          </button>

          <button
            onClick={handleCSVExport}
            className="p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
          >
            Download CSV
          </button>

          <button
            onClick={handleShareLink}
            className="p-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
          >
            Copy Share Link
          </button>
        </div>

        <div className="text-xs text-gray-500 pt-2 border-t border-gray-100">
          <p>• PDF: Full report with professional formatting</p>
          <p>• CSV: Financial data for spreadsheet analysis</p>
          <p>• Share: Copy link to share your analysis</p>
          <p className="text-blue-600 mt-2">💡your analysis is complete</p>
        </div>
      </div>
    </div>
  );
};

export default ExportButtons;