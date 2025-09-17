import { useState, useCallback } from 'react';
import { useAppDispatch } from '../hooks';
import { deleteReferral } from '../../../api/middleware/referral';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

export const useDeleteReferral = () => {
  const dispatch = useAppDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(
    async (id: number) => {
      setIsLoading(true);
      setIsError(false);
      setError(null);

      try {
        await dispatch(deleteReferral(id)).unwrap();

        // Success toast
        toast.success('Referral deleted successfully!');

        // Redux slice auto-updates the list; no local state needed
        return id;
      } catch (err) {
        const axiosError = err as AxiosError<{ error: string }>;
        const msg = axiosError.response?.data?.error || axiosError.message || 'Failed to delete referral';
        setIsError(true);
        setError(msg);

        // Error toast
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [dispatch],
  );

  return { mutate, isLoading, isError, error };
};
