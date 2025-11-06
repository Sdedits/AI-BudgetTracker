import { useState, createContext, useContext, type ReactNode } from 'react';
import { loginUser as loginApi } from '../services/api';
import { useNavigate } from 'react-router-dom';
import type { LoginRequest } from '../types/index';

interface AuthContextType {
    token: string | null;
    isAuthenticated: boolean;
    login: (credentials: LoginRequest) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const navigate = useNavigate();

    const login = async (credentials: LoginRequest) => {
        try {
            const res = await loginApi(credentials);
            const userToken = res.data.token;
            setToken(userToken);
            localStorage.setItem('token', userToken);
            navigate('/profile');
        } catch (err) {
            alert('Login failed! Please check your credentials.');
        }
    };

    const logout = () => {
        setToken(null);
        localStorage.removeItem('token');
        navigate('/login');
    };
    
    const authInfo: AuthContextType = {
        token,
        isAuthenticated: !!token,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};