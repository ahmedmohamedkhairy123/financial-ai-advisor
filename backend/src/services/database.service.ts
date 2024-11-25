import mongoose from 'mongoose';
import { FinancialAnalysis } from '../models/FinancialAnalysis.model';

interface SaveAnalysisParams {
    sessionId: string;
    userId?: string;
    formData: any;
    analysisResult: any;
    processingTime: number;
    ipAddress?: string;
    userAgent?: string;
}

export class DatabaseService {
    // Save analysis to database
    static async saveAnalysis(params: SaveAnalysisParams): Promise<any> {
        try {
            const {
                sessionId,
                userId,
                formData,
                analysisResult,
                processingTime,
                ipAddress,
                userAgent,
            } = params;

            const analysis = new FinancialAnalysis({
                sessionId,
                userId,
                formData,
                analysisResult,
                metadata: {
                    ipAddress,
                    userAgent,
                    processingTime,
                },
            });

            const savedAnalysis = await analysis.save();
            console.log(`💾 Analysis saved to database with ID: ${savedAnalysis._id}`);

            return savedAnalysis;
        } catch (error: any) {
            console.error('❌ Failed to save analysis to database:', error.message);
            throw new Error(`Database save failed: ${error.message}`);
        }
    }

    // Get analysis by session ID
    static async getAnalysisBySessionId(sessionId: string): Promise<any | null> {
        try {
            return await FinancialAnalysis.findOne({ sessionId })
                .sort({ createdAt: -1 })
                .limit(1);
        } catch (error: any) {
            console.error('❌ Failed to fetch analysis:', error.message);
            throw error;
        }
    }

    // Get all analyses for a user (future use)
    static async getUserAnalyses(userId: string, limit: number = 10): Promise<any[]> {
        try {
            return await FinancialAnalysis.find({ userId })
                .sort({ createdAt: -1 })
                .limit(limit);
        } catch (error: any) {
            console.error('❌ Failed to fetch user analyses:', error.message);
            throw error;
        }
    }

    // Delete analysis by ID
    static async deleteAnalysis(id: string): Promise<boolean> {
        try {
            const result = await FinancialAnalysis.findByIdAndDelete(id);
            return !!result;
        } catch (error: any) {
            console.error('❌ Failed to delete analysis:', error.message);
            throw error;
        }
    }

    // Get statistics
    static async getStatistics(): Promise<{
        totalAnalyses: number;
        todayAnalyses: number;
        averageProcessingTime: number;
    }> {
        try {
            const totalAnalyses = await FinancialAnalysis.countDocuments();

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const todayAnalyses = await FinancialAnalysis.countDocuments({
                createdAt: { $gte: today },
            });

            const avgResult = await FinancialAnalysis.aggregate([
                {
                    $group: {
                        _id: null,
                        avgProcessingTime: { $avg: '$metadata.processingTime' },
                    },
                },
            ]);

            const averageProcessingTime = avgResult[0]?.avgProcessingTime || 0;

            return {
                totalAnalyses,
                todayAnalyses,
                averageProcessingTime: Math.round(averageProcessingTime),
            };
        } catch (error: any) {
            console.error('❌ Failed to get statistics:', error.message);
            return {
                totalAnalyses: 0,
                todayAnalyses: 0,
                averageProcessingTime: 0,
            };
        }
    }
}