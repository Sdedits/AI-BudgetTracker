import { useState, createContext, useContext, useEffect, type ReactNode } from 'react';
import { loginUser as loginApi, getProfile } from '../services/api';
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
    const [isValidating, setIsValidating] = useState<boolean>(true);
    const navigate = useNavigate();

    // Validate token on mount
    useEffect(() => {
        const validateToken = async () => {
            const storedToken = localStorage.getItem('token');
            if (!storedToken) {
                setIsValidating(false);
                return;
            }

            try {
                // Try to fetch profile with the stored token
                await getProfile(storedToken);
                // Token is valid
                setToken(storedToken);
            } catch (err) {
                // Token is invalid or expired - clear it
                console.warn('Stored token is invalid, clearing...');
                setToken(null);
                localStorage.removeItem('token');
            } finally {
                setIsValidating(false);
            }
        };

        validateToken();
    }, []);

    const login = async (credentials: LoginRequest) => {
        try {
            const res = await loginApi(credentials);
            const userToken = res.data.token;
            setToken(userToken);
            localStorage.setItem('token', userToken);
            navigate('/dashboard');
        } catch (err) {
            // Normalize and propagate server error message so UI can show friendly messages
            let msg = 'Login failed! Please check your credentials.';
            try {
                const anyErr: any = err;
                if (anyErr && anyErr.response) {
                    const data = anyErr.response.data;
                    if (typeof data === 'string') {
                        msg = data;
                    } else if (data && typeof data.message === 'string') {
                        msg = data.message;
                    }
                } else if (err instanceof Error) {
                    msg = err.message;
                }
            } catch (e) {
                // ignore parsing errors and use default message
            }
            throw new Error(msg);
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

    // Show nothing while validating token to avoid flashing wrong UI
    if (isValidating) {
        return null;
    }

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