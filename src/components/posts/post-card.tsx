import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface PostCardProps {
  id: string;
  value: number;
  username: string;
  operation?: string;
  operand?: number;
  createdAt: string;
  isAuthenticated?: boolean;
  onReply?: (postId: string) => void;
  onViewDetails?: (postId: string) => void;
  hasReplies?: boolean;
}

const operationSymbols: Record<string, string> = {
  add: '+',
  subtract: '−',
  multiply: '×',
  divide: '÷',
};

export function PostCard({
  id,
  value,
  username,
  operation,
  operand,
  createdAt,
  isAuthenticated,
  onReply,
  onViewDetails,
  hasReplies,
}: PostCardProps) {
  const formattedDate = new Date(createdAt).toLocaleString();

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <Badge variant="secondary">{username}</Badge>
          <span className="text-xs text-muted-foreground">{formattedDate}</span>
        </div>
      </CardHeader>
      
      <CardContent className="pb-3">
        <div className="flex items-center gap-2">
          {operation && operand !== undefined && (
            <div className="text-sm text-muted-foreground">
              <span className="font-mono">{operationSymbols[operation]} {operand} =</span>
            </div>
          )}
          <div className="text-3xl font-bold font-mono">{value}</div>
        </div>
      </CardContent>

      {(isAuthenticated || hasReplies) && (
        <CardFooter className="gap-2">
          {isAuthenticated && onReply && (
            <Button size="sm" onClick={() => onReply(id)}>
              Add Operation
            </Button>
          )}
          {hasReplies && onViewDetails && (
            <Button size="sm" variant="outline" onClick={() => onViewDetails(id)}>
              View Replies
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
