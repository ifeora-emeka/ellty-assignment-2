/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SignupForm } from '../signup-form';

describe('SignupForm', () => {
  it('should render signup form fields', () => {
    const mockSubmit = vi.fn();
    render(<SignupForm onSubmit={mockSubmit} />);

    expect(screen.getByLabelText(/^username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter your password/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/confirm your password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });

  it('should show error when passwords do not match', async () => {
    const mockSubmit = vi.fn().mockResolvedValue(undefined);
    render(<SignupForm onSubmit={mockSubmit} />);

    const usernameInput = screen.getByLabelText(/^username/i);
    const passwordInput = screen.getByPlaceholderText(/enter your password/i);
    const confirmPasswordInput = screen.getByPlaceholderText(/confirm your password/i);
    const submitButton = screen.getByRole('button', { name: /sign up/i });

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password456' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
      expect(mockSubmit).not.toHaveBeenCalled();
    });
  });

  it('should show error when password is too short', async () => {
    const mockSubmit = vi.fn().mockResolvedValue(undefined);
    render(<SignupForm onSubmit={mockSubmit} />);

    const usernameInput = screen.getByLabelText(/^username/i);
    const passwordInput = screen.getByPlaceholderText(/enter your password/i);
    const confirmPasswordInput = screen.getByPlaceholderText(/confirm your password/i);
    const submitButton = screen.getByRole('button', { name: /sign up/i });

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: '12345' } });
    fireEvent.change(confirmPasswordInput, { target: { value: '12345' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getAllByText(/password must be at least 6 characters/i)[0]).toBeInTheDocument();
      expect(mockSubmit).not.toHaveBeenCalled();
    });
  });

  it('should show error when username is too short or too long', async () => {
    const mockSubmit = vi.fn().mockResolvedValue(undefined);
    render(<SignupForm onSubmit={mockSubmit} />);

    const usernameInput = screen.getByLabelText(/^username/i);
    const passwordInput = screen.getByPlaceholderText(/enter your password/i);
    const confirmPasswordInput = screen.getByPlaceholderText(/confirm your password/i);
    const submitButton = screen.getByRole('button', { name: /sign up/i });

    fireEvent.change(usernameInput, { target: { value: 'ab' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/username must be at least 3 characters/i)).toBeInTheDocument();
      expect(mockSubmit).not.toHaveBeenCalled();
    });
  });

  it('should call onSubmit with credentials object', async () => {
    const mockSubmit = vi.fn().mockResolvedValue(undefined);
    render(<SignupForm onSubmit={mockSubmit} />);

    const usernameInput = screen.getByLabelText(/^username/i);
    const passwordInput = screen.getByPlaceholderText(/enter your password/i);
    const confirmPasswordInput = screen.getByPlaceholderText(/confirm your password/i);
    const submitButton = screen.getByRole('button', { name: /sign up/i });

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({ username: 'testuser', password: 'password123', confirmPassword: 'password123' });
    });
  });

  it('should toggle password visibility', () => {
    const mockSubmit = vi.fn();
    render(<SignupForm onSubmit={mockSubmit} />);

    const passwordInput = screen.getByPlaceholderText(/enter your password/i);
    expect(passwordInput).toHaveAttribute('type', 'password');

    const eyeButtons = screen.getAllByRole('button').filter(btn => 
      btn.querySelector('svg')?.classList.contains('lucide-eye')
    );
    fireEvent.click(eyeButtons[0]);

    expect(passwordInput).toHaveAttribute('type', 'text');
  });
});
