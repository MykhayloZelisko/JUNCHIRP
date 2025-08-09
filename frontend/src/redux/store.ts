import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import { authSlice } from './auth/authSlice';
import mainApi from '@/api/mainApi';
import { csrfSlice } from './csrf/csrfSlice';
import { csrfApi } from '@/api/csrfApi';
import { softSkillsSlice } from '@/redux/softSkills/softSkillsSlice';
import { hardSkillsSlice } from '@/redux/hardSkills/hardSkillsSlice';
import { educationsSlice } from '@/redux/educations/educationsSlice';
import { socialsSlice } from '@/redux/socials/socialsSlice';
import { projectRolesListSlice } from '@/redux/projectRolesList/projectRolesListSlice';
import { myProjectsSlice } from '@/redux/myProjects/myProjectsSlice';

export const makeStore = (): EnhancedStore => {
  return configureStore({
    reducer: {
      [mainApi.reducerPath]: mainApi.reducer,
      [csrfApi.reducerPath]: csrfApi.reducer,
      auth: authSlice.reducer,
      csrf: csrfSlice.reducer,
      softSkills: softSkillsSlice.reducer,
      hardSkills: hardSkillsSlice.reducer,
      educations: educationsSlice.reducer,
      socials: socialsSlice.reducer,
      projectRolesList: projectRolesListSlice.reducer,
      myProjects: myProjectsSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          warnAfter: 100,
        },
      })
        .concat(mainApi.middleware)
        .concat(csrfApi.middleware),
    devTools: process.env.NODE_ENV !== 'production',
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
