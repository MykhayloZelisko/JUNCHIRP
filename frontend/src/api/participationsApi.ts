import mainApi from './mainApi';

export const participationsApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    inviteUser: builder.mutation({
      query: (data) => ({
        url: 'participations/invite',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'invites', id: 'LIST' }],
    }),
  }),
});

export const { useInviteUserMutation } = participationsApi;
