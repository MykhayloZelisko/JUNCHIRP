import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import { RootState } from '@/redux/store';
import { ProjectCardInterface } from '@/shared/interfaces/project-card.interface';
import { usersApi } from '@/api/usersApi';

const myProjectsAdapter = createEntityAdapter<ProjectCardInterface>();

export const myProjectsSlice = createSlice({
  name: 'myProjects',
  initialState: myProjectsAdapter.getInitialState(),
  reducers: {
    // setMyProjects: myProjectsAdapter.setAll,
    // addMyProjects: myProjectsAdapter.addOne,
    // updateMyProjects: myProjectsAdapter.updateOne,
    // removeMyProjects: myProjectsAdapter.removeOne,
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      usersApi.endpoints.getMyProjects.matchFulfilled,
      (state, action) => {
        myProjectsAdapter.setAll(state, action.payload.projects);
      },
    );
  },
});

// export const {
//   setMyProjects,
//   addMyProjects,
//   updateMyProjects,
//   removeMyProjects,
// } = myProjectsSlice.actions;

export default myProjectsSlice.reducer;

export const {
  selectAll: selectAllMyProjects,
  selectById: selectMyProjectById,
  selectIds: selectMyProjectsIds,
} = myProjectsAdapter.getSelectors((state: RootState) => state.myProjects);
