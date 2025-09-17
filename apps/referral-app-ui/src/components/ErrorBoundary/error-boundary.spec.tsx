import { render, screen } from '@testing-library/react';
import { ErrorBoundary } from './error-boundary';

describe('ErrorBoundary suite', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('renders fallback UI when a child throws an error', () => {
    // Suppress console.error for this test to avoid noise
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const ProblemChild = () => {
      throw new Error('Test error');
    };

    render(
      <ErrorBoundary fallback={<div>Custom fallback</div>}>
        <ProblemChild />
      </ErrorBoundary>,
    );

    expect(screen.getByText('Custom fallback')).toBeInTheDocument();

    consoleErrorSpy.mockRestore();
  });

  it('renders children normally if no error', () => {
    render(
      <ErrorBoundary fallback={<div>Custom fallback</div>}>
        <div>Normal Child</div>
      </ErrorBoundary>,
    );

    expect(screen.getByText('Normal Child')).toBeInTheDocument();
  });
});
