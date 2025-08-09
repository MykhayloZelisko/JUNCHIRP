import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import { authApi } from '@/api/authApi';
import { RootState } from '@/redux/store';
import { HardSkillInterface } from '@/shared/interfaces/hard-skill.interface';
import { hardSkillsApi } from '@/api/hardSkillsApi';

const hardSkillsAdapter = createEntityAdapter<HardSkillInterface>();

export const hardSkillsSlice = createSlice({
  name: 'hardSkills',
  initialState: hardSkillsAdapter.getInitialState(),
  reducers: {
    setHardSkills: hardSkillsAdapter.setAll,
    // addHardSkills: hardSkillsAdapter.addOne,
    // updateHardSkills: hardSkillsAdapter.updateOne,
    // removeHardSkills: hardSkillsAdapter.removeOne,
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      authApi.endpoints.getMe.matchFulfilled,
      (state, action) => {
        hardSkillsAdapter.setAll(state, action.payload.hardSkills);
      },
    );
    builder.addMatcher(
      hardSkillsApi.endpoints.addHardSkill.matchFulfilled,
      (state, action) => {
        hardSkillsAdapter.addOne(state, action.payload);
      },
    );
    builder.addMatcher(
      hardSkillsApi.endpoints.deleteHardSkill.matchFulfilled,
      (state, action) => {
        hardSkillsAdapter.removeOne(state, action.payload);
      },
    );
  },
});

export const {
  setHardSkills,
  // addHardSkills,
  // updateHardSkills,
  // removeHardSkills,
} = hardSkillsSlice.actions;

export default hardSkillsSlice.reducer;

export const {
  selectAll: selectAllHardSkills,
  // selectById: selectHardSkillById,
  // selectIds: selectHardSkillsIds,
} = hardSkillsAdapter.getSelectors((state: RootState) => state.hardSkills);
