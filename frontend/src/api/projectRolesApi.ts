import mainApi from './mainApi';

export const projectRolesApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    getProjectRolesList: builder.query({
      query: () => ({
        url: 'project-roles/list',
      }),
      providesTags: ['project-roles-list'],
    }),
  }),
});

export const { useLazyGetProjectRolesListQuery } = projectRolesApi;
