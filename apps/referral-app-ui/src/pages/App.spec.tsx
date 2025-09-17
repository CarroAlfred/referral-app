import { render, screen } from '@testing-library/react';
import App from './App';

// Mock Container and ReferralList so we don't depend on their internals
jest.mock('../components', () => ({
  Container: ({ children, ...props }: any) => (
    <div
      data-testid='mock-container'
      {...props}
    >
      {children}
    </div>
  ),
}));

jest.mock('../presentation', () => ({
  ReferralList: () => <div data-testid='mock-referral-list'>Referral List</div>,
}));

describe('App', () => {
  it('renders Container and ReferralList', () => {
    render(<App />);

    expect(screen.getByTestId('mock-container')).toBeInTheDocument();
    expect(screen.getByTestId('mock-referral-list')).toBeInTheDocument();
    expect(screen.getByText(/Referral List/i)).toBeInTheDocument();
  });

  it('wraps content in <main>', () => {
    const { container } = render(<App />);
    const main = container.querySelector('main');
    expect(main).toBeInTheDocument();
  });
});
