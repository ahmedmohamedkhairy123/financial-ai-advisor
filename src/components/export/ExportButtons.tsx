import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface ExportButtonsProps {
  sessionId?: string; // ✅ Made optional
  analysisData: any;
}

const ExportButtons: React.FC<ExportButtonsProps> = ({ sessionId, analysisData }) => {
  const [email, setEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isGeneratingCSV, setIsGeneratingCSV] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  const { token } = useAuth();

  // Check if user is authenticated and has sessionId
  const isAuthenticated = !!token;
  const hasSessionId = !!sessionId;
  const canExport = isAuthenticated && hasSessionId;

  const handleEmailExport = async () => {
    if (!canExport) {
      setMessage('Please login to use email export');
      setMessageType('error');
      return;
    }

    if (!email || !email.includes('@')) {
      setMessage('Please enter a valid email address');
      setMessageType('error');
      return;
    }

    setIsSending(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/export/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          analysisId: sessionId,
          email: email,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Report sent to email successfully!');
        setMessageType('success');
        setEmail('');
      } else {
        setMessage(data.error || 'Failed to send email');
        setMessageType('error');
      }
    } catch (error: any) {
      setMessage('Failed to send email. Please try again.');
      setMessageType('error');
    } finally {
      setIsSending(false);
    }
  };

  const handlePDFExport = async () => {
    if (!canExport) {
      setMessage('Please login to download PDF');
      setMessageType('error');
      return;
    }

    setIsGeneratingPDF(true);
    setMessage('');

    try {
      const response = await fetch(`http://localhost:5000/api/export/pdf/${sessionId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `financial-report-${sessionId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      setMessage('PDF downloaded successfully!');
      setMessageType('success');
    } catch (error: any) {
      setMessage('Failed to generate PDF. Please try again.');
      setMessageType('error');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleCSVExport = async () => {
    if (!canExport) {
      setMessage('Please login to download CSV');
      setMessageType('error');
      return;
    }

    setIsGeneratingCSV(true);
    setMessage('');

    try {
      const response = await fetch(`http://localhost:5000/api/export/csv/${sessionId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to generate CSV');
      }

      const blob = await response.blob();
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
    } catch (error: any) {
      setMessage('Failed to generate CSV. Please try again.');
      setMessageType('error');
    } finally {
      setIsGeneratingCSV(false);
    }
  };

  const handleShareLink = () => {
    if (!sessionId) {
      setMessage('Cannot generate share link without session ID');
      setMessageType('error');
      return;
    }

    const shareUrl = `${window.location.origin}/report/${sessionId}`;
    navigator.clipboard.writeText(shareUrl);
    setMessage('Shareable link copied to clipboard!');
    setMessageType('success');
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Export & Share</h3>
      
      {!isAuthenticated && (
        <div className="mb-4 p-3 bg-yellow-50 text-yellow-700 rounded-lg">
          ⚠️ Please login to use export features
        </div>
      )}

      {isAuthenticated && !hasSessionId && (
        <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-lg">
          ℹ️ Export available for new analyses (older analyses may not have session ID)
        </div>
      )}

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
            placeholder="Enter email to send report"
            className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            disabled={!canExport}
          />
          <button
            onClick={handleEmailExport}
            disabled={isSending || !email || !canExport}
            className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isSending ? 'Sending...' : 'Email Report'}
          </button>
        </div>

        {/* File Exports */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={handlePDFExport}
            disabled={isGeneratingPDF || !canExport}
            className="p-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center"
          >
            {isGeneratingPDF ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </>
            ) : (
              'Download PDF'
            )}
          </button>

          <button
            onClick={handleCSVExport}
            disabled={isGeneratingCSV || !canExport}
            className="p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center"
          >
            {isGeneratingCSV ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </>
            ) : (
              'Download CSV'
            )}
          </button>

          <button
            onClick={handleShareLink}
            disabled={!sessionId}
            className="p-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            Copy Share Link
          </button>
        </div>

        <div className="text-xs text-gray-500 pt-2 border-t border-gray-100">
          <p>• PDF includes full report with charts and analysis</p>
          <p>• CSV contains raw financial data for spreadsheet analysis</p>
          <p>• Share link allows viewing without login (public access)</p>
          {!isAuthenticated && <p className="text-red-500">• Login required for export features</p>}
        </div>
      </div>
    </div>
  );
};

export default ExportButtons;