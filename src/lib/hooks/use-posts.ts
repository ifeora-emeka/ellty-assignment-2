import { useInfiniteQuery, useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { postsService } from '../services/posts.service';
import { QUERY_KEYS } from '../query-keys';
import type { CreatePostRequest, CreateReplyRequest } from '../types/api.types';

const POSTS_PER_PAGE = 10;

export function useInfinitePosts() {
  return useInfiniteQuery({
    queryKey: QUERY_KEYS.posts.list(),
    queryFn: ({ pageParam = 0 }) =>
      postsService.getPosts({
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
    queryFn: () => postsService.getPostById(id),
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePostRequest) => postsService.createPost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.posts.list() });
    },
  });
}

export function useCreateReply() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, data }: { postId: string; data: CreateReplyRequest }) =>
      postsService.createReply(postId, data),
    onSuccess: (_result, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.posts.detail(variables.postId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.posts.list() });
    },
  });
}
