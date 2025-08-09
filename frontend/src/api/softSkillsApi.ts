import mainApi from './mainApi';

export const softSkillsApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    addSoftSkill: builder.mutation({
      query: (data) => ({
        url: 'soft-skills',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'soft-skills', id: 'LIST' }],
    }),
    deleteSoftSkill: builder.mutation({
      query: (id) => ({
        url: `soft-skills/${id}`,
        method: 'DELETE',
        responseHandler: (response): Promise<string> => response.text(),
      }),
      invalidatesTags: [{ type: 'soft-skills', id: 'LIST' }],
    }),
  }),
});

export const { useAddSoftSkillMutation, useDeleteSoftSkillMutation } =
  softSkillsApi;
