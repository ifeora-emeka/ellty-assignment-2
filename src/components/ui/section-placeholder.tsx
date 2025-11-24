import { AlertCircle, AlertTriangle, Info, Inbox } from 'lucide-react';
import { Button } from './button';

interface SectionPlaceholderProps {
  heading: string;
  paragraph: string;
  type?: 'empty' | 'error' | 'info' | 'warning';
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const iconMap = {
  empty: Inbox,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

const colorMap = {
  empty: 'text-muted-foreground',
  error: 'text-destructive',
  info: 'text-blue-500',
  warning: 'text-yellow-500',
};

export function SectionPlaceholder({
  heading,
  paragraph,
  type = 'empty',
  icon,
  action,
}: SectionPlaceholderProps) {
  const Icon = iconMap[type];
  const iconColor = colorMap[type];

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className={`mb-4 ${iconColor}`}>
        {icon || <Icon className="h-12 w-12" />}
      </div>
      <h3 className="text-lg font-semibold mb-2">{heading}</h3>
      <p className="text-muted-foreground mb-6 max-w-md">{paragraph}</p>
      {action && (
        <Button onClick={action.onClick} variant={type === 'error' ? 'default' : 'outline'}>
          {action.label}
        </Button>
      )}
    </div>
  );
}
