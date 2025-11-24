/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { OperationForm } from '../operation-form';

describe('OperationForm', () => {
  const mockProps = {
    parentValue: 10,
    parentId: '1',
    onSubmit: vi.fn(),
    onCancel: vi.fn(),
  };

  it('should render operation selector and operand input', () => {
    render(<OperationForm {...mockProps} />);

    expect(screen.getByLabelText(/operation/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/number/i)).toBeInTheDocument();
  });

  it('should show calculation preview', async () => {
    render(<OperationForm {...mockProps} />);

    const operandInput = screen.getByLabelText(/number/i);
    fireEvent.change(operandInput, { target: { value: '5' } });

    await waitFor(() => {
      expect(screen.getByText('Result Preview:')).toBeInTheDocument();
    });
  });

  it('should call onSubmit with operation and operand', async () => {
    const mockSubmit = vi.fn();
    render(<OperationForm {...mockProps} onSubmit={mockSubmit} />);

    const operandInput = screen.getByLabelText(/number/i);
    const submitButton = screen.getByRole('button', { name: /apply operation/i });

    fireEvent.change(operandInput, { target: { value: '3' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith('add', 3);
    });
  });

  it('should prevent division by zero', async () => {
    render(<OperationForm {...mockProps} />);

    const operandInput = screen.getByLabelText(/number/i);
    const submitButton = screen.getByRole('button', { name: /apply operation/i });

    fireEvent.change(operandInput, { target: { value: '0' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.queryByText(/cannot divide by zero/i)).not.toBeInTheDocument();
    });
  });

  it('should call onCancel when cancel button is clicked', () => {
    const mockCancel = vi.fn();
    render(<OperationForm {...mockProps} onCancel={mockCancel} />);

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);

    expect(mockCancel).toHaveBeenCalled();
  });
});
