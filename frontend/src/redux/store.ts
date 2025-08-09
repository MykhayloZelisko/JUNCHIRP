import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import { authSlice } from './auth/authSlice';
import mainApi from '@/api/mainApi';
import { csrfSlice } from './csrf/csrfSlice';
import { csrfApi } from '@/api/csrfApi';

export const makeStore = (): EnhancedStore => {
  return configureStore({
    reducer: {
      [mainApi.reducerPath]: mainApi.reducer,
      [csrfApi.reducerPath]: csrfApi.reducer,
      auth: authSlice.reducer,
      csrf: csrfSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          warnAfter: 100,
        },
      })
        .concat(mainApi.middleware)
        .concat(csrfApi.middleware),
    devTools: process.env.NODE_ENV !== 'production',
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
