import { useState, useEffect } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { PostTree, OperationForm } from '@/components/posts';
import { PostTreeSkeleton } from '@/components/ui/loading-spinner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowLeft } from 'lucide-react';
import { mockPostDetail, mockLoadingDelay } from '@/__mocks__';
import type { MockPost } from '@/__mocks__';

export function PostDetailPage() {
  const { postId } = useParams({ strict: false });
  const navigate = useNavigate();
  const [post, setPost] = useState<MockPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string>('');
  const [selectedPostValue, setSelectedPostValue] = useState<number>(0);
  const [replyError, setReplyError] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await mockLoadingDelay();
        if (postId) {
          const foundPost = mockPostDetail(postId);
          setPost(foundPost || null);
        }
      } catch (error) {
        console.error('Failed to load post:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [postId]);

  const handleReply = (postId: string) => {
    const findPostValue = (p: MockPost): number | null => {
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
    }
  };

  const handleSubmitReply = async (_operation: string, _operand: number) => {
    setReplyError('');
    setSubmitting(true);
    try {
      await mockLoadingDelay();
      setReplyDialogOpen(false);
      const loadData = async () => {
        setLoading(true);
        try {
          await mockLoadingDelay();
          if (postId) {
            const foundPost = mockPostDetail(postId);
            setPost(foundPost || null);
          }
        } catch (error) {
          console.error('Failed to load post:', error);
        } finally {
          setLoading(false);
        }
      };
      await loadData();
    } catch (error) {
      setReplyError(error instanceof Error ? error.message : 'Failed to add reply');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate({ to: '/' });
  };

  if (loading) {
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

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Button variant="ghost" onClick={handleBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Post not found</p>
        </div>
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
        isAuthenticated={true}
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
            disabled={submitting}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
