import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface OperationFormProps {
  parentValue: number;
  parentId: string;
  onSubmit: (operation: string, operand: number) => void;
  onCancel: () => void;
  error?: string;
  disabled?: boolean;
}

const operations = [
  { value: 'add', label: 'Add (+)', symbol: '+' },
  { value: 'subtract', label: 'Subtract (−)', symbol: '−' },
  { value: 'multiply', label: 'Multiply (×)', symbol: '×' },
  { value: 'divide', label: 'Divide (÷)', symbol: '÷' },
];

export function OperationForm({ 
  parentValue, 
  onSubmit, 
  onCancel, 
  error, 
  disabled 
}: OperationFormProps) {
  const [operation, setOperation] = useState('add');
  const [operand, setOperand] = useState('');
  const [validationError, setValidationError] = useState('');

  const calculatePreview = (): number | null => {
    const numOperand = parseFloat(operand);
    if (isNaN(numOperand)) return null;

    switch (operation) {
      case 'add':
        return parentValue + numOperand;
      case 'subtract':
        return parentValue - numOperand;
      case 'multiply':
        return parentValue * numOperand;
      case 'divide':
        return numOperand !== 0 ? parentValue / numOperand : null;
      default:
        return null;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    const numOperand = parseFloat(operand);
    
    if (isNaN(numOperand)) {
      setValidationError('Please enter a valid number');
      return;
    }

    if (!isFinite(numOperand)) {
      setValidationError('Number must be finite');
      return;
    }

    if (operation === 'divide' && numOperand === 0) {
      setValidationError('Cannot divide by zero');
      return;
    }

    onSubmit(operation, numOperand);
  };

  const preview = calculatePreview();
  const selectedOp = operations.find(op => op.value === operation);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {(error || validationError) && (
        <Alert variant="destructive">
          <AlertDescription>{error || validationError}</AlertDescription>
        </Alert>
      )}

      <div className="p-3 bg-muted rounded-md">
        <div className="text-sm text-muted-foreground">Operating on:</div>
        <div className="text-2xl font-bold font-mono">{parentValue}</div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="operation">Operation</Label>
        <Select value={operation} onValueChange={setOperation} disabled={disabled}>
          <SelectTrigger id="operation">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {operations.map((op) => (
              <SelectItem key={op.value} value={op.value}>
                {op.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="operand">Number</Label>
        <Input
          id="operand"
          type="number"
          step="any"
          value={operand}
          onChange={(e) => setOperand(e.target.value)}
          disabled={disabled}
          required
          placeholder="Enter a number"
        />
      </div>

      {preview !== null && (
        <div className="p-3 bg-primary/10 rounded-md">
          <div className="text-sm font-medium">Result Preview:</div>
          <div className="text-lg font-mono">
            {parentValue} {selectedOp?.symbol} {operand} = <span className="font-bold">{preview}</span>
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <Button type="submit" className="flex-1" disabled={disabled}>
          Apply Operation
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} disabled={disabled}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
