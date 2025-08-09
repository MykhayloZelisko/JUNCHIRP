import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import { RootState } from '@/redux/store';
import { ProjectRoleTypeInterface } from '@/shared/interfaces/project-role-type.interface';
import { projectRolesApi } from '@/api/projectRolesApi';

const projectRolesListAdapter = createEntityAdapter<ProjectRoleTypeInterface>();

export const projectRolesListSlice = createSlice({
  name: 'projectRolesList',
  initialState: projectRolesListAdapter.getInitialState(),
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      projectRolesApi.endpoints.getProjectRolesList.matchFulfilled,
      (state, action) => {
        projectRolesListAdapter.setAll(state, action.payload);
      },
    );
  },
});

export default projectRolesListSlice.reducer;

export const {
  selectAll: selectAllProjectRolesList,
  selectById: selectProjectRoleListItemById,
  selectIds: selectProjectRolesListIds,
} = projectRolesListAdapter.getSelectors(
  (state: RootState) => state.projectRolesList,
);
