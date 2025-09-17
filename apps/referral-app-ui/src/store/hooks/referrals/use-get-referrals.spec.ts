import { renderHook, act } from '@testing-library/react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchReferrals } from '../../../api/middleware/referral';
import { useGetReferrals } from './use-get-referrals';

jest.mock('../hooks', () => ({
  useAppDispatch: jest.fn(),
  useAppSelector: jest.fn(),
}));

jest.mock('../../../api/middleware/referral', () => ({
  fetchReferrals: jest.fn(),
}));

describe('useReferrals', () => {
  const mockDispatch = jest.fn();
  const mockState = {
    referrals: [{ id: 1, givenName: 'John', surname: 'Doe' }],
    pagination: { total: 1, limit: 10, offset: 0 },
    loading: false,
    error: null,
  };

  beforeEach(() => {
    (useAppDispatch as jest.Mock).mockReturnValue(mockDispatch);
    (useAppSelector as jest.Mock).mockImplementation((selectorFn: any) => selectorFn({ referrals: mockState }));
    mockDispatch.mockReset();
  });

  it('returns referrals and pagination from Redux slice', () => {
    const { result } = renderHook(() => useGetReferrals());

    expect(result.current.referrals).toEqual(mockState.referrals);
    expect(result.current.pagination).toEqual(mockState.pagination);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('calls dispatch on mount to fetch referrals', async () => {
    const mockUnwrap = jest.fn().mockResolvedValue(mockState.referrals);
    mockDispatch.mockReturnValue({ unwrap: mockUnwrap });

    renderHook(() => useGetReferrals({ status: 'pending', limit: 10 }));

    expect(mockDispatch).toHaveBeenCalledWith(fetchReferrals({ status: 'pending', limit: 10 }));
  });

  it('refetch calls dispatch with given params', async () => {
    const mockUnwrap = jest.fn().mockResolvedValue(mockState.referrals);
    mockDispatch.mockReturnValue({ unwrap: mockUnwrap });

    const { result } = renderHook(() => useGetReferrals());

    await act(async () => {
      await result.current.refetch({ status: 'completed', limit: 5 });
    });

    expect(mockDispatch).toHaveBeenCalledWith(fetchReferrals({ status: 'completed', limit: 5 }));
  });

  it('handles errors during refetch', async () => {
    const errorMsg = 'Fetch failed';
    const mockUnwrap = jest.fn().mockRejectedValue({ response: { data: { error: errorMsg } } });
    mockDispatch.mockReturnValue({ unwrap: mockUnwrap });

    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    const { result } = renderHook(() => useGetReferrals());

    await act(async () => {
      await result.current.refetch({ status: 'pending' });
    });

    expect(consoleSpy).toHaveBeenCalledWith(errorMsg);
    consoleSpy.mockRestore();
  });
});
