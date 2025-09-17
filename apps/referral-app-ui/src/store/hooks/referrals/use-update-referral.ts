import { useCallback, useState } from 'react';
import { useAppDispatch } from '../hooks';
import { updateReferral } from '../../../api/middleware/referral';
import { Referral } from '../../../types/referral';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

export const useUpdateReferral = () => {
  const dispatch = useAppDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(
    async (updateParams: { id: number; data: Partial<Referral> }) => {
      setIsLoading(true);
      setIsError(false);
      setError(null);

      try {
        const result = await dispatch(updateReferral(updateParams)).unwrap();

        // Success toast
        toast.success(`Referral ${result.givenName} ${result.surname} updated successfully!`);

        // Slice is updated automatically; no need to set local state
        return result;
      } catch (err) {
        const axiosError = err as AxiosError<{ error: string }>;
        const msg = axiosError.response?.data?.error || axiosError.message || 'Failed to update referral';
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
