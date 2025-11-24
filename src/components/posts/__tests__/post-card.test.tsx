/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PostCard } from '../post-card';

describe('PostCard', () => {
  const baseProps = {
    id: '1',
    value: 42,
    username: 'testuser',
    createdAt: '2025-11-24T10:00:00Z',
  };

  it('should render post value and username', () => {
    render(<PostCard {...baseProps} />);

    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.getByText('testuser')).toBeInTheDocument();
  });

  it('should display operation when provided', () => {
    render(
      <PostCard
        {...baseProps}
        operation="add"
        operand={10}
        value={52}
      />
    );

    expect(screen.getByText(/\+ 10 =/)).toBeInTheDocument();
    expect(screen.getByText('52')).toBeInTheDocument();
  });

  it('should call onReply when reply button is clicked', () => {
    const mockReply = vi.fn();

    render(
      <PostCard
        {...baseProps}
        isAuthenticated={true}
        onReply={mockReply}
      />
    );

    const replyButton = screen.getByText('Add Operation');
    fireEvent.click(replyButton);

    expect(mockReply).toHaveBeenCalledWith('1');
  });

  it('should call onViewDetails when view details button is clicked', () => {
    const mockViewDetails = vi.fn();

    render(
      <PostCard
        {...baseProps}
        hasReplies={true}
        onViewDetails={mockViewDetails}
      />
    );

    const viewButton = screen.getByText('View Replies');
    fireEvent.click(viewButton);

    expect(mockViewDetails).toHaveBeenCalledWith('1');
  });

  it('should not show reply button when not authenticated', () => {
    render(<PostCard {...baseProps} isAuthenticated={false} />);

    expect(screen.queryByText('Add Operation')).not.toBeInTheDocument();
  });
});
