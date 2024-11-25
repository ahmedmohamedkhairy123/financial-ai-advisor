import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { connectDB, getConnectionStatus } from './db/connection';
import analysisRoutes from './routes/analysis.routes';
import databaseRoutes from './routes/database.routes'; // We'll create this next

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Middleware
app.use(helmet());
app.use(cors({
    origin: FRONTEND_URL,
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to database
connectDB().then(() => {
    console.log('✅ Database connection initialized');
}).catch((error) => {
    console.error('❌ Failed to initialize database:', error);
});

// Routes
app.use('/api/analysis', analysisRoutes);
app.use('/api/db', databaseRoutes);

// Enhanced health check
app.get('/api/health', (req, res) => {
    const dbStatus = getConnectionStatus() ? 'connected' : 'disconnected';

    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'Financial Advisor Backend',
        database: dbStatus,
        endpoints: {
            analysis: '/api/analysis',
            database: '/api/db',
            health: '/api/health'
        }
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('❌ Server error:', err.stack);
    res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Backend server running on port ${PORT}`);
    console.log(`🌐 Frontend URL: ${FRONTEND_URL}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🗄️  Database: ${process.env.DB_NAME || 'financial-advisor'}`);
});