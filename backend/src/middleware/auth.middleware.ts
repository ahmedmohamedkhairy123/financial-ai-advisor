import { Request, Response, NextFunction } from 'express';
import { verifyToken, extractTokenFromHeader } from '../utils/jwt.utils';
import { User } from '../models/User.model';

export interface AuthenticatedRequest extends Request {
    user?: any;
    userId?: string;
}

export const authenticate = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // Get token from header
        const token = extractTokenFromHeader(req.headers.authorization);

        if (!token) {
            res.status(401).json({
                success: false,
                error: 'Access denied. No token provided.',
            });
            return;
        }

        // Verify token
        const decoded = verifyToken(token);

        // Check if user still exists
        const user = await User.findById(decoded.userId).select('-password');

        if (!user) {
            res.status(401).json({
                success: false,
                error: 'User no longer exists.',
            });
            return;
        }

        // Attach user to request
        req.user = user;
        req.userId = decoded.userId;

        next();
    } catch (error: any) {
        console.error('Authentication error:', error.message);

        if (error.message === 'Invalid or expired token') {
            res.status(401).json({
                success: false,
                error: 'Invalid or expired token. Please login again.',
            });
        } else {
            res.status(500).json({
                success: false,
                error: 'Authentication failed',
            });
        }
    }
};

// Optional: Role-based authorization
export const requireRole = (role: string) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            res.status(401).json({
                success: false,
                error: 'Authentication required',
            });
            return;
        }

        // Add role checking logic here if needed
        // For now, just pass through
        next();
    };
};