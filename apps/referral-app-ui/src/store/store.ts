import { configureStore } from '@reduxjs/toolkit';
import referralSlice from './slices/referralSlice';

export const store = configureStore({
  reducer: {
    referrals: referralSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
