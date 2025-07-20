import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ErrorBoundary from '../../ErrorBoundary';
import { describe, beforeAll, vi, afterAll, it, expect } from 'vitest';

const ErrorComponent = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test Error');
  }
  return <div>Normal content</div>;
};

describe('ErrorBoundary Component', () => {
  beforeAll(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it('renders children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <ErrorComponent shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Normal content')).toBeInTheDocument();
  });

  it('displays fallback UI when error occurs', () => {
    render(
      <ErrorBoundary>
        <ErrorComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong!')).toBeInTheDocument();

    expect(
      screen.getByText((content) => content.includes('Error: Test Error'))
    ).toBeInTheDocument();
  });

  it('recovers after error when reset button is clicked', async () => {
    let shouldThrow = true;

    const TestComponent = () => {
      if (shouldThrow) {
        throw new Error('Test Error');
      }
      return <div>Normal content</div>;
    };

    render(
      <ErrorBoundary>
        <TestComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong!')).toBeInTheDocument();

    const resetButton = screen.getByRole('button', {
      name: 'Try to recover',
    });

    shouldThrow = false;

    await userEvent.click(resetButton);

    await waitFor(
      () => {
        expect(screen.getByText('Normal content')).toBeInTheDocument();
      },
      { timeout: 5000 }
    );

    expect(screen.queryByText('Something went wrong!')).not.toBeInTheDocument();
  });
});
