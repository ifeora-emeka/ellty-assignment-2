import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageSquare } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface PostCardProps {
  id: string;
  value: number;
  username: string;
  userCreatedAt: string;
  operation?: string;
  operand?: number;
  createdAt: string;
  isAuthenticated?: boolean;
  onReply?: (postId: string) => void;
  onViewDetails?: (postId: string) => void;
  replyCount?: number;
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
  userCreatedAt,
  operation,
  operand,
  createdAt,
  isAuthenticated,
  onReply,
  onViewDetails,
  replyCount = 0,
}: PostCardProps) {
  const formattedDate = formatDistanceToNow(new Date(createdAt), { addSuffix: true });
  const userJoined = formatDistanceToNow(new Date(userCreatedAt), { addSuffix: true });
  const getUserInitials = (name: string) => name.slice(0, 2).toUpperCase();

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs">{getUserInitials(username)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{username}</span>
              <span className="text-xs text-muted-foreground">Joined {userJoined}</span>
            </div>
          </div>
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

      {(isAuthenticated || replyCount > 0) && (
        <CardFooter className="gap-2">
          {isAuthenticated && onReply && (
            <Button size="sm" variant={'outline'} onClick={() => onReply(id)}>
              Add Operation
            </Button>
          )}
          {replyCount > 0 && onViewDetails && (
            <Button size="sm" variant="outline" onClick={() => onViewDetails(id)}>
              <MessageSquare className="h-4 w-4 mr-1" />
              {replyCount} {replyCount === 1 ? 'Reply' : 'Replies'}
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
