import React from 'react';
import { AIAnalysisResult, FeasibilityStatus } from '../types';
import { TrafficLight } from './TrafficLight';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface AnalysisReportProps {
    data: AIAnalysisResult;
    onReset: () => void;
}

export const AnalysisReport: React.FC<AnalysisReportProps> = ({ data, onReset }) => {

    // Prepare data for the chart
    const chartData = data.investmentStrategy
        .filter(item => item.allocationPercentage && item.allocationPercentage > 0)
        .map(item => ({
            name: item.title,
            value: item.allocationPercentage,
        }));

    const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#6366F1'];

    return (
        <div className="animate-fade-in max-w-5xl mx-auto space-y-8 pb-12">

            {/* Header Section */}
            <div className="text-center space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Financial Strategy Report</h2>
                <p className="text-gray-500">Personalized Roadmap & Feasibility Analysis</p>
            </div>

            {/* Traffic Light & Status */}
            <div className="flex justify-center my-8">
                <TrafficLight status={data.feasibilityColor} />
            </div>

            <div className={`p-6 rounded-xl border-l-8 shadow-sm ${data.feasibilityColor === FeasibilityStatus.RED ? 'bg-red-50 border-red-500' :
                    data.feasibilityColor === FeasibilityStatus.YELLOW ? 'bg-yellow-50 border-yellow-400' :
                        'bg-green-50 border-green-500'
                }`}>
                <h3 className="text-2xl font-bold mb-2 text-gray-800">{data.feasibilityTitle}</h3>
                <p className="text-gray-700 leading-relaxed">{data.feasibilityExplanation}</p>
            </div>

            {/* Prediction Section */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 md:p-8 rounded-2xl shadow-lg border border-slate-700">
                <h3 className="text-xl font-bold mb-4 flex items-center text-blue-300">
                    <span className="text-2xl mr-3">🔮</span>
                    AI Prediction & Outlook
                </h3>
                <p className="text-slate-100 leading-relaxed whitespace-pre-line text-lg font-light">
                    {data.projectedOutcome}
                </p>
            </div>

            {/* Executive Summary */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <span className="bg-blue-100 text-blue-600 p-2 rounded-lg mr-3">📝</span>
                    Executive Summary
                </h3>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">{data.executiveSummary}</p>
            </div>

            {/* Strategy Grid */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Allocation Chart */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
                    <h3 className="text-lg font-bold text-gray-800 mb-6">Optimized Portfolio Allocation</h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                <XAxis type="number" domain={[0, 100]} hide />
                                <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 11 }} />
                                <Tooltip />
                                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Risk Profile */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Risk & Psychology</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{data.riskAssessment}</p>

                    <h3 className="text-lg font-bold text-gray-800 mt-6 mb-4">Action Plan</h3>
                    <ul className="space-y-3">
                        {data.nextSteps.map((step, idx) => (
                            <li key={idx} className="flex items-start text-sm text-gray-600">
                                <span className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 text-green-700 text-xs font-bold mr-3 mt-0.5">✓</span>
                                {step}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Detailed Strategy */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                    <span className="bg-purple-100 text-purple-600 p-2 rounded-lg mr-3">🚀</span>
                    Advanced Investment Strategy
                </h3>
                <div className="space-y-8">
                    {data.investmentStrategy.map((strat, idx) => (
                        <div key={idx} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                            <div className="flex justify-between items-baseline mb-2">
                                <h4 className="text-lg font-semibold text-gray-800">{strat.title}</h4>
                                {strat.allocationPercentage && (
                                    <span className="text-sm font-bold bg-gray-100 px-3 py-1 rounded-full text-gray-600">
                                        {strat.allocationPercentage}%
                                    </span>
                                )}
                            </div>
                            <p className="text-gray-600 mb-3 text-sm">{strat.description}</p>
                            <div className="flex flex-wrap gap-2">
                                <span className="text-xs font-semibold text-gray-500 py-1">Recommended Instruments:</span>
                                {strat.assets.map((asset, aIdx) => (
                                    <span key={aIdx} className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded border border-indigo-100">
                                        {asset}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-center pt-8">
                <button
                    onClick={onReset}
                    className="bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 px-8 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                    Start New Analysis
                </button>
            </div>
        </div>
    );
};