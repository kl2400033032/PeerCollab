import { useEffect, useState } from 'react';
import {
  getCurrentUser,
  initializeCsrf,
  login as loginRequest,
  logout as logoutRequest,
  register as registerRequest,
} from '../services/authService';
import { clearLegacyAuth, clearStoredAuth, saveAuthSession } from '../utils/storage';
import { AuthContext } from './AuthContextObject';

const authMode = import.meta.env.VITE_AUTH_MODE || 'cookie';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      if (authMode === 'cookie') {
        clearLegacyAuth();
      }

      try {
        await initializeCsrf();
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    bootstrap();
  }, []);

  const login = async (payload) => {
    const response = await loginRequest(payload);
    if (authMode === 'bearer') {
      saveAuthSession(response.token, response.user);
    }
    setUser(response.user);
    return response;
  };

  const register = async (payload) => {
    const response = await registerRequest(payload);
    if (authMode === 'bearer') {
      saveAuthSession(response.token, response.user);
    }
    setUser(response.user);
    return response;
  };

  const logout = async () => {
    try {
      await logoutRequest();
    } catch {
      // Clear local state even if the backend cookie is already gone.
    }
    clearStoredAuth();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: Boolean(user), isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
