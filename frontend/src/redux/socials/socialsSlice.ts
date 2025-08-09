import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import { authApi } from '@/api/authApi';
import { RootState } from '@/redux/store';
import { SocialInterface } from '@/shared/interfaces/social.interface';
import { socialsApi } from '@/api/socialsApi';

const socialsAdapter = createEntityAdapter<SocialInterface>();

export const socialsSlice = createSlice({
  name: 'socials',
  initialState: socialsAdapter.getInitialState(),
  reducers: {
    setSocials: socialsAdapter.setAll,
    // addSocials: socialsAdapter.addOne,
    // updateSocials: socialsAdapter.updateOne,
    // removeSocials: socialsAdapter.removeOne,
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      authApi.endpoints.getMe.matchFulfilled,
      (state, action) => {
        socialsAdapter.setAll(state, action.payload.socials);
      },
    );
    builder.addMatcher(
      socialsApi.endpoints.addSocial.matchFulfilled,
      (state, action) => {
        socialsAdapter.addOne(state, action.payload);
      },
    );
    builder.addMatcher(
      socialsApi.endpoints.deleteSocial.matchFulfilled,
      (state, action) => {
        socialsAdapter.removeOne(state, action.payload);
      },
    );
    builder.addMatcher(
      socialsApi.endpoints.updateSocial.matchFulfilled,
      (state, action) => {
        socialsAdapter.updateOne(state, {
          id: action.payload.id,
          changes: action.payload,
        });
      },
    );
  },
});

export const {
  setSocials,
  // addSocials,
  // updateSocials,
  // removeSocials,
} = socialsSlice.actions;

export default socialsSlice.reducer;

export const {
  selectAll: selectAllSocials,
  // selectById: selectSocialById,
  // selectIds: selectSocialsIds,
} = socialsAdapter.getSelectors((state: RootState) => state.socials);
