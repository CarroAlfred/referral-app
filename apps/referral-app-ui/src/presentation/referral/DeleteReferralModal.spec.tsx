import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DeleteReferralModal from './DeleteReferralModal';
import { useDeleteReferral } from '../../store';
import { Referral } from '../../types';

// Mock the hook
jest.mock('../../store', () => ({
  useDeleteReferral: jest.fn(),
}));

// Mock components
jest.mock('../../components', () => ({
  CommonModal: ({ children, footerActions, isOpen }: any) =>
    isOpen ? (
      <div data-testid='common-modal'>
        {children}
        <div>{footerActions}</div>
      </div>
    ) : null,
  Typography: ({ children, as }: any) => React.createElement(as || 'div', {}, children),
  Button: ({ children, onClick, disabled }: any) => (
    <button
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  ),
}));

describe('DeleteReferralModal', () => {
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
    (useDeleteReferral as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isLoading: false,
    });
    jest.clearAllMocks();
  });

  it('renders modal with referral info', () => {
    render(
      <DeleteReferralModal
        isOpen={true}
        onClose={mockOnClose}
        referral={referral}
      />,
    );
    expect(screen.getByTestId('common-modal')).toBeInTheDocument();
    expect(screen.getByText(/Confirm Delete/i)).toBeInTheDocument();
    expect(screen.getByText(/John/)).toBeInTheDocument();
    expect(screen.getByText(/Are you sure you want to delete/i)).toBeInTheDocument();
  });

  it('calls onClose when cancel is clicked', () => {
    render(
      <DeleteReferralModal
        isOpen={true}
        onClose={mockOnClose}
        referral={referral}
      />,
    );
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('calls deleteReferralMutate and onClose when delete is clicked', async () => {
    render(
      <DeleteReferralModal
        isOpen={true}
        onClose={mockOnClose}
        referral={referral}
      />,
    );
    const deleteButton = screen.getByText('Delete');

    fireEvent.click(deleteButton);

    expect(mockMutate).toHaveBeenCalledWith(1);

    // Wait for async mutate
    await Promise.resolve();
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('disables delete button when loading', () => {
    (useDeleteReferral as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isLoading: true,
    });

    render(
      <DeleteReferralModal
        isOpen={true}
        onClose={mockOnClose}
        referral={referral}
      />,
    );
    const deleteButton = screen.getByText('Delete');
    expect(deleteButton).toBeDisabled();
  });
});
