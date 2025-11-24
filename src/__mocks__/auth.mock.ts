export interface MockAuthUser {
  id: string;
  username: string;
  createdAt: string;
  updatedAt: string;
}

export const mockAuthUser: MockAuthUser = {
  id: 'user1',
  username: 'alice',
  createdAt: '2025-11-15T10:00:00Z',
  updatedAt: '2025-11-15T10:00:00Z',
};

export const mockLogin = async (username: string, password: string): Promise<MockAuthUser> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  if (username === 'alice' && password === 'password123') {
    return mockAuthUser;
  }
  
  throw new Error('Invalid credentials');
};

export const mockSignup = async (username: string, password: string): Promise<MockAuthUser> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  if (username.length < 3 || username.length > 20) {
    throw new Error('Username must be between 3 and 20 characters');
  }
  
  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters');
  }
  
  return {
    id: 'new-user-' + Date.now(),
    username,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

export const mockLogout = async (): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
};
