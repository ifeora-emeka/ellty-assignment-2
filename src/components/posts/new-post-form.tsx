import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface NewPostFormProps {
  onSubmit: (value: number) => void;
  error?: string;
  disabled?: boolean;
}

export function NewPostForm({ onSubmit, error, disabled }: NewPostFormProps) {
  const [value, setValue] = useState('');
  const [validationError, setValidationError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    const numValue = parseFloat(value);
    
    if (isNaN(numValue)) {
      setValidationError('Please enter a valid number');
      return;
    }

    if (!isFinite(numValue)) {
      setValidationError('Number must be finite');
      return;
    }

    onSubmit(numValue);
    setValue('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {(error || validationError) && (
        <Alert variant="destructive">
          <AlertDescription>{error || validationError}</AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="value">Starting Number</Label>
        <Input
          id="value"
          type="number"
          step="any"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={disabled}
          required
          placeholder="Enter any number"
        />
      </div>

      <Button type="submit" className="w-full" disabled={disabled}>
        Create Calculation
      </Button>
    </form>
  );
}
