// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import counterSlice from './slices/counterSlice';
import referralSlice from './slices/referralSlice';

export const store = configureStore({
  reducer: {
    counter: counterSlice,
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
