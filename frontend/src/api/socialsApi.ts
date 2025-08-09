import mainApi from './mainApi';

export const socialsApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    addSocial: builder.mutation({
      query: (data) => ({
        url: 'socials',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'socials', id: 'LIST' }],
    }),
    updateSocial: builder.mutation({
      query: ({ id, data }) => ({
        url: `socials/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, args) => [
        { type: 'socials', id: args.id },
      ],
    }),
    deleteSocial: builder.mutation({
      query: (id) => ({
        url: `socials/${id}`,
        method: 'DELETE',
        responseHandler: (response): Promise<string> => response.text(),
      }),
      invalidatesTags: [{ type: 'socials', id: 'LIST' }],
    }),
  }),
});

export const {
  useAddSocialMutation,
  useDeleteSocialMutation,
  useUpdateSocialMutation,
} = socialsApi;
