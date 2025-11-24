/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { NewPostForm } from '../new-post-form';

describe('NewPostForm', () => {
  it('should render number input field', () => {
    const mockSubmit = vi.fn();
    render(<NewPostForm onSubmit={mockSubmit} />);

    expect(screen.getByLabelText(/starting number/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create/i })).toBeInTheDocument();
  });

  it('should call onSubmit with valid number', async () => {
    const mockSubmit = vi.fn();
    render(<NewPostForm onSubmit={mockSubmit} />);

    const input = screen.getByLabelText(/starting number/i);
    const button = screen.getByRole('button', { name: /create/i });

    fireEvent.change(input, { target: { value: '42.5' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith(42.5);
    });
  });

  it('should show error for invalid number', async () => {
    const mockSubmit = vi.fn();
    render(<NewPostForm onSubmit={mockSubmit} />);

    const input = screen.getByLabelText(/starting number/i) as HTMLInputElement;
    const button = screen.getByRole('button', { name: /create/i });

    input.value = '';
    fireEvent.change(input, { target: { value: '' } });
    fireEvent.click(button);

    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it('should reject infinite number', async () => {
    const mockSubmit = vi.fn();
    render(<NewPostForm onSubmit={mockSubmit} />);

    const input = screen.getByLabelText(/starting number/i) as HTMLInputElement;

    Object.defineProperty(input, 'valueAsNumber', { writable: true, value: Infinity });
    fireEvent.submit(input.closest('form')!);

    await waitFor(() => {
      expect(mockSubmit).not.toHaveBeenCalled();
    });
  });

  it('should clear input after successful submission', async () => {
    const mockSubmit = vi.fn();
    render(<NewPostForm onSubmit={mockSubmit} />);

    const input = screen.getByLabelText(/starting number/i) as HTMLInputElement;
    const button = screen.getByRole('button', { name: /create/i });

    fireEvent.change(input, { target: { value: '100' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(input.value).toBe('');
    });
  });
});
