import { useState } from 'react';
import { useParams, useNavigate, useRouteContext } from '@tanstack/react-router';
import { PostTree, OperationForm } from '@/components/posts';
import { PostTreeSkeleton } from '@/components/ui/loading-spinner';
import { SectionPlaceholder } from '@/components/ui/section-placeholder';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowLeft } from 'lucide-react';
import { usePost, useCreateReply } from '@/hooks/use-posts';
import { useAuth } from '@/hooks/use-auth';
import type { Post } from '@/lib/types/api.types';
import { toast } from 'sonner';
import { ApiError } from '@/lib/api-client';

export function PostDetailPage() {
  const { postId } = useParams({ strict: false });
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const routeContext = useRouteContext({ strict: false });
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string>('');
  const [selectedPostValue, setSelectedPostValue] = useState<number>(0);
  const [replyError, setReplyError] = useState<string>('');
  const { data: post, isLoading, error: fetchError, refetch } = usePost(postId || '');
  const { mutate: createReply, isPending: isCreatingReply, reset: resetReplyError } = useCreateReply();

  const handleReply = (postId: string) => {
    if (!isAuthenticated) {
      if (routeContext && 'openLoginDialog' in routeContext && typeof routeContext.openLoginDialog === 'function') {
        routeContext.openLoginDialog();
      }
      return;
    }

    const findPostValue = (p: Post): number | null => {
      if (p.id === postId) return p.value;
      if (p.children) {
        for (const child of p.children) {
          const value = findPostValue(child);
          if (value !== null) return value;
        }
      }
      return null;
    };

    const value = post ? findPostValue(post) : null;
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
      { postId: selectedPostId, data: { operation: operation as 'add' | 'subtract' | 'multiply' | 'divide', operand } },
      {
        onSuccess: () => {
          setReplyDialogOpen(false);
          toast.success('Reply added successfully!');
          refetch();
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

  const handleBack = () => {
    navigate({ to: '/' });
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Button variant="ghost" onClick={handleBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <PostTreeSkeleton count={1} />
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Button variant="ghost" onClick={handleBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <SectionPlaceholder
          heading="Failed to load calculation"
          paragraph="Unable to load this calculation. Please check your connection and try again."
          type="error"
          action={{
            label: 'Retry',
            onClick: () => refetch(),
          }}
        />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Button variant="ghost" onClick={handleBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <SectionPlaceholder
          heading="Calculation not found"
          paragraph="This calculation doesn't exist or may have been removed."
          type="empty"
          action={{
            label: 'Go back home',
            onClick: handleBack,
          }}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Button variant="ghost" onClick={handleBack}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to all calculations
      </Button>

      <div>
        <h1 className="text-3xl font-bold mb-2">Calculation Details</h1>
        <p className="text-muted-foreground">Explore this calculation thread</p>
      </div>

      <PostTree
        posts={[post]}
        isAuthenticated={isAuthenticated}
        onReply={handleReply}
      />

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
