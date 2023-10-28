import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '../firebase';

/** fetch user's profile data from firestore */
export const fetchUser = createAsyncThunk('user/fetchUser', async (userId) => {
  const userRef = db.collection('users').doc(userId);
  const doc = await userRef.get();
  const data = doc.data();

  if (data && data.created_at) {
    // convert firestore timestamp to milliseconds
    data.created_at = data.created_at.toMillis();
  }

  return data;
});

/** update user's visibility */
export const updateVisibility = createAsyncThunk(
  'user/updateVisibility',
  async ({ userId, updated }) => {
    try {
      await db.collection('users').doc(userId).update({ is_public: updated });

      return updated;
    } catch (err) {
      alert(err);
    }
  },
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    data: null,
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetch user profile data
      .addCase(fetchUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // update visibility
      .addCase(updateVisibility.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateVisibility.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data.is_public = action.payload;
      })
      .addCase(updateVisibility.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export default userSlice.reducer;
