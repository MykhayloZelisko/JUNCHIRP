import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import { authApi } from '@/api/authApi';
import { RootState } from '@/redux/store';
import { EducationInterface } from '@/shared/interfaces/education.interface';
import { educationsApi } from '@/api/educationsApi';

const educationsAdapter = createEntityAdapter<EducationInterface>();

export const educationsSlice = createSlice({
  name: 'educations',
  initialState: educationsAdapter.getInitialState(),
  reducers: {
    setEducations: educationsAdapter.setAll,
    // addEducations: educationsAdapter.addOne,
    // updateEducations: educationsAdapter.updateOne,
    // removeEducations: educationsAdapter.removeOne,
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      authApi.endpoints.getMe.matchFulfilled,
      (state, action) => {
        educationsAdapter.setAll(state, action.payload.educations);
      },
    );
    builder.addMatcher(
      educationsApi.endpoints.addEducation.matchFulfilled,
      (state, action) => {
        educationsAdapter.addOne(state, action.payload);
      },
    );
    builder.addMatcher(
      educationsApi.endpoints.deleteEducation.matchFulfilled,
      (state, action) => {
        educationsAdapter.removeOne(state, action.payload);
      },
    );
    builder.addMatcher(
      educationsApi.endpoints.updateEducation.matchFulfilled,
      (state, action) => {
        educationsAdapter.updateOne(state, {
          id: action.payload.id,
          changes: action.payload,
        });
      },
    );
  },
});

export const {
  setEducations,
  // addEducations,
  // updateEducations,
  // removeEducations,
} = educationsSlice.actions;

export default educationsSlice.reducer;

export const {
  selectAll: selectAllEducations,
  // selectById: selectEducationById,
  // selectIds: selectEducationsIds,
} = educationsAdapter.getSelectors((state: RootState) => state.educations);
