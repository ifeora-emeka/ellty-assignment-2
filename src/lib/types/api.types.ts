export interface User {
  id: string;
  username: string;
  createdAt: string;
  updatedAt: string;
}

export interface Operation {
  id: string;
  type: string;
  operand: number;
  postId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  id: string;
  value: number;
  userId: string;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
  user: User;
  operation?: Operation;
  children?: Post[];
}

export interface CreatePostRequest {
  value: number;
}

export interface CreateReplyRequest {
  operation: 'add' | 'subtract' | 'multiply' | 'divide';
  operand: number;
}

export interface GetPostsResponse {
  posts: Post[];
}

export interface GetPostResponse {
  post: Post;
}

export interface CreatePostResponse {
  post: Post;
}

export interface CreateReplyResponse {
  post: Post;
}

export interface AuthUser {
  id: string;
  username: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface SignupRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  user: AuthUser;
}
