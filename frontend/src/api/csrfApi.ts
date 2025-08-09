import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const csrfApi = createApi({
  reducerPath: 'csrfApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    credentials: 'include',
  }),
  endpoints: (build) => ({
    getCsrfToken: build.query<string, void>({
      query: () => ({
        url: 'csrf',
      }),
      transformResponse: (response: { csrfToken: string }) =>
        response.csrfToken,
    }),
  }),
});
