import { render, screen, fireEvent } from '@testing-library/react';
import AddReferralModal from './AddReferralModal';
import { useCreateReferral } from '../../store';

// Mock the custom hook
jest.mock('../../store', () => ({
  useCreateReferral: jest.fn(),
}));

// Mock the inner components
jest.mock('../../components', () => ({
  CommonModal: ({ children, isOpen }: any) => (isOpen ? <div data-testid='common-modal'>{children}</div> : null),
  Typography: ({ children }: any) => <div>{children}</div>,
  ReferralForm: ({ onSubmit, onCancel, isSubmitting }: any) => (
    <div>
      <button onClick={() => onSubmit({ givenName: 'John', surname: 'Doe' })}>Submit</button>
      <button onClick={onCancel}>Cancel</button>
      {isSubmitting && <span>Loading...</span>}
    </div>
  ),
}));

describe('AddReferralModal', () => {
  const mockMutate = jest.fn(() => Promise.resolve());
  const mockOnClose = jest.fn();

  beforeEach(() => {
    (useCreateReferral as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isLoading: false,
    });
    jest.clearAllMocks();
  });

  it('renders modal when open', () => {
    render(
      <AddReferralModal
        isOpen={true}
        onClose={mockOnClose}
      />,
    );
    expect(screen.getByTestId('common-modal')).toBeInTheDocument();
    expect(screen.getByText(/Add New Referral/i)).toBeInTheDocument();
  });

  it('calls onSubmit and onClose when form is submitted', async () => {
    render(
      <AddReferralModal
        isOpen={true}
        onClose={mockOnClose}
      />,
    );
    const submitButton = screen.getByText('Submit');

    fireEvent.click(submitButton);

    // mutate should be called with the form data
    expect(mockMutate).toHaveBeenCalledWith({ givenName: 'John', surname: 'Doe' });

    // onClose should be called after submit
    // since mutate is async, we can await a promise flush
    await Promise.resolve();
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('calls onClose when cancel is clicked', () => {
    render(
      <AddReferralModal
        isOpen={true}
        onClose={mockOnClose}
      />,
    );
    const cancelButton = screen.getByText('Cancel');

    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('shows loading indicator when isSubmitting is true', () => {
    (useCreateReferral as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isLoading: true,
    });

    render(
      <AddReferralModal
        isOpen={true}
        onClose={mockOnClose}
      />,
    );
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });
});
