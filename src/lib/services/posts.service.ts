import { api } from '../api-client';
import { API_ENDPOINTS } from '../api-config';
import type {
  CreatePostRequest,
  CreateReplyRequest,
  GetPostsResponse,
  GetPostResponse,
  CreatePostResponse,
  CreateReplyResponse,
} from '../types/api.types';

export const postsService = {
  getPosts: async (params?: { limit?: number; offset?: number }) => {
    const response = await api.get<GetPostsResponse>(
      API_ENDPOINTS.posts.list,
      { params }
    );
    return response.posts;
  },

  getPostById: async (id: string) => {
    const response = await api.get<GetPostResponse>(
      API_ENDPOINTS.posts.detail(id)
    );
    return response.post;
  },

  createPost: async (data: CreatePostRequest) => {
    const response = await api.post<CreatePostResponse>(
      API_ENDPOINTS.posts.list,
      data
    );
    return response.post;
  },

  createReply: async (postId: string, data: CreateReplyRequest) => {
    const response = await api.post<CreateReplyResponse>(
      API_ENDPOINTS.posts.reply(postId),
      data
    );
    return response.post;
  },
};
