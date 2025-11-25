import { useInfiniteQuery, useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { API_ENDPOINTS } from '@/lib/api-config';
import { QUERY_KEYS } from '@/lib/query-keys';
import type { 
  CreatePostRequest, 
  CreateReplyRequest, 
  GetPostsResponse, 
  GetPostResponse, 
  CreatePostResponse, 
  CreateReplyResponse 
} from '@/lib/types/api.types';

const POSTS_PER_PAGE = 10;

const getPosts = async (params?: { limit?: number; offset?: number }) => {
  const response = await api.get<GetPostsResponse>(API_ENDPOINTS.posts.list, { params });
  return response.posts;
};

const getPostById = async (id: string) => {
  const response = await api.get<GetPostResponse>(API_ENDPOINTS.posts.detail(id));
  return response.post;
};

const createPost = async (data: CreatePostRequest) => {
  const response = await api.post<CreatePostResponse>(API_ENDPOINTS.posts.list, data);
  return response.post;
};

const createReplyApi = async (postId: string, data: CreateReplyRequest) => {
  const response = await api.post<CreateReplyResponse>(API_ENDPOINTS.posts.reply(postId), data);
  return response.post;
};

export function useInfinitePosts() {
  return useInfiniteQuery({
    queryKey: QUERY_KEYS.posts.list(),
    queryFn: ({ pageParam = 0 }) =>
      getPosts({
        limit: POSTS_PER_PAGE,
        offset: pageParam,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < POSTS_PER_PAGE) return undefined;
      return allPages.length * POSTS_PER_PAGE;
    },
  });
}

export function usePost(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.posts.detail(id),
    queryFn: () => getPostById(id),
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePostRequest) => createPost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.posts.list() });
    },
  });
}

export function useCreateReply() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, data }: { postId: string; data: CreateReplyRequest }) =>
      createReplyApi(postId, data),
    onSuccess: (_result, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.posts.detail(variables.postId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.posts.list() });
    },
  });
}
