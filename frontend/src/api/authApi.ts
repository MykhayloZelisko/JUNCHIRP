import mainApi from './mainApi';
import { SoftSkillInterface } from '@/shared/interfaces/soft-skill.interface';
import { HardSkillInterface } from '@/shared/interfaces/hard-skill.interface';
import { EducationInterface } from '@/shared/interfaces/education.interface';
import { SocialInterface } from '@/shared/interfaces/social.interface';

export const authApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (userData) => ({
        url: 'auth/register',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['auth'],
    }),
    getMe: builder.query({
      query: () => ({
        url: 'users/me',
      }),
      providesTags: (result) =>
        result
          ? [
              'auth',
              { type: 'soft-skills', id: 'LIST' },
              ...result.softSkills.map((skill: SoftSkillInterface) => ({
                type: 'soft-skills',
                id: skill.id,
              })),
              { type: 'hard-skills', id: 'LIST' },
              ...result.hardSkills.map((skill: HardSkillInterface) => ({
                type: 'hard-skills',
                id: skill.id,
              })),
              { type: 'educations', id: 'LIST' },
              ...result.educations.map((edu: EducationInterface) => ({
                type: 'educations',
                id: edu.id,
              })),
              { type: 'socials', id: 'LIST' },
              ...result.socials.map((social: SocialInterface) => ({
                type: 'socials',
                id: social.id,
              })),
            ]
          : [
              'auth',
              { type: 'soft-skills', id: 'LIST' },
              { type: 'hard-skills', id: 'LIST' },
              { type: 'educations', id: 'LIST' },
              { type: 'socials', id: 'LIST' },
            ],
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: 'auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: [
        'auth',
        { type: 'soft-skills', id: 'LIST' },
        { type: 'hard-skills', id: 'LIST' },
        { type: 'educations', id: 'LIST' },
        { type: 'socials', id: 'LIST' },
      ],
    }),
    logout: builder.mutation({
      query: () => ({
        url: 'auth/logout',
        method: 'POST',
      }),
      invalidatesTags: [
        'auth',
        { type: 'soft-skills', id: 'LIST' },
        { type: 'hard-skills', id: 'LIST' },
        { type: 'educations', id: 'LIST' },
        { type: 'socials', id: 'LIST' },
      ],
    }),
    sendConfirmationEmail: builder.mutation({
      query: (data) => ({
        url: 'users/send-confirmation-email',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['auth'],
    }),
    confirmEmail: builder.mutation({
      query: (data) => ({
        url: 'users/confirm',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['auth', 'users'],
    }),
    requestPasswordReset: builder.mutation({
      query: (data) => ({
        url: 'users/request-password-reset',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['auth'],
    }),
    updateUser: builder.mutation({
      query: (data) => ({
        url: 'users/me',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['auth', 'users'],
    }),
    validateToken: builder.query({
      query: (token) => ({
        url: `users/validate-password-token?token=${encodeURIComponent(token)}`,
      }),
    }),
    resetPassword: builder.mutation({
      query: (data) => ({
        url: 'users/reset-password',
        method: 'POST',
        body: data,
      }),
    }),
    cancelResetPassword: builder.mutation({
      query: (token) => ({
        url: `users/password-token?token=${encodeURIComponent(token)}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useGetMeQuery,
  useSendConfirmationEmailMutation,
  useUpdateUserMutation,
  useConfirmEmailMutation,
  useRequestPasswordResetMutation,
  useValidateTokenQuery,
  useResetPasswordMutation,
  useCancelResetPasswordMutation,
} = authApi;
