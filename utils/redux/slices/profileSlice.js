import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  profileData: null,
  isLoading: false,
  error: null,
};

const reducers = {
  // set loading state on profile request
  fetchProfileRequest: (state) => {
    state.isLoading = true;
    state.error = null;
  },

  // set profile data when profile is fetched
  fetchProfileSuccess: (state, action) => {
    state.isLoading = false;
    state.profileData = action.payload;
  },

  // set error state profile fetch fails
  fetchProfileFailure: (state, action) => {
    state.isLoading = false;
    state.error = action.payload;
  },
};

/**
 * Redux slice for user's profile states
 */
const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers,
});

export const { fetchProfileRequest, fetchProfileSuccess, fetchProfileFailure } =
  profileSlice.actions;
export default profileSlice.reducer;
