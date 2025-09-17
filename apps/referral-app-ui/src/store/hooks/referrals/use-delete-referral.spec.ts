import { renderHook, act } from '@testing-library/react';
import { useAppDispatch } from '../hooks';
import { deleteReferral } from '../../../api/middleware/referral';
import { toast } from 'react-toastify';
import { useDeleteReferral } from './use-delete-referral';

jest.mock('../hooks', () => ({
  useAppDispatch: jest.fn(),
}));

jest.mock('../../../api/middleware/referral', () => ({
  deleteReferral: jest.fn(),
}));

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
  },
}));

describe('useDeleteReferral', () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    (useAppDispatch as jest.Mock).mockReturnValue(mockDispatch);
    mockDispatch.mockReset();
    (toast.success as jest.Mock).mockClear();
  });

  it('should delete a referral successfully', async () => {
    const referralId = 1;

    mockDispatch.mockReturnValue({ unwrap: jest.fn().mockResolvedValue(referralId) });

    const { result } = renderHook(() => useDeleteReferral());

    await act(async () => {
      const returned = await result.current.mutate(referralId);
      expect(returned).toBe(referralId);
    });

    expect(mockDispatch).toHaveBeenCalledWith(deleteReferral(referralId));
    expect(toast.success).toHaveBeenCalledWith('Referral deleted successfully!');
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should handle delete errors', async () => {
    const referralId = 2;
    const errorMsg = 'Failed to delete';

    mockDispatch.mockReturnValue({
      unwrap: jest.fn().mockRejectedValue({ response: { data: { error: errorMsg } } }),
    });

    const { result } = renderHook(() => useDeleteReferral());

    await act(async () => {
      await expect(result.current.mutate(referralId)).rejects.toEqual({
        response: { data: { error: errorMsg } },
      });
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(true);
    expect(result.current.error).toBe(errorMsg);
  });
});
