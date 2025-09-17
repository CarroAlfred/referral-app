import { renderHook, act } from '@testing-library/react';
import { useAppDispatch } from '../hooks';
import { updateReferral } from '../../../api/middleware/referral';
import { toast } from 'react-toastify';
import { useUpdateReferral } from './use-update-referral';

jest.mock('../hooks', () => ({
  useAppDispatch: jest.fn(),
}));

jest.mock('../../../api/middleware/referral', () => ({
  updateReferral: jest.fn(),
}));

jest.mock('react-toastify', () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

describe('useUpdateReferral', () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    (useAppDispatch as jest.Mock).mockReturnValue(mockDispatch);
    mockDispatch.mockReset();
    (toast.success as jest.Mock).mockClear();
  });

  const mockReferral = {
    id: 1,
    givenName: 'John',
    surname: 'Doe',
    email: 'john@example.com',
    phone: '123456789',
    homeNameOrNumber: '123',
    street: 'Main St',
    suburb: 'Suburbia',
    state: 'State',
    postcode: '1234',
    country: 'Country',
    status: 'pending' as const,
    notes: '',
    referredBy: '',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  };

  it('calls dispatch and returns updated referral on success', async () => {
    const mockUnwrap = jest.fn().mockResolvedValue(mockReferral);
    mockDispatch.mockReturnValue({ unwrap: mockUnwrap });

    const { result } = renderHook(() => useUpdateReferral());

    let returned: any;
    await act(async () => {
      returned = await result.current.mutate({ id: mockReferral.id, data: { givenName: 'Jane' } });
    });

    expect(mockDispatch).toHaveBeenCalledWith(updateReferral({ id: mockReferral.id, data: { givenName: 'Jane' } }));
    expect(returned).toEqual(mockReferral);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
    expect(result.current.error).toBeNull();
    expect(toast.success).toHaveBeenCalledWith('Referral John Doe updated successfully!');
  });

  it('sets error state on failure', async () => {
    const errorMessage = 'Update failed';
    const mockUnwrap = jest.fn().mockRejectedValue({ response: { data: { error: errorMessage } } });
    mockDispatch.mockReturnValue({ unwrap: mockUnwrap });

    const { result } = renderHook(() => useUpdateReferral());

    await act(async () => {
      await expect(result.current.mutate({ id: mockReferral.id, data: { givenName: 'Jane' } })).rejects.toEqual({
        response: { data: { error: errorMessage } },
      });
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(true);
    expect(result.current.error).toBe(errorMessage);
  });
});
