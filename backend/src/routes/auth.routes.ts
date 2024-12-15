import { Router } from 'express';
import { User } from '../models/User.model';
import { generateToken } from '../utils/jwt.utils';
import { authenticate, AuthenticatedRequest } from '../middleware/auth.middleware';

const router = Router();

// ========== ROUTES ==========

// POST /api/auth/register - Register new user
router.post('/register', async (req, res) => {
    console.log('📝 Register attempt:', req.body.email);

    try {
        const { email, password, fullName } = req.body;

        // Validation
        if (!email || !password || !fullName) {
            return res.status(400).json({
                success: false,
                error: 'Please provide email, password, and full name',
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                error: 'User with this email already exists',
            });
        }

        // Create new user
        const user = new User({
            email,
            password,
            fullName,
        });

        await user.save();
        console.log('✅ User registered:', user.email);

        // Generate JWT token
        const token = generateToken({
            userId: user._id.toString(),
            email: user.email,
        });

        // Return user and token
        res.status(201).json({
            success: true,
            message: 'Registration successful',
            data: {
                user: {
                    id: user._id,
                    email: user.email,
                    fullName: user.fullName,
                    createdAt: user.createdAt,
                },
                token,
            },
        });
    } catch (error: any) {
        console.error('❌ Registration error:', error);

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                error: Object.values(error.errors).map((err: any) => err.message).join(', '),
            });
        }

        res.status(500).json({
            success: false,
            error: 'Registration failed. Please try again.',
        });
    }
});

// POST /api/auth/login - Login user
router.post('/login', async (req, res) => {
    console.log('🔐 Login attempt:', req.body.email);

    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Please provide email and password',
            });
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            console.log('❌ User not found:', email);
            return res.status(401).json({
                success: false,
                error: 'Invalid email or password',
            });
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            console.log('❌ Invalid password for:', email);
            return res.status(401).json({
                success: false,
                error: 'Invalid email or password',
            });
        }

        // Generate JWT token
        const token = generateToken({
            userId: user._id.toString(),
            email: user.email,
        });

        console.log('✅ User logged in:', user.email);

        // Return user and token
        res.json({
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    id: user._id,
                    email: user.email,
                    fullName: user.fullName,
                    createdAt: user.createdAt,
                },
                token,
            },
        });
    } catch (error: any) {
        console.error('❌ Login error:', error);
        res.status(500).json({
            success: false,
            error: 'Login failed. Please try again.',
        });
    }
});

// GET /api/auth/me - Get current user profile (protected)
router.get('/me', authenticate, async (req: AuthenticatedRequest, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found',
            });
        }

        res.json({
            success: true,
            data: user,
        });
    } catch (error: any) {
        console.error('❌ Get profile error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get user profile',
        });
    }
});

// POST /api/auth/logout - Logout (client-side)
router.post('/logout', authenticate, (req: AuthenticatedRequest, res) => {
    res.json({
        success: true,
        message: 'Logout successful',
    });
});

// GET /api/auth/test - Simple test endpoint
router.get('/test', (req, res) => {
    res.json({
        success: true,
        message: 'Auth routes are working!',
        timestamp: new Date().toISOString(),
        endpoints: {
            register: 'POST /register',
            login: 'POST /login',
            profile: 'GET /me',
            logout: 'POST /logout',
            test: 'GET /test'
        }
    });
});

// ✅ MUST EXPORT THE ROUTER
export default router;