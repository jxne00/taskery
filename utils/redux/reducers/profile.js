import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  profileData: null,
  isLoading: false,
  error: null,
};

/**
 * Redux slice for user's profile states
 */
const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    // set loading state on profile request
    fetchProfileRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },

    // set profile data when profile is fetched
    fetchProfileSuccess: (state, action) => {
      state.isLoading = false;
      state.profileData = action.payload;
      state.error = null;
    },

    // set error state profile fetch fails
    fetchProfileFailure: (state, action) => {
      state.isLoading = false;
      state.profileData = null;
      state.error = action.payload;
    },

    // update profile data
    updateProfileData: (state, action) => {
      state.profileData = {
        ...state.profileData,
        ...action.payload,
      };
    },
  },
});

export const {
  fetchProfileRequest,
  fetchProfileSuccess,
  fetchProfileFailure,
  updateProfileData,
} = profileSlice.actions;

export default profileSlice.reducer;
