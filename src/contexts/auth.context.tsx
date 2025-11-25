import { useState, useEffect, useRef, useCallback, type ReactNode } from 'react';
import { api } from '@/lib/api-client';
import { API_ENDPOINTS } from '@/lib/api-config';
import type { AuthUser, AuthResponse, LoginRequest, SignupRequest } from '@/lib/types/api.types';
import { AuthContext } from './auth-context';

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface DialogHandlers {
  openLogin: () => void;
  openSignup: () => void;
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
  
  const dialogHandlersRef = useRef<DialogHandlers | null>(null);

  const fetchMe = async () => {
    const response = await api.get<AuthResponse>(API_ENDPOINTS.auth.me);
    return response.user;
  };

  const refreshUser = async () => {
    try {
      const user = await fetchMe();
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
        const user = await fetchMe();
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
    const data: LoginRequest = { username, password };
    const response = await api.post<AuthResponse>(API_ENDPOINTS.auth.login, data);
    setState({
      user: response.user,
      isLoading: false,
      isAuthenticated: true,
    });
  };

  const signup = async (username: string, password: string) => {
    const data: SignupRequest = { username, password };
    await api.post<AuthResponse>(API_ENDPOINTS.auth.signup, data);
  };

  const logout = async () => {
    await api.post(API_ENDPOINTS.auth.logout);
    setState({
      user: null,
      isLoading: false,
      isAuthenticated: false,
    });
  };

  const setAuthDialogHandlers = useCallback((handlers: DialogHandlers) => {
    dialogHandlersRef.current = handlers;
  }, []);

  const openLoginDialog = useCallback(() => {
    dialogHandlersRef.current?.openLogin();
  }, []);

  const openSignupDialog = useCallback(() => {
    dialogHandlersRef.current?.openSignup();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        signup,
        logout,
        refreshUser,
        openLoginDialog,
        openSignupDialog,
        setAuthDialogHandlers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
