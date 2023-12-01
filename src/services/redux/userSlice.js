import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '../firebase';
import { storeAvatar } from '../firebase/helper';

/** fetch user's profile data from firestore */
const fetchUser = createAsyncThunk(
    'user/fetchUser',
    async (userId, { rejectWithValue }) => {
        console.log(': [Redux] fetching user...');

        try {
            const userRef = db.collection('users').doc(userId);
            const doc = await userRef.get();
            const data = doc.data();

            return data;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    },
);

/** update user's visibility */
const updateVisibility = createAsyncThunk(
    'user/updateVisibility',
    async ({ userId, updated }, { rejectWithValue }) => {
        try {
            await db.collection('users').doc(userId).update({ is_public: updated });
            return updated;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    },
);

/** update user's profile details */
const updateProfile = createAsyncThunk(
    'user/updateProfile',
    async ({ userId, name, avatar }, { rejectWithValue }) => {
        try {
            // get avatar image url if avatar is set
            let avatarUrl = avatar ? await storeAvatar(userId, avatar) : null;

            const updatedUser = {
                ...(name && { name }),
                ...(avatarUrl && { avatar_path: avatarUrl }),
            };

            await db.collection('users').doc(userId).set(updatedUser, { merge: true });
            return updatedUser;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    },
);

/** handle async state for all async thunks */
const handleAsyncState = {
    pending: (state) => {
        state.isLoading = true;
        state.error = null;
    },
    fulfilled: (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
    },
    rejected: (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
    },
};

/** redux slice for user */
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
            .addCase(fetchUser.pending, handleAsyncState.pending)
            .addCase(fetchUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload;
            })
            .addCase(fetchUser.rejected, handleAsyncState.rejected)

            // update visibility
            .addCase(updateVisibility.pending, handleAsyncState.pending)
            .addCase(updateVisibility.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data.is_public = action.payload;
            })
            .addCase(updateVisibility.rejected, handleAsyncState.rejected)

            // update profile
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.data.name = action.payload.name;
                state.data.avatar_path = action.payload.avatar_path;
            });
    },
});

export { fetchUser, updateVisibility, updateProfile };

export default userSlice.reducer;
