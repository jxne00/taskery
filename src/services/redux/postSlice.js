import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '../firebase';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';

/** fetch all public posts from firestore */
export const fetchAllPosts = createAsyncThunk('posts/fetchAllPosts', async () => {
    console.log('-> [AsyncThunk] fetching all public posts...');

    try {
        // get all posts that are public
        const postsRef = collection(db, 'posts');
        const postsQuery = query(
            postsRef,
            where('is_public', '==', true),
            orderBy('time_created', 'desc'),
        );
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
        console.log(err);
        alert(err);
    }
});

/** fetch user's posts from firestore */
export const fetchUserPosts = createAsyncThunk(
    'posts/fetchUserPosts',
    async (userId) => {
        console.log('-> [AsyncThunk] fetching user posts...');

        try {
            // get all posts posted by current user
            const postsRef = collection(db, 'posts');
            const postsQuery = query(
                postsRef,
                where('userId', '==', userId),
                orderBy('time_created', 'desc'),
            );

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
            console.log(err);
            alert(err);
        }
    },
);

/** Fetch comments of each post */
export const fetchComments = createAsyncThunk('posts/fetchComments', async (postId) => {
    console.log('-> [AsyncThunk] fetching comments...');

    try {
        // fetch comments from firestore
        const commentsRef = collection(db, 'posts', postId, 'comments');
        const snapshot = await getDocs(commentsRef);
        const comments = [];

        snapshot.forEach((doc) => {
            const data = doc.data();
            // convert firestore timestamp to milliseconds
            data.time_created = data.time_created.toMillis();

            comments.push({ ...data, id: doc.id });
        });

        return { postId, comments };
    } catch (err) {
        alert(err);
    }
});

// Posts slice
const postsSlice = createSlice({
    name: 'posts',
    initialState: {
        allPosts: [],
        userPosts: [],
        loading: {
            allPosts: false,
            userPosts: false,
            comments: false,
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
            })

            // ============ fetch comments ============ //
            .addCase(fetchComments.pending, (state) => {
                state.loading.comments = true;
            })
            .addCase(fetchComments.fulfilled, (state, action) => {
                state.loading.comments = false;
                const { postId, comments } = action.payload;
                // find and add fetched comments to the post
                const index = state.allPosts.findIndex((post) => post.id === postId);
                if (index !== -1) {
                    state.allPosts[index].comments = comments;
                }
            })
            .addCase(fetchComments.rejected, (state) => {
                state.loading.comments = false;
            });
    },
});

export default postsSlice.reducer;
