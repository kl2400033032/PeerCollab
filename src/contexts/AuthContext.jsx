import { useEffect, useState } from 'react';
import {
  getCurrentUser,
  initializeCsrf,
  login as loginRequest,
  logout as logoutRequest,
  register as registerRequest,
} from '../services/authService';
import { clearLegacyAuth } from '../utils/storage';
import { AuthContext } from './AuthContextObject';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      clearLegacyAuth();

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
    setUser(response.user);
    return response;
  };

  const register = async (payload) => {
    const response = await registerRequest(payload);
    setUser(response.user);
    return response;
  };

  const logout = async () => {
    try {
      await logoutRequest();
    } catch {
      // Clear local state even if the backend cookie is already gone.
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: Boolean(user), isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
