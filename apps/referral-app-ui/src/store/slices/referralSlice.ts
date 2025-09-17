import { createSlice, PayloadAction, isRejected, isFulfilled } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { Pagination } from '../../types/util';
import { createReferral, deleteReferral, fetchReferrals, updateReferral } from '../../api/middleware/referral';
import { ReferralState } from '../../types/referral';

const initialState: ReferralState = {
  referrals: [],
  loading: false,
  error: null,
  pagination: {
    total: 0,
    limit: 50,
    offset: 0,
    hasMore: false,
  },
};

export const referralSlice = createSlice({
  name: 'referrals',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updatePagination: (state, action: PayloadAction<Partial<Pagination>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch referrals
      .addCase(fetchReferrals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReferrals.fulfilled, (state, action) => {
        state.loading = false;
        state.referrals = action.payload.referrals;
        state.pagination = action.payload.pagination;
      })

      // Create referral
      .addCase(createReferral.fulfilled, (state, action) => {
        state.referrals.unshift(action.payload);
        state.pagination.total += 1;
      })

      // Update referral
      .addCase(updateReferral.fulfilled, (state, action) => {
        const index = state.referrals.findIndex((ref) => ref.id === action.payload.id);
        if (index !== -1) {
          state.referrals[index] = action.payload;
        }
      })

      // Delete referral
      .addCase(deleteReferral.fulfilled, (state, action) => {
        state.referrals = state.referrals.filter((ref) => ref.id !== action.payload);
        state.pagination.total -= 1;
      })

      // 🔥 Unified error handler
      .addMatcher(isRejected(fetchReferrals, createReferral, updateReferral, deleteReferral), (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error.message || 'Something went wrong';
        toast.error(state.error);
      })

      // Handle fulfilled resets loading
      .addMatcher(isFulfilled(fetchReferrals, createReferral, updateReferral, deleteReferral), (state) => {
        state.loading = false;
      });
  },
});

export const { clearError, updatePagination } = referralSlice.actions;
export default referralSlice.reducer;
