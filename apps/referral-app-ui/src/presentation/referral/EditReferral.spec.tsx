import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import EditReferralModal from './EditReferralModal';
import { useUpdateReferral } from '../../store';
import { Referral } from '../../types';

// Mock the hook
jest.mock('../../store', () => ({
  useUpdateReferral: jest.fn(),
}));

// Mock components
jest.mock('../../components', () => ({
  CommonModal: ({ children, isOpen }: any) => (isOpen ? <div data-testid='common-modal'>{children}</div> : null),
  Typography: ({ children, as }: any) => React.createElement(as || 'div', {}, children),
  ReferralForm: ({ onSubmit, onCancel, isSubmitting }: any) => (
    <div>
      <span>ReferralForm Mock</span>
      <button onClick={() => onSubmit({ givenName: 'Updated' })}>Submit</button>
      <button onClick={onCancel}>Cancel</button>
      {isSubmitting && <span>Submitting...</span>}
    </div>
  ),
}));

describe('EditReferralModal', () => {
  const mockOnClose = jest.fn();
  const mockMutate = jest.fn(() => Promise.resolve());
  const referral: Referral = {
    id: 1,
    givenName: 'John',
    surname: 'Doe',
    email: 'john@example.com',
    phone: '1234567890',
    homeNameOrNumber: '',
    street: '',
    suburb: '',
    state: '',
    postcode: '',
    country: '',
    status: 'pending',
    notes: '',
    referredBy: '',
    createdAt: '',
    updatedAt: '',
  };

  beforeEach(() => {
    (useUpdateReferral as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isLoading: false,
    });
    jest.clearAllMocks();
  });

  it('renders modal with ReferralForm', () => {
    render(
      <EditReferralModal
        isOpen={true}
        onClose={mockOnClose}
        referral={referral}
      />,
    );
    expect(screen.getByTestId('common-modal')).toBeInTheDocument();
    expect(screen.getByText(/Edit Referral/i)).toBeInTheDocument();
    expect(screen.getByText(/ReferralForm Mock/i)).toBeInTheDocument();
  });

  it('calls onClose when cancel is clicked', () => {
    render(
      <EditReferralModal
        isOpen={true}
        onClose={mockOnClose}
        referral={referral}
      />,
    );
    fireEvent.click(screen.getByText('Cancel'));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('calls updateReferralMutate and onClose when submit is clicked', async () => {
    render(
      <EditReferralModal
        isOpen={true}
        onClose={mockOnClose}
        referral={referral}
      />,
    );
    fireEvent.click(screen.getByText('Submit'));

    expect(mockMutate).toHaveBeenCalledWith({ id: 1, data: { givenName: 'Updated' } });

    // Wait for async mutate
    await Promise.resolve();
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('shows submitting indicator when isSubmitting is true', () => {
    (useUpdateReferral as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isLoading: true,
    });

    render(
      <EditReferralModal
        isOpen={true}
        onClose={mockOnClose}
        referral={referral}
      />,
    );
    expect(screen.getByText('Submitting...')).toBeInTheDocument();
  });
});
