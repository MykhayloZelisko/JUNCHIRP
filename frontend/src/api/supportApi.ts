import mainApi from './mainApi';

export const supportApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    support: builder.mutation({
      query: (data) => ({
        url: 'support',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const { useSupportMutation } = supportApi;
