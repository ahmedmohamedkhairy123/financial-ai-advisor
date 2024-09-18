import React from 'react';
import { AIAnalysisResult } from '../types';

interface AnalysisReportProps {
    data: AIAnalysisResult;
    onReset: () => void;
}

export const AnalysisReport: React.FC<AnalysisReportProps> = ({ data, onReset }) => {
    return (
        <div className="max-w-4xl mx-auto p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Financial Analysis Report</h2>
            <p className="text-gray-600 mb-8">Full report component coming in Phase 9...</p>

            <div className="bg-white p-6 rounded-xl shadow-lg border">
                <h3 className="text-xl font-bold mb-4">Preview of AI Response:</h3>
                <pre className="bg-gray-50 p-4 rounded-lg overflow-auto text-sm">
                    {JSON.stringify(data, null, 2)}
                </pre>
            </div>

            <button
                onClick={onReset}
                className="mt-8 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold"
            >
                Back to Form
            </button>
        </div>
    );
};