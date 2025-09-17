import { useState, useCallback } from 'react';
import { useAppDispatch } from '../hooks';
import { createReferral } from '../../../api/middleware/referral';
import { Referral } from '../../../types/referral';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

export const useCreateReferral = () => {
  const dispatch = useAppDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(
    async (createParams: Omit<Referral, 'id' | 'createdAt' | 'updatedAt'>) => {
      setIsLoading(true);

      try {
        const result = await dispatch(createReferral(createParams)).unwrap();

        toast.success(`Referral for ${result.givenName} ${result.surname} created successfully!`);

        // No need to manually update a local list — table/list subscribes to Redux slice
        return result;
      } catch (err) {
        const axiosError = err as AxiosError<{ error: string }>;
        const msg = axiosError.response?.data?.error || axiosError.message || 'Failed to create referral';

        setIsError(true);
        setError(msg);

        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [dispatch],
  );

  return {
    mutate,
    isLoading,
    isError,
    error,
  };
};
