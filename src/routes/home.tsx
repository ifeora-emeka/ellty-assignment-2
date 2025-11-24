import { useState, useEffect, useRef } from 'react';
import { useNavigate, useRouteContext } from '@tanstack/react-router';
import { PostTree, NewPostForm, OperationForm } from '@/components/posts';
import { PostTreeSkeleton } from '@/components/ui/loading-spinner';
import { ErrorMessage } from '@/components/ui/error-message';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useInfinitePosts, useCreatePost, useCreateReply } from '@/lib/hooks/use-posts';
import { useAuth } from '@/hooks/use-auth';
import type { Post } from '@/lib/types/api.types';
import { toast } from 'sonner';
import { ApiError } from '@/lib/api-client';

export function HomePage() {
  const [newPostDialogOpen, setNewPostDialogOpen] = useState(false);
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string>('');
  const [selectedPostValue, setSelectedPostValue] = useState<number>(0);
  const [replyError, setReplyError] = useState<string>('');
  const navigate = useNavigate();
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const authContext = useAuth();
  const routeContext = useRouteContext({ strict: false });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error: fetchError,
  } = useInfinitePosts();

  const {
    mutate: createPost,
    isPending: isCreating,
    error: createError,
    reset: resetCreateError,
  } = useCreatePost();

  const {
    mutate: createReply,
    isPending: isCreatingReply,
    reset: resetReplyError,
  } = useCreateReply();

  const allPosts = data?.pages.flat() ?? [];

  useEffect(() => {
    if (!loadMoreRef.current || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const handleCreatePost = (value: number) => {
    resetCreateError();
    createPost(
      { value },
      {
        onSuccess: () => {
          setNewPostDialogOpen(false);
        },
      }
    );
  };

  const handleViewDetails = (postId: string) => {
    navigate({ to: '/posts/$postId', params: { postId } });
  };

  const handleReply = (postId: string) => {
    if (!authContext.isAuthenticated) {
      if (routeContext?.openLoginDialog) {
        routeContext.openLoginDialog();
      }
      return;
    }

    const findPostValue = (posts: Post[], targetId: string): number | null => {
      for (const post of posts) {
        if (post.id === targetId) return post.value;
        if (post.children) {
          const value = findPostValue(post.children, targetId);
          if (value !== null) return value;
        }
      }
      return null;
    };

    const value = findPostValue(allPosts, postId);
    if (value !== null) {
      setSelectedPostId(postId);
      setSelectedPostValue(value);
      setReplyDialogOpen(true);
      setReplyError('');
      resetReplyError();
    }
  };

  const handleSubmitReply = async (operation: string, operand: number) => {
    setReplyError('');
    createReply(
      { postId: selectedPostId, data: { operation, operand } },
      {
        onSuccess: () => {
          setReplyDialogOpen(false);
          toast.success('Reply added successfully!');
        },
        onError: (error) => {
          if (error instanceof ApiError && error.data) {
            const errorData = error.data as { error?: string; errors?: Array<{ message: string }> };
            if (errorData.errors && errorData.errors.length > 0) {
              setReplyError(errorData.errors[0].message);
            } else if (errorData.error) {
              setReplyError(errorData.error);
            } else {
              setReplyError('Failed to add reply');
            }
          } else {
            setReplyError('Failed to add reply');
          }
        },
      }
    );
  };

  const handleNewCalculationClick = () => {
    if (!authContext.isAuthenticated) {
      routeContext?.openSignupDialog?.();
    } else {
      setNewPostDialogOpen(true);
    }
  };

  if (fetchError) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <ErrorMessage
          title="Failed to load posts"
          message={fetchError instanceof Error ? fetchError.message : 'An error occurred'}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Number Tree</h1>
          <p className="text-muted-foreground">Explore mathematical conversations</p>
        </div>
        <Dialog open={newPostDialogOpen} onOpenChange={setNewPostDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg" onClick={handleNewCalculationClick}>New Calculation</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Start a New Calculation</DialogTitle>
            </DialogHeader>
            <NewPostForm
              onSubmit={handleCreatePost}
              error={createError instanceof Error ? createError.message : undefined}
              disabled={isCreating}
            />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <PostTreeSkeleton count={3} />
      ) : allPosts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No calculations yet. Start a new one!</p>
        </div>
      ) : (
        <>
          <PostTree
            posts={allPosts as Post[]}
            isAuthenticated={authContext.isAuthenticated}
            onReply={handleReply}
            onViewDetails={handleViewDetails}
          />
          
          <div ref={loadMoreRef} className="py-4">
            {isFetchingNextPage && <PostTreeSkeleton count={2} />}
          </div>

          {!hasNextPage && allPosts.length > 0 && (
            <div className="text-center py-4 text-sm text-muted-foreground">
              No more posts to load
            </div>
          )}
        </>
      )}

      <Dialog open={replyDialogOpen} onOpenChange={setReplyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Operation</DialogTitle>
          </DialogHeader>
          <OperationForm
            parentValue={selectedPostValue}
            parentId={selectedPostId}
            onSubmit={handleSubmitReply}
            onCancel={() => setReplyDialogOpen(false)}
            error={replyError}
            disabled={isCreatingReply}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
