import { Router } from 'express';
import { DatabaseService } from '../services/database.service';

const router = Router();

// GET /api/db/stats - Get database statistics
router.get('/stats', async (req, res) => {
    try {
        const stats = await DatabaseService.getStatistics();
        res.json({
            success: true,
            data: stats,
            timestamp: new Date().toISOString()
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch statistics',
            details: error.message
        });
    }
});

// GET /api/db/analysis/:sessionId - Get analysis by session ID
router.get('/analysis/:sessionId', async (req, res) => {
    try {
        const { sessionId } = req.params;

        if (!sessionId) {
            return res.status(400).json({
                success: false,
                error: 'sessionId is required'
            });
        }

        const analysis = await DatabaseService.getAnalysisBySessionId(sessionId);

        if (!analysis) {
            return res.status(404).json({
                success: false,
                error: 'Analysis not found'
            });
        }

        res.json({
            success: true,
            data: analysis,
            timestamp: new Date().toISOString()
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch analysis',
            details: error.message
        });
    }
});

// DELETE /api/db/analysis/:id - Delete analysis by ID (admin only)
router.delete('/analysis/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                error: 'Analysis ID is required'
            });
        }

        const deleted = await DatabaseService.deleteAnalysis(id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                error: 'Analysis not found'
            });
        }

        res.json({
            success: true,
            message: 'Analysis deleted successfully',
            timestamp: new Date().toISOString()
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: 'Failed to delete analysis',
            details: error.message
        });
    }
});

export default router;