import mainApi from './mainApi';

export const educationsApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    getEducationsAutocomplete: builder.query({
      query: (fragment) => ({
        url: `educations/autocomplete?institution=${encodeURIComponent(fragment)}`,
      }),
    }),
    addEducation: builder.mutation({
      query: (data) => ({
        url: 'educations',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'educations', id: 'LIST' }, 'users'],
    }),
    updateEducation: builder.mutation({
      query: ({ id, data }) => ({
        url: `educations/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, args) => [
        { type: 'educations', id: args.id },
        'users',
      ],
    }),
    deleteEducation: builder.mutation({
      query: (id) => ({
        url: `educations/${id}`,
        method: 'DELETE',
        responseHandler: (response): Promise<string> => response.text(),
      }),
      invalidatesTags: [{ type: 'educations', id: 'LIST' }, 'users'],
    }),
  }),
});

export const {
  useAddEducationMutation,
  useDeleteEducationMutation,
  useUpdateEducationMutation,
  useLazyGetEducationsAutocompleteQuery,
} = educationsApi;
