/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from '../header';

describe('Header', () => {
  it('should render Number Tree title', () => {
    render(<Header />);
    expect(screen.getByText('Number Tree')).toBeInTheDocument();
  });

  it('should show login and signup buttons when not authenticated', () => {
    const mockLogin = vi.fn();
    const mockSignup = vi.fn();

    render(<Header onLogin={mockLogin} onSignup={mockSignup} />);

    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
  });

  it('should show user avatar when authenticated', () => {
    const user = { id: '1', username: 'testuser' };
    render(<Header user={user} />);

    expect(screen.getByText('TE')).toBeInTheDocument();
  });

  it('should call onLogin when login button is clicked', () => {
    const mockLogin = vi.fn();
    render(<Header onLogin={mockLogin} />);

    const loginButton = screen.getByText('Login');
    fireEvent.click(loginButton);

    expect(mockLogin).toHaveBeenCalled();
  });

  it('should call onSignup when signup button is clicked', () => {
    const mockSignup = vi.fn();
    render(<Header onSignup={mockSignup} />);

    const signupButton = screen.getByText('Sign Up');
    fireEvent.click(signupButton);

    expect(mockSignup).toHaveBeenCalled();
  });

  it('should display user avatar with dropdown menu', () => {
    const mockLogout = vi.fn();
    const user = { id: '1', username: 'testuser' };

    render(<Header user={user} onLogout={mockLogout} />);

    const avatarButton = screen.getByRole('button', { name: 'TE' });
    expect(avatarButton).toBeInTheDocument();
    expect(avatarButton).toHaveAttribute('aria-haspopup', 'menu');
  });
});
