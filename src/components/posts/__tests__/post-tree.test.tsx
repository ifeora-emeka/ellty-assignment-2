/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PostTree } from '../post-tree';

describe('PostTree', () => {
  const mockPosts = [
    {
      id: '1',
      value: 10,
      userId: 'user1',
      createdAt: '2025-11-24T10:00:00Z',
      updatedAt: '2025-11-24T10:00:00Z',
      user: {
        id: 'user1',
        username: 'alice',
        createdAt: '2025-11-20T10:00:00Z',
      },
    },
    {
      id: '2',
      value: 20,
      userId: 'user2',
      createdAt: '2025-11-24T11:00:00Z',
      updatedAt: '2025-11-24T11:00:00Z',
      user: {
        id: 'user2',
        username: 'bob',
        createdAt: '2025-11-21T10:00:00Z',
      },
    },
  ];

  it('should render all posts', () => {
    render(<PostTree posts={mockPosts} />);

    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument();
    expect(screen.getByText('alice')).toBeInTheDocument();
    expect(screen.getByText('bob')).toBeInTheDocument();
  });

  it('should render nothing when posts array is empty', () => {
    const { container } = render(<PostTree posts={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('should render nested posts', () => {
    const nestedPosts = [
      {
        ...mockPosts[0],
        children: [
          {
            id: '3',
            value: 15,
            userId: 'user2',
            createdAt: '2025-11-24T12:00:00Z',
            updatedAt: '2025-11-24T12:00:00Z',
            user: {
              id: 'user2',
              username: 'bob',
              createdAt: '2025-11-21T10:00:00Z',
            },
            parentOperation: {
              id: 'op1',
              operation: 'add',
              operand: 5,
            },
          },
        ],
      },
    ];

    render(<PostTree posts={nestedPosts} />);

    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText(/15/)).toBeInTheDocument();
  });

  it('should pass callbacks to PostCard', () => {
    const mockReply = vi.fn();
    const mockViewDetails = vi.fn();

    render(
      <PostTree
        posts={mockPosts}
        isAuthenticated={true}
        onReply={mockReply}
        onViewDetails={mockViewDetails}
      />
    );

    expect(screen.getAllByText('Add Operation').length).toBeGreaterThan(0);
  });
});
