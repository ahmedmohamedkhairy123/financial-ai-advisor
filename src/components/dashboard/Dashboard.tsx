import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { getAnalysisHistory } from '../../services/geminiService';
interface AnalysisHistory {
    id: string;
    sessionId: string;
    goal: string;
    amount: number;
    years: number;
    feasibility: string;
    createdAt: string;
}

const Dashboard: React.FC = () => {
    const { user, logout } = useAuth();
    const [history, setHistory] = useState<AnalysisHistory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        // Get history from localStorage instead of backend API
        const fetchLocalHistory = () => {
            try {
                // Import the function we created in geminiService.ts
                const history = getAnalysisHistory();

                // Filter for current user if logged in
                const userHistory = history.filter((item: any) => {
                    if (!user) {
                        // Show guest analyses when not logged in
                        return item.userId === 'guest';
                    }
                    // Show user's analyses when logged in
                    return item.userId === user.id || item.userId === 'guest';
                });

                // Transform to match the expected format
                const formattedHistory = userHistory.map((item: any) => ({
                    id: item.id,
                    sessionId: item.id,
                    goal: item.formData?.primaryGoal || 'Financial Analysis',
                    amount: item.formData?.targetInvestmentAmount || 0,
                    years: item.formData?.targetYears || 0,
                    feasibility: item.result?.feasibilityColor || 'YELLOW',
                    createdAt: item.timestamp || new Date().toISOString(),
                }));

                setHistory(formattedHistory);

                if (formattedHistory.length === 0) {
                    setError('No analysis history yet. Create your first analysis!');
                }
            } catch (err: any) {
                console.error('Failed to load history:', err);
                setError('Failed to load analysis history from local storage');
            } finally {
                setIsLoading(false);
            }
        };

        fetchLocalHistory();
    }, [user]); // Add user to dependency array

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const getFeasibilityColor = (status: string) => {
        switch (status) {
            case 'GREEN': return 'bg-green-100 text-green-800';
            case 'YELLOW': return 'bg-yellow-100 text-yellow-800';
            case 'RED': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const handleLogout = () => {
        logout();
        window.location.href = '/login';
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div className="flex items-center">
                            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                            <span className="ml-4 text-sm text-gray-500">
                                Welcome back, {user?.fullName}!
                            </span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link
                                to="/"
                                className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800"
                            >
                                New Analysis
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-800"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                            <dt className="text-sm font-medium text-gray-500 truncate">
                                Total Analyses
                            </dt>
                            <dd className="mt-1 text-3xl font-semibold text-gray-900">
                                {history.length}
                            </dd>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                            <dt className="text-sm font-medium text-gray-500 truncate">
                                Member Since
                            </dt>
                            <dd className="mt-1 text-3xl font-semibold text-gray-900">
                                {user?.createdAt ? new Date(user.createdAt).getFullYear() : '2024'}
                            </dd>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                            <Link
                                to="/"
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                + New Analysis
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Analysis History */}
                <div className="bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:px-6">
                        <h2 className="text-lg font-medium text-gray-900">Analysis History</h2>
                        <p className="mt-1 text-sm text-gray-500">
                            Your previous financial analyses and reports
                        </p>
                    </div>

                    {isLoading ? (
                        <div className="px-4 py-12 sm:px-6 text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="mt-4 text-sm text-gray-500">Loading your history...</p>
                        </div>
                    ) : error ? (
                        <div className="px-4 py-12 sm:px-6 text-center">
                            <p className="text-red-600">{error}</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="mt-4 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800"
                            >
                                Try Again
                            </button>
                        </div>
                    ) : history.length === 0 ? (
                        <div className="px-4 py-12 sm:px-6 text-center">
                            <p className="text-gray-500">No analysis history yet</p>
                            <Link
                                to="/"
                                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                            >
                                Create Your First Analysis
                            </Link>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Goal
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Target Amount
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Time Horizon
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Feasibility
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {history.map((analysis) => (
                                        <tr key={analysis.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {analysis.goal}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatCurrency(analysis.amount)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {analysis.years} years
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getFeasibilityColor(analysis.feasibility)}`}>
                                                    {analysis.feasibility}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatDate(analysis.createdAt)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <Link
                                                    to={`/analysis/${analysis.sessionId}`}
                                                    className="text-blue-600 hover:text-blue-900"
                                                >
                                                    View
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;