import mainApi from './mainApi';

export const usersApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: (params) => {
        const query = new URLSearchParams();

        if (params.page) {
          query.set('page', params.page.toString());
        }
        if (params.limit) {
          query.set('limit', params.limit.toString());
        }
        if (params.activeProjectsCount) {
          query.set(
            'activeProjectsCount',
            params.activeProjectsCount.toString(),
          );
        }
        if (params.specializationIds?.length) {
          params.specializationIds.forEach((id: string) =>
            query.append('specializationIds', id),
          );
        }

        return {
          url: `/users?${query.toString()}`,
        };
      },
      providesTags: ['users'],
    }),
    getMyProjects: builder.query({
      query: () => {
        return {
          url: '/users/me/projects?status=active',
        };
      },
      providesTags: ['my-projects'],
    }),
    getUserById: builder.query({
      query: (id: string) => {
        return {
          url: `/users/${id}`,
        };
      },
    }),
  }),
});

export const {
  useGetUsersQuery,
  useLazyGetMyProjectsQuery,
  useGetUserByIdQuery,
} = usersApi;
