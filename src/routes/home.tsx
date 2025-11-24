import { useState, useEffect, useRef } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { PostTree, NewPostForm } from '@/components/posts';
import { PostTreeSkeleton } from '@/components/ui/loading-spinner';
import { ErrorMessage } from '@/components/ui/error-message';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useInfinitePosts, useCreatePost } from '@/lib/hooks/use-posts';
import type { Post } from '@/lib/types/api.types';

export function HomePage() {
  const [newPostDialogOpen, setNewPostDialogOpen] = useState(false);
  const navigate = useNavigate();
  const loadMoreRef = useRef<HTMLDivElement>(null);

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
            <Button size="lg">New Calculation</Button>
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
            isAuthenticated={true}
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
    </div>
  );
}
