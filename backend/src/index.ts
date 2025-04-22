import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { connectDB, getConnectionStatus } from './db/connection';
import analysisRoutes from './routes/analysis.routes';
import databaseRoutes from './routes/database.routes';
import authRoutes from './routes/auth.routes';
import exportRoutes from './routes/export.routes'; // ✅ ADD

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// ========== CORS CONFIGURATION ==========
const corsOptions = {
    origin: FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Session-Id']
};

app.use(cors(corsOptions));

// Handle preflight OPTIONS requests
app.options('*', cors(corsOptions));

// ========== OTHER MIDDLEWARE ==========
app.use(helmet());

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ========== DATABASE ==========
connectDB().then(() => {
    console.log('✅ Database connection initialized');
}).catch((error) => {
    console.error('❌ Failed to initialize database:', error);
});

// ========== TEST ROUTE ==========
app.get('/', (req, res) => {
    res.json({
        message: 'Financial Advisor API',
        version: '1.0.0',
        status: 'running'
    });
});

// ========== API ROUTES ==========
app.use('/api/auth', authRoutes);
app.use('/api/export', exportRoutes); // ✅ ADD
app.use('/api/analysis', analysisRoutes);
app.use('/api/db', databaseRoutes);

// ========== HEALTH CHECK ==========
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        database: getConnectionStatus() ? 'connected' : 'disconnected'
    });
});

// ========== DEBUG ROUTE ==========
app.get('/debug', (req, res) => {
    const routes: any[] = [];
    
    function printRoutes(layer: any, path = '') {
        if (layer.route) {
            routes.push({
                path: path + layer.route.path,
                methods: Object.keys(layer.route.methods)
            });
        } else if (layer.name === 'router' && layer.handle.stack) {
            layer.handle.stack.forEach((stackItem: any) => {
                printRoutes(stackItem, path);
            });
        }
    }
    
    app._router.stack.forEach(printRoutes);
    
    res.json({ routes });
});

// ========== ERROR HANDLERS ==========
// 404 handler
app.use('*', (req, res) => {
    console.log(`❌ 404: ${req.method} ${req.originalUrl}`);
    res.status(404).json({
        error: 'Route not found',
        requestedUrl: req.originalUrl,
        method: req.method
    });
});

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('❌ Server error:', err.message);
    res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// ========== START SERVER ==========
app.listen(PORT, () => {
    console.log(`🚀 Backend server running on port ${PORT}`);
    console.log(`🌐 Frontend: ${FRONTEND_URL}`);
    console.log(`🔐 Auth: POST ${FRONTEND_URL}/api/auth/register`);
    console.log(`📊 Health: http://localhost:${PORT}/api/health`);
});