import { useState, useEffect, type ReactNode } from 'react';
import { authService } from '@/lib/services/auth.service';
import type { AuthUser } from '@/lib/types/api.types';
import { AuthContext } from './auth-context';

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  const refreshUser = async () => {
    try {
      const user = await authService.me();
      setState({
        user,
        isLoading: false,
        isAuthenticated: true,
      });
    } catch {
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
    }
  };

  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      try {
        const user = await authService.me();
        if (isMounted) {
          setState({
            user,
            isLoading: false,
            isAuthenticated: true,
          });
        }
      } catch {
        if (isMounted) {
          setState({
            user: null,
            isLoading: false,
            isAuthenticated: false,
          });
        }
      }
    };

    initAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (username: string, password: string) => {
    const user = await authService.login({ username, password });
    setState({
      user,
      isLoading: false,
      isAuthenticated: true,
    });
  };

  const signup = async (username: string, password: string) => {
    const user = await authService.signup({ username, password });
    setState({
      user,
      isLoading: false,
      isAuthenticated: true,
    });
  };

  const logout = async () => {
    await authService.logout();
    setState({
      user: null,
      isLoading: false,
      isAuthenticated: false,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        signup,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
