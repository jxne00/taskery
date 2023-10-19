import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  profileData: null,
  profileIsLoading: false,
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
      state.profileIsLoading = true;
      state.error = null;
    },

    // set profile data when profile is fetched
    fetchProfileSuccess: (state, action) => {
      state.profileIsLoading = false;
      state.profileData = action.payload;
    },

    // set error state profile fetch fails
    fetchProfileFailure: (state, action) => {
      state.profileIsLoading = false;
      state.error = action.payload;
    },

    // update profile data
    updateProfileData: (state, action) => {
      state.profileData = {
        ...state.profileData,
        ...action.payload,
      };
    },

    // reset state on logout
    logout: () => initialState,
  },
});

export const {
  fetchProfileRequest,
  fetchProfileSuccess,
  fetchProfileFailure,
  updateProfileData,
  logout: logoutProfile,
} = profileSlice.actions;

export default profileSlice.reducer;
