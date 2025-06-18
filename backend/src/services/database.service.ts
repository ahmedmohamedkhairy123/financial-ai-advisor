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
      userId, // ✅ This can be null for guests
      formData,
      analysisResult,
      processingTime,
      ipAddress,
      userAgent,
    } = params;

    console.log(`💾 Saving analysis for ${userId ? 'user: ' + userId : 'guest'}`);
    
    const analysis = new FinancialAnalysis({
      sessionId,
      userId, // ✅ This will be saved as null for guests
      formData,
      analysisResult,
      metadata: {
        ipAddress,
        userAgent,
        processingTime,
      },
    });

    const savedAnalysis = await analysis.save();
    console.log(`✅ Analysis saved with ID: ${savedAnalysis._id}, User: ${savedAnalysis.userId || 'guest'}`);
    
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

    // Update the getUserAnalyses method to use proper typing
    static async getUserAnalyses(userId: string, limit: number = 10): Promise<any[]> {
        try {
            return await FinancialAnalysis.find({ userId })
                .sort({ createdAt: -1 })
                .limit(limit)
                .select('formData.primaryGoal formData.targetInvestmentAmount formData.targetYears analysisResult.feasibilityColor createdAt sessionId');
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