import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

/** fetch all public posts from firestore */
export const fetchAllPosts = createAsyncThunk('posts/fetchAllPosts', async () => {
    try {
        console.log(': (AsyncThunk) fetching all public posts!');
        // get all posts that are public
        const postsRef = collection(db, 'posts');
        const postsQuery = query(postsRef, where('is_public', '==', true));

        const snapshot = await getDocs(postsQuery);
        const posts = [];

        snapshot.forEach((doc) => {
            const data = doc.data();
            // convert firestore timestamp to milliseconds
            data.time_created = data.time_created.toMillis();
            data.time_edited = data.time_edited.toMillis();

            posts.push({ ...data, id: doc.id });
        });
        return posts;
    } catch (err) {
        alert(err);
    }
});

/** fetch user's posts from firestore */
export const fetchUserPosts = createAsyncThunk(
    'posts/fetchUserPosts',
    async (userId) => {
        try {
            console.log(': (AsyncThunk) fetching user posts!');
            const postsRef = collection(db, 'posts');
            const postsQuery = query(postsRef, where('userId', '==', userId));

            const snapshot = await getDocs(postsQuery);
            const posts = [];

            snapshot.forEach((doc) => {
                const data = doc.data();
                // convert firestore timestamp to milliseconds
                data.time_created = data.time_created.toMillis();
                data.time_edited = data.time_edited.toMillis();

                posts.push({ ...data, id: doc.id });
            });

            return posts;
        } catch (err) {
            console.error('Error fetching user posts:', err);
            alert(err);
        }
    },
);

// Posts slice
const postsSlice = createSlice({
    name: 'posts',
    initialState: {
        allPosts: [],
        userPosts: [],
        loading: {
            allPosts: false,
            userPosts: false,
        },
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // ============ fetch all posts ============ //
            .addCase(fetchAllPosts.pending, (state) => {
                state.loading.allPosts = true;
            })
            .addCase(fetchAllPosts.fulfilled, (state, action) => {
                state.loading.allPosts = false;
                state.allPosts = action.payload;
            })
            .addCase(fetchAllPosts.rejected, (state, action) => {
                state.loading.allPosts = false;
                state.error = action.error.message;
            })

            // ============ fetch user's posts ============ //
            .addCase(fetchUserPosts.pending, (state) => {
                state.loading.userPosts = true;
            })
            .addCase(fetchUserPosts.fulfilled, (state, action) => {
                state.loading.userPosts = false;
                state.userPosts = action.payload;
            })
            .addCase(fetchUserPosts.rejected, (state, action) => {
                state.loading.userPosts = false;
                state.error = action.error.message;
            });
    },
});

export default postsSlice.reducer;
