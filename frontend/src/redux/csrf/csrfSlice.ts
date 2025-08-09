import { createSlice } from '@reduxjs/toolkit';
import { csrfApi } from '@/api/csrfApi';

interface CsrfState {
  token: string | null;
}

const initialState: CsrfState = {
  token: null,
};

export const csrfSlice = createSlice({
  name: 'csrf',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      csrfApi.endpoints.getCsrfToken.matchFulfilled,
      (state, { payload }) => {
        state.token = payload;
      },
    );
  },
});

export default csrfSlice.reducer;
