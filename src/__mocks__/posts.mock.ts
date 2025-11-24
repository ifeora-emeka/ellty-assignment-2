export interface MockUser {
  id: string;
  username: string;
}

export interface MockOperation {
  id: string;
  operation: 'add' | 'subtract' | 'multiply' | 'divide';
  operand: number;
}

export interface MockPost {
  id: string;
  value: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
  user: MockUser;
  parentOperation?: MockOperation;
  children?: MockPost[];
}

export const mockPosts: MockPost[] = [
  {
    id: '1',
    value: 100,
    userId: 'user1',
    createdAt: '2025-11-20T10:00:00Z',
    updatedAt: '2025-11-20T10:00:00Z',
    user: {
      id: 'user1',
      username: 'alice',
    },
    children: [
      {
        id: '2',
        value: 150,
        userId: 'user2',
        createdAt: '2025-11-20T11:00:00Z',
        updatedAt: '2025-11-20T11:00:00Z',
        user: {
          id: 'user2',
          username: 'bob',
        },
        parentOperation: {
          id: 'op1',
          operation: 'add',
          operand: 50,
        },
        children: [
          {
            id: '3',
            value: 300,
            userId: 'user3',
            createdAt: '2025-11-20T12:00:00Z',
            updatedAt: '2025-11-20T12:00:00Z',
            user: {
              id: 'user3',
              username: 'charlie',
            },
            parentOperation: {
              id: 'op2',
              operation: 'multiply',
              operand: 2,
            },
          },
        ],
      },
      {
        id: '4',
        value: 50,
        userId: 'user4',
        createdAt: '2025-11-20T11:30:00Z',
        updatedAt: '2025-11-20T11:30:00Z',
        user: {
          id: 'user4',
          username: 'diana',
        },
        parentOperation: {
          id: 'op3',
          operation: 'divide',
          operand: 2,
        },
      },
    ],
  },
  {
    id: '5',
    value: 42,
    userId: 'user1',
    createdAt: '2025-11-21T09:00:00Z',
    updatedAt: '2025-11-21T09:00:00Z',
    user: {
      id: 'user1',
      username: 'alice',
    },
    children: [
      {
        id: '6',
        value: 32,
        userId: 'user2',
        createdAt: '2025-11-21T10:00:00Z',
        updatedAt: '2025-11-21T10:00:00Z',
        user: {
          id: 'user2',
          username: 'bob',
        },
        parentOperation: {
          id: 'op4',
          operation: 'subtract',
          operand: 10,
        },
      },
    ],
  },
  {
    id: '7',
    value: 7,
    userId: 'user3',
    createdAt: '2025-11-22T14:00:00Z',
    updatedAt: '2025-11-22T14:00:00Z',
    user: {
      id: 'user3',
      username: 'charlie',
    },
  },
];

export const mockPostDetail = (id: string): MockPost | undefined => {
  const findPost = (posts: MockPost[]): MockPost | undefined => {
    for (const post of posts) {
      if (post.id === id) return post;
      if (post.children) {
        const found = findPost(post.children);
        if (found) return found;
      }
    }
    return undefined;
  };
  return findPost(mockPosts);
};

export const mockLoadingDelay = () => 
  new Promise((resolve) => setTimeout(resolve, 800));
