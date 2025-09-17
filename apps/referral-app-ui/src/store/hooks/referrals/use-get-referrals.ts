import { useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchReferrals } from '../../../api/middleware/referral';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

interface FetchParams {
  status?: string;
  limit?: number;
  offset?: number;
}

export const useReferrals = (params: FetchParams = {}) => {
  const dispatch = useAppDispatch();

  // Use Redux slice as source of truth
  const { referrals, pagination, loading, error } = useAppSelector((state) => state.referrals);

  // Refetch wrapper
  const refetch = useCallback(
    async (fetchParams: FetchParams = {}) => {
      try {
        await dispatch(fetchReferrals(fetchParams)).unwrap();
      } catch (err) {
        const axiosError = err as AxiosError<{ error: string }>;
        const msg = axiosError.response?.data?.error || axiosError.message || 'Failed to fetch referrals';
        console.log(msg);
      }
    },
    [dispatch],
  );

  // Fetch on mount
  useEffect(() => {
    refetch(params);
  }, []);

  return {
    referrals,
    pagination,
    isLoading: loading,
    isError: !!error,
    error,
    refetch,
  };
};
