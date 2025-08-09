import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import { SoftSkillInterface } from '@/shared/interfaces/soft-skill.interface';
import { authApi } from '@/api/authApi';
import { RootState } from '@/redux/store';
import { softSkillsApi } from '@/api/softSkillsApi';

const softSkillsAdapter = createEntityAdapter<SoftSkillInterface>();

export const softSkillsSlice = createSlice({
  name: 'softSkills',
  initialState: softSkillsAdapter.getInitialState(),
  reducers: {
    setSoftSkills: softSkillsAdapter.setAll,
    // addSoftSkills: softSkillsAdapter.addOne,
    // updateSoftSkills: softSkillsAdapter.updateOne,
    // removeSoftSkills: softSkillsAdapter.removeOne,
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      authApi.endpoints.getMe.matchFulfilled,
      (state, action) => {
        softSkillsAdapter.setAll(state, action.payload.softSkills);
      },
    );
    builder.addMatcher(
      softSkillsApi.endpoints.addSoftSkill.matchFulfilled,
      (state, action) => {
        softSkillsAdapter.addOne(state, action.payload);
      },
    );
    builder.addMatcher(
      softSkillsApi.endpoints.deleteSoftSkill.matchFulfilled,
      (state, action) => {
        softSkillsAdapter.removeOne(state, action.payload);
      },
    );
  },
});

export const {
  setSoftSkills,
  // addSoftSkills,
  // updateSoftSkills,
  // removeSoftSkills,
} = softSkillsSlice.actions;

export default softSkillsSlice.reducer;

export const {
  selectAll: selectAllSoftSkills,
  // selectById: selectSoftSkillById,
  // selectIds: selectSoftSkillsIds,
} = softSkillsAdapter.getSelectors((state: RootState) => state.softSkills);
