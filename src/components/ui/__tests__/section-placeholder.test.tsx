import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SectionPlaceholder } from '../section-placeholder';

describe('SectionPlaceholder', () => {
  it('should render heading and paragraph', () => {
    render(
      <SectionPlaceholder
        heading="Test Heading"
        paragraph="Test paragraph content"
      />
    );

    expect(screen.getByText('Test Heading')).toBeInTheDocument();
    expect(screen.getByText('Test paragraph content')).toBeInTheDocument();
  });

  it('should render action button when provided', () => {
    const mockAction = vi.fn();
    render(
      <SectionPlaceholder
        heading="Test"
        paragraph="Content"
        action={{
          label: 'Click Me',
          onClick: mockAction,
        }}
      />
    );

    expect(screen.getByRole('button', { name: 'Click Me' })).toBeInTheDocument();
  });

  it('should call action onClick when button is clicked', async () => {
    const user = userEvent.setup();
    const mockAction = vi.fn();
    render(
      <SectionPlaceholder
        heading="Test"
        paragraph="Content"
        action={{
          label: 'Retry',
          onClick: mockAction,
        }}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Retry' }));
    expect(mockAction).toHaveBeenCalledTimes(1);
  });

  it('should not render action button when not provided', () => {
    render(
      <SectionPlaceholder
        heading="Test"
        paragraph="Content"
      />
    );

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('should render empty type with inbox icon', () => {
    const { container } = render(
      <SectionPlaceholder
        heading="No items"
        paragraph="Nothing here"
        type="empty"
      />
    );

    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('should render error type with alert circle icon', () => {
    const { container } = render(
      <SectionPlaceholder
        heading="Error occurred"
        paragraph="Something went wrong"
        type="error"
      />
    );

    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('should render info type with info icon', () => {
    const { container } = render(
      <SectionPlaceholder
        heading="Information"
        paragraph="Here is some info"
        type="info"
      />
    );

    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('should render warning type with alert triangle icon', () => {
    const { container } = render(
      <SectionPlaceholder
        heading="Warning"
        paragraph="Be careful"
        type="warning"
      />
    );

    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('should render custom icon when provided', () => {
    const CustomIcon = () => <span data-testid="custom-icon">⭐</span>;
    render(
      <SectionPlaceholder
        heading="Test"
        paragraph="Content"
        icon={<CustomIcon />}
      />
    );

    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });
});
