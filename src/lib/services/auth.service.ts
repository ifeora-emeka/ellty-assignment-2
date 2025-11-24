import { api } from '../api-client';
import { API_ENDPOINTS } from '../api-config';
import type {
  LoginRequest,
  SignupRequest,
  AuthResponse,
} from '../types/api.types';

export const authService = {
  me: async () => {
    const response = await api.get<AuthResponse>(API_ENDPOINTS.auth.me);
    return response.user;
  },

  login: async (data: LoginRequest) => {
    const response = await api.post<AuthResponse>(
      API_ENDPOINTS.auth.login,
      data
    );
    return response.user;
  },

  signup: async (data: SignupRequest) => {
    const response = await api.post<AuthResponse>(
      API_ENDPOINTS.auth.signup,
      data
    );
    return response.user;
  },

  logout: async () => {
    await api.post(API_ENDPOINTS.auth.logout);
  },
};
