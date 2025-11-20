import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

interface User {
    id: string;
    email: string;
    fullName: string;
    createdAt: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, fullName: string) => Promise<void>;
    logout: () => void;
    updateToken: (newToken: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(() => {
        const saved = localStorage.getItem('mockUser');
        return saved ? JSON.parse(saved) : null;
    });

    const [token, setToken] = useState<string | null>(localStorage.getItem('mockToken'));
    const [isLoading, setIsLoading] = useState(false);

    // Mock login (no backend needed)
    const login = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500));

            // Create mock user
            const mockUser: User = {
                id: `user_${Date.now()}`,
                email,
                fullName: email.split('@')[0],
                createdAt: new Date().toISOString()
            };

            const mockToken = `mock_jwt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

            localStorage.setItem('mockUser', JSON.stringify(mockUser));
            localStorage.setItem('mockToken', mockToken);
            localStorage.setItem('currentUserId', mockUser.id);

            setUser(mockUser);
            setToken(mockToken);

        } catch (error: any) {
            throw new Error('Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Mock registration
    const register = async (email: string, password: string, fullName: string) => {
        setIsLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 500));

            const mockUser: User = {
                id: `user_${Date.now()}`,
                email,
                fullName,
                createdAt: new Date().toISOString()
            };

            const mockToken = `mock_jwt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

            localStorage.setItem('mockUser', JSON.stringify(mockUser));
            localStorage.setItem('mockToken', mockToken);
            localStorage.setItem('currentUserId', mockUser.id);

            setUser(mockUser);
            setToken(mockToken);

        } catch (error: any) {
            throw new Error('Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('mockUser');
        localStorage.removeItem('mockToken');
        localStorage.removeItem('currentUserId');
        setUser(null);
        setToken(null);
    };

    const updateToken = (newToken: string) => {
        localStorage.setItem('mockToken', newToken);
        setToken(newToken);
    };

    return (
        <AuthContext.Provider value={{ user, token, isLoading, login, register, logout, updateToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};