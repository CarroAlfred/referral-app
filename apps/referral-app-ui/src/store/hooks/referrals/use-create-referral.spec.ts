import { useAppDispatch } from '../hooks';
import { toast } from 'react-toastify';
import { useCreateReferral } from './use-create-referral';
import { act, renderHook } from '@testing-library/react';

// Mock dependencies
jest.mock('../hooks', () => ({
  useAppDispatch: jest.fn(),
}));

jest.mock('../../../api/middleware/referral', () => ({
  createReferral: jest.fn(),
}));

jest.mock('react-toastify', () => ({
  toast: { success: jest.fn() },
}));

describe('useCreateReferral', () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    (useAppDispatch as jest.Mock).mockReturnValue(mockDispatch);
    jest.clearAllMocks();
  });

  const referralData = {
    id: 1,
    givenName: 'John',
    surname: 'Doe',
    email: 'john@example.com',
    phone: '12345',
    homeNameOrNumber: '123',
    street: 'Main St',
    suburb: 'Suburbia',
    state: 'State',
    postcode: '12345',
    country: 'Country',
    status: 'pending' as const,
    notes: '',
    referredBy: '',
  };

  it('successfully creates a referral', async () => {
    const returnedReferral = { ...referralData, id: '1', createdAt: '', updatedAt: '' };
    mockDispatch.mockReturnValue({
      unwrap: jest.fn().mockResolvedValue(returnedReferral),
    });

    const { result } = renderHook(() => useCreateReferral());

    let response;
    await act(async () => {
      response = await result.current.mutate(referralData);
    });

    expect(response).toEqual(returnedReferral);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
    expect(toast.success).toHaveBeenCalledWith(
      `Referral for ${returnedReferral.givenName} ${returnedReferral.surname} created successfully!`,
    );
  });

  it('handles errors correctly', async () => {
    const error = { response: { data: { error: 'Failed' } } };
    mockDispatch.mockReturnValue({
      unwrap: jest.fn().mockRejectedValue(error),
    });

    const { result } = renderHook(() => useCreateReferral());

    await act(async () => {
      await expect(result.current.mutate(referralData)).rejects.toEqual(error);
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(true);
    expect(result.current.error).toBe('Failed');
    expect(toast.success).not.toHaveBeenCalled();
  });
});
