import { render, screen, fireEvent } from '@testing-library/react';
import { ReferralList } from './ReferralList';
import { useGetReferrals } from '../../store';

// Mock the store hooks
jest.mock('../../store', () => ({
  useGetReferrals: jest.fn(),
  useCreateReferral: jest.fn(),
  useUpdateReferral: jest.fn(),
  useDeleteReferral: jest.fn(),
}));

// Mock modal components
jest.mock('./AddReferralModal', () => ({
  __esModule: true,
  default: ({ isOpen, onClose }: any) =>
    isOpen ? (
      <div data-testid='add-modal'>
        <button onClick={onClose}>Close Add</button>
      </div>
    ) : null,
}));

jest.mock('./EditReferralModal', () => ({
  __esModule: true,
  default: ({ isOpen, onClose }: any) =>
    isOpen ? (
      <div data-testid='edit-modal'>
        <button onClick={onClose}>Close Edit</button>
      </div>
    ) : null,
}));

jest.mock('./DeleteReferralModal', () => ({
  __esModule: true,
  default: ({ isOpen, onClose }: any) =>
    isOpen ? (
      <div data-testid='delete-modal'>
        <button onClick={onClose}>Close Delete</button>
      </div>
    ) : null,
}));

describe('ReferralList', () => {
  const mockReferrals = [
    { id: '1', givenName: 'John', surname: 'Doe', email: 'john@example.com', phone: '12345' },
    { id: '2', givenName: 'Jane', surname: 'Smith', email: 'jane@example.com', phone: '67890' },
  ];

  const mockPagination = { total: 2, limit: 1, offset: 0 };
  const mockRefetch = jest.fn();

  beforeEach(() => {
    (useGetReferrals as jest.Mock).mockReturnValue({
      referrals: mockReferrals,
      pagination: mockPagination,
      isLoading: false,
      refetch: mockRefetch,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders list of referrals and Add button', () => {
    render(<ReferralList />);

    expect(screen.getByText(/Referrals/i)).toBeInTheDocument();
    expect(screen.getByText(/\+ Add Referral/i)).toBeInTheDocument();

    // check referral rows
    mockReferrals.forEach((r) => {
      expect(screen.getByText(r.givenName)).toBeInTheDocument();
      expect(screen.getByText(r.surname)).toBeInTheDocument();
      expect(screen.getByText(r.email)).toBeInTheDocument();
      expect(screen.getByText(r.phone)).toBeInTheDocument();
    });
  });

  it('opens AddReferralModal when Add button is clicked', () => {
    render(<ReferralList />);

    fireEvent.click(screen.getByText(/\+ Add Referral/i));
    expect(screen.getByTestId('add-modal')).toBeInTheDocument();
  });

  it('opens EditReferralModal when Edit button is clicked', () => {
    render(<ReferralList />);

    // simulate clicking the edit button in the first row
    const editButton = screen.getAllByText(/Edit/i)[0];
    fireEvent.click(editButton);

    expect(screen.getByTestId('edit-modal')).toBeInTheDocument();
  });

  it('opens DeleteReferralModal when Delete button is clicked', () => {
    render(<ReferralList />);

    const deleteButton = screen.getAllByText(/Delete/i)[0];
    fireEvent.click(deleteButton);

    expect(screen.getByTestId('delete-modal')).toBeInTheDocument();
  });

  it('calls refetch when pagination buttons are clicked', () => {
    render(<ReferralList />);

    const nextButton = screen.getByText(/Next/i);
    fireEvent.click(nextButton);

    expect(mockRefetch).toHaveBeenCalledWith({ offset: 1, limit: mockPagination.limit });

    const prevButton = screen.getByText(/Prev/i);
    fireEvent.click(prevButton);

    expect(mockRefetch).toHaveBeenCalledWith({ offset: 1, limit: mockPagination.limit });
  });

  it('shows Loader when isLoading is true', () => {
    (useGetReferrals as jest.Mock).mockReturnValueOnce({
      referrals: [],
      pagination: mockPagination,
      isLoading: true,
      refetch: mockRefetch,
    });

    render(<ReferralList />);

    expect(screen.getByText(/Referrals/i).previousSibling).toHaveClass('fixed'); // overlay loader
  });
});
