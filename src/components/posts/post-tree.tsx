import { PostCard } from './post-card';

interface Operation {
  id: string;
  operation: string;
  operand: number;
}

interface Post {
  id: string;
  value: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    username: string;
    createdAt: string;
  };
  parentOperation?: Operation;
  children?: Post[];
  _count?: {
    replies: number;
  };
}

interface PostTreeProps {
  posts: Post[];
  isAuthenticated?: boolean;
  onReply?: (postId: string) => void;
  onViewDetails?: (postId: string) => void;
  level?: number;
}

export function PostTree({ 
  posts, 
  isAuthenticated, 
  onReply, 
  onViewDetails,
  level = 0 
}: PostTreeProps) {
  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div key={post.id} className={level > 0 ? 'ml-8 border-l-2 border-muted pl-4' : ''}>
          <PostCard
            id={post.id}
            value={post.value}
            username={post.user.username}
            userCreatedAt={post.user.createdAt}
            operation={post.parentOperation?.operation}
            operand={post.parentOperation?.operand}
            createdAt={post.createdAt}
            isAuthenticated={isAuthenticated}
            onReply={onReply}
            onViewDetails={onViewDetails}
            replyCount={post._count?.replies ?? post.children?.length ?? 0}
          />
          
          {post.children && post.children.length > 0 && (
            <div className="mt-4">
              <PostTree
                posts={post.children}
                isAuthenticated={isAuthenticated}
                onReply={onReply}
                onViewDetails={onViewDetails}
                level={level + 1}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
