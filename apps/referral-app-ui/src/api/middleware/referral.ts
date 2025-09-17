import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../services';
import { FetchReferralsResponse, Referral } from '../../types';
import { AxiosError } from 'axios';

// Fetch referrals
export const fetchReferrals = createAsyncThunk<
  FetchReferralsResponse,
  { status?: string; limit?: number; offset?: number } | undefined,
  { rejectValue: string }
>('referrals/fetchReferrals', async (params = {}, { rejectWithValue }) => {
  try {
    const response = await api.get<FetchReferralsResponse>('/referrals', { params });
    return response;
  } catch (err: unknown) {
    if (err instanceof AxiosError) {
      // Axios error: try to get the message from response.data.error
      return rejectWithValue(err.response?.data?.error || err.message);
    } else if (err instanceof Error) {
      // Generic JS error
      return rejectWithValue(err.message);
    } else {
      return rejectWithValue('Failed to get referral');
    }
  }
});

// Create referral
export const createReferral = createAsyncThunk<
  Referral,
  Omit<Referral, 'id' | 'createdAt' | 'updatedAt'>,
  { rejectValue: string }
>('referrals/createReferral', async (referralData, { rejectWithValue }) => {
  try {
    const response = await api.post<Referral>('/referrals', referralData);
    return response;
  } catch (err: unknown) {
    if (err instanceof AxiosError) {
      // Axios error: try to get the message from response.data.error
      return rejectWithValue(err.response?.data?.error || err.message);
    } else if (err instanceof Error) {
      // Generic JS error
      return rejectWithValue(err.message);
    } else {
      return rejectWithValue('Failed to create referral');
    }
  }
});

// Update referral
export const updateReferral = createAsyncThunk<
  Referral,
  { id: number; data: Partial<Referral> },
  { rejectValue: string }
>('referrals/updateReferral', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await api.patch<Referral>(`/referrals/${id}`, data);
    return response;
  } catch (err: unknown) {
    if (err instanceof AxiosError) {
      // Axios error: try to get the message from response.data.error
      return rejectWithValue(err.response?.data?.error || err.message);
    } else if (err instanceof Error) {
      // Generic JS error
      return rejectWithValue(err.message);
    } else {
      return rejectWithValue('Failed to Update referral');
    }
  }
});

// Delete referral
export const deleteReferral = createAsyncThunk<number, number, { rejectValue: string }>(
  'referrals/deleteReferral',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/referrals/${id}`);
      return id;
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        // Axios error: try to get the message from response.data.error
        return rejectWithValue(err.response?.data?.error || err.message);
      } else if (err instanceof Error) {
        // Generic JS error
        return rejectWithValue(err.message);
      } else {
        return rejectWithValue('Failed to Delete referral');
      }
    }
  },
);
