export const getApiUrl = (): string => {
  if (import.meta.env.PROD) {
    return window.location.origin;
  }
  return import.meta.env.VITE_API_URL || 'http://localhost:8080';
};

export const API_URL = getApiUrl();

export const API_ENDPOINTS = {
  auth: {
    signup: `${API_URL}/api/auth/signup`,
    login: `${API_URL}/api/auth/login`,
    logout: `${API_URL}/api/auth/logout`,
    me: `${API_URL}/api/auth/me`,
  },
  posts: {
    list: `${API_URL}/api/posts`,
    detail: (id: string) => `${API_URL}/api/posts/${id}`,
    create: `${API_URL}/api/posts`,
    reply: (id: string) => `${API_URL}/api/posts/${id}/reply`,
  },
} as const;
