export const QUERY_KEYS = {
  auth: {
    me: ['auth', 'me'] as const,
  },
  posts: {
    all: ['posts'] as const,
    list: () => [...QUERY_KEYS.posts.all, 'list'] as const,
    detail: (id: string) => [...QUERY_KEYS.posts.all, 'detail', id] as const,
  },
} as const;
