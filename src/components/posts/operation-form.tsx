import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

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

const createOperationSchema = (_parentValue: number) => z.object({
  operation: z.enum(['add', 'subtract', 'multiply', 'divide']),
  operand: z.string().min(1, 'Please enter a number').refine(
    (val) => !isNaN(parseFloat(val)),
    'Please enter a valid number'
  ).refine(
    (val) => isFinite(parseFloat(val)),
    'Number must be finite'
  ),
}).refine(
  (data) => !(data.operation === 'divide' && parseFloat(data.operand) === 0),
  {
    message: 'Cannot divide by zero',
    path: ['operand'],
  }
);

type OperationFormValues = z.infer<ReturnType<typeof createOperationSchema>>;

export function OperationForm({ 
  parentValue, 
  onSubmit, 
  onCancel, 
  error, 
  disabled 
}: OperationFormProps) {
  const form = useForm<OperationFormValues>({
    resolver: zodResolver(createOperationSchema(parentValue)),
    mode: 'onChange',
    defaultValues: {
      operation: 'add',
      operand: '',
    },
  });

  const watchedOperation = form.watch('operation');
  const watchedOperand = form.watch('operand');

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const calculatePreview = (): number | null => {
    const numOperand = parseFloat(watchedOperand);
    if (isNaN(numOperand)) return null;

    switch (watchedOperation) {
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

  const handleSubmit = (values: OperationFormValues) => {
    const numOperand = parseFloat(values.operand);
    onSubmit(values.operation, numOperand);
  };

  const preview = calculatePreview();
  const selectedOp = operations.find(op => op.value === watchedOperation);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="p-3 bg-muted rounded-md">
          <div className="text-sm text-muted-foreground">Operating on:</div>
          <div className="text-2xl font-bold font-mono">{parentValue}</div>
        </div>
        
        <FormField
          control={form.control}
          name="operation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Operation</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                disabled={disabled}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {operations.map((op) => (
                    <SelectItem key={op.value} value={op.value}>
                      {op.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="operand"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="any"
                  placeholder="Enter a number"
                  disabled={disabled}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {preview !== null && (
          <div className="p-3 bg-primary/10 rounded-md">
            <div className="text-sm font-medium">Result Preview:</div>
            <div className="text-lg font-mono">
              {parentValue} {selectedOp?.symbol} {watchedOperand} = <span className="font-bold">{preview}</span>
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
    </Form>
  );
}
