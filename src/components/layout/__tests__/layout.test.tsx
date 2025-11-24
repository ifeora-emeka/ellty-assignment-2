/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Layout } from '../layout';

describe('Layout', () => {
  it('should render children', () => {
    render(
      <Layout>
        <div>Test Content</div>
      </Layout>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should render header', () => {
    render(
      <Layout>
        <div>Content</div>
      </Layout>
    );

    expect(screen.getByText('Number Tree')).toBeInTheDocument();
  });

  it('should render footer', () => {
    render(
      <Layout>
        <div>Content</div>
      </Layout>
    );

    expect(screen.getByText(/collaborative calculation platform/i)).toBeInTheDocument();
  });

  it('should pass user prop to header', () => {
    const user = { id: '1', username: 'testuser' };

    render(
      <Layout user={user}>
        <div>Content</div>
      </Layout>
    );

    expect(screen.getByText('TE')).toBeInTheDocument();
  });
});
