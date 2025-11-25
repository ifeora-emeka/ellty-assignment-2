import { createContext } from 'react';
import type { AuthUser } from '@/lib/types/api.types';

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface AuthContextValue extends AuthState {
  login: (username: string, password: string) => Promise<void>;
  signup: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  openLoginDialog: () => void;
  openSignupDialog: () => void;
  setAuthDialogHandlers: (handlers: { openLogin: () => void; openSignup: () => void }) => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
