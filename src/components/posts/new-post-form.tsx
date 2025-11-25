import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const newPostSchema = z.object({
  value: z.string().min(1, 'Please enter a number').refine(
    (val) => !isNaN(parseFloat(val)),
    'Please enter a valid number'
  ).refine(
    (val) => isFinite(parseFloat(val)),
    'Number must be finite'
  ),
});

type NewPostFormValues = z.infer<typeof newPostSchema>;

interface NewPostFormProps {
  onSubmit: (value: number) => void;
  error?: string;
  disabled?: boolean;
}

export function NewPostForm({ onSubmit, error, disabled }: NewPostFormProps) {
  const form = useForm<NewPostFormValues>({
    resolver: zodResolver(newPostSchema),
    mode: 'onChange',
    defaultValues: {
      value: '',
    },
  });

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleSubmit = (values: NewPostFormValues) => {
    const numValue = parseFloat(values.value);
    onSubmit(numValue);
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Starting Number</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="any"
                  placeholder="Enter any number"
                  disabled={disabled}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={disabled}>
          Create Calculation
        </Button>
      </form>
    </Form>
  );
}
