import mainApi from './mainApi';

export const hardSkillsApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    addHardSkill: builder.mutation({
      query: (data) => ({
        url: 'hard-skills',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'hard-skills', id: 'LIST' }],
    }),
    deleteHardSkill: builder.mutation({
      query: (id) => ({
        url: `hard-skills/${id}`,
        method: 'DELETE',
        responseHandler: (response): Promise<string> => response.text(),
      }),
      invalidatesTags: [{ type: 'hard-skills', id: 'LIST' }],
    }),
  }),
});

export const { useAddHardSkillMutation, useDeleteHardSkillMutation } =
  hardSkillsApi;
