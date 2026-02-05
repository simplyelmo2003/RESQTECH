import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { AuthContextType, User, AuthState, UserRole } from '@/types/auth';
import { login as apiLogin, logout as apiLogout } from '@/api/auth'; // Ensure these functions exist in your API
import { useNotification } from '@/hooks/useNotifications'; // Import useNotification hook

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(initialState);
  const { addNotification } = useNotification();

  // Function to load user from local storage
  const loadUser = useCallback(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const user: User = JSON.parse(storedUser);
        // Basic token validation (e.g., check if not expired, or presence)
        // In a real app, you'd send the token to the backend to validate/refresh
        if (user.token) {
          setAuthState({
            user,
            isAuthenticated: true,
            loading: false,
            error: null,
          });
        } else {
          setAuthState({ ...initialState, loading: false });
          localStorage.removeItem('user'); // Clear invalid token
        }
      } else {
        setAuthState({ ...initialState, loading: false });
      }
    } catch (error) {
      console.error("Failed to load user from local storage:", error);
      setAuthState({ ...initialState, loading: false });
      localStorage.removeItem('user');
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (username: string, password: string) => {
    setAuthState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      console.log('🔓 AuthContext.login - calling apiLogin for:', username);
      const response = await apiLogin(username, password); // Your API call
      console.log('🔓 AuthContext.login - response:', response);
      
      // Backend may return response.data or response directly (depending on apiPost wrapper)
      const userData = response.data || response;
      console.log('🔓 AuthContext.login - extracted userData:', userData);
      
      const newUser: User = {
        id: userData.id,
        username: userData.username,
        email: userData.email || userData.username, // Fallback to username if email not provided
        role: userData.role as UserRole,
        barangayId: userData.barangayId || null,
        token: userData.token,
      };

      console.log('🔓 AuthContext.login - constructed newUser:', newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      setAuthState({
        user: newUser,
        isAuthenticated: true,
        loading: false,
        error: null,
      });
      addNotification({ type: 'success', message: `Welcome back, ${newUser.username}!` });
    } catch (err: any) {
      console.error('🔓 AuthContext.login - error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Login failed. Please check your credentials.';
      setAuthState((prev) => ({ ...prev, loading: false, error: errorMessage }));
      addNotification({ type: 'error', message: errorMessage });
      throw err; // Re-throw to allow component to handle it if needed
    }
  };

  const logout = async () => {
    try {
      await apiLogout(); // Call your logout API if it invalidates tokens
    } catch (err) {
      console.error('Error during API logout:', err);
      addNotification({ type: 'warning', message: 'Logged out but encountered an issue with server session. Please verify.' });
    } finally {
      localStorage.removeItem('user');
      setAuthState({ ...initialState, loading: false, isAuthenticated: false, user: null });
      addNotification({ type: 'info', message: 'You have been logged out.' });
    }
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};