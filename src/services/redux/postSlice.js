import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '../firebase';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { toTimestamp } from '../firebase/helper';

/** fetch all public posts from firestore */
export const fetchAllPosts = createAsyncThunk('posts/fetchAllPosts', async () => {
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

/** fetch comments of each post */
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

/** fetch likes */
export const fetchLikes = createAsyncThunk('posts/fetchLikes', async (postId) => {
    console.log('-> [AsyncThunk] fetching likes...');
    try {
        // fetch likes from firestore
        const likesRef = collection(db, 'posts', postId, 'likes');
        const snapshot = await getDocs(likesRef);
        const likes = [];

        snapshot.forEach((doc) => {
            likes.push(doc.data());
        });

        return { postId, likes };
    } catch (err) {
        alert(err);
    }
});

/** add like to post */
export const addLike = createAsyncThunk('posts/addLike', async (like) => {
    try {
        // add like to firestore
        const likesRef = collection(db, 'posts', like.postId, 'likes');
        await likesRef.add(like);
        return like;
    } catch (err) {
        console.log(err);
        alert(err);
    }
});

/** remove like from post */
export const removeLike = createAsyncThunk('posts/removeLike', async (like) => {
    try {
        // remove like from firestore
        const likeRef = collection(db, 'posts', like.postId, 'likes').doc(like.id);
        await likeRef.delete();
        return like;
    } catch (err) {
        console.log(err);
        alert(err);
    }
});

/** add a new post to firestore */
export const addPost = createAsyncThunk('posts/addPost', async (post) => {
    if (!post.userId) {
        alert('Please log in to add a task!');
        return;
    }

    try {
        // create a copy for firestore update
        // because firestore date has to be a timestamp
        const dataForStore = { ...post };

        // convert js date to firestore timestamp
        dataForStore.time_created = toTimestamp(dataForStore.time_created);

        const docRef = await db.collection('posts').add(dataForStore);
        return { ...post, id: docRef.id };
    } catch (err) {
        console.log(err);
        alert(err);
    }
});

/** delete a post */
export const deletePost = createAsyncThunk('posts/deletePost', async (postId) => {
    try {
        // delete post from firestore
        const postRef = collection(db, 'posts').doc(postId);
        await postRef.delete();
        return postId;
    } catch (err) {
        console.log(err);
        alert(err);
    }
});

/** add new comment to a post */
export const addComment = createAsyncThunk('posts/addComment', async (comment) => {
    try {
        // add comment to firestore
        const commentsRef = collection(db, 'posts', comment.postId, 'comments');
        await commentsRef.add(comment);
        return comment;
    } catch (err) {
        console.log(err);
        alert(err);
    }
});

/** delete a comment */
export const deleteComment = createAsyncThunk(
    'posts/deleteComment',
    async (comment) => {
        try {
            // delete comment from firestore
            const commentRef = collection(db, 'posts', comment.postId, 'comments').doc(
                comment.id,
            );
            await commentRef.delete();
            return comment.id;
        } catch (err) {
            console.log(err);
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
            comments: false,
            likes: false,
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
            })

            // ============ fetch likes ============ //
            .addCase(fetchLikes.pending, (state) => {
                state.loading.likes = true;
            })
            .addCase(fetchLikes.fulfilled, (state, action) => {
                state.loading.likes = false;
                const { postId, likes } = action.payload;
                // find and add fetched likes to the post
                const index = state.allPosts.findIndex((post) => post.id === postId);
                if (index !== -1) {
                    state.allPosts[index].likes = likes;
                }
            })

            // ============ add like ============ //
            .addCase(addLike.fulfilled, (state, action) => {
                // add the new like to the post
                const index = state.allPosts.findIndex(
                    (post) => post.id === action.payload.postId,
                );
                if (index !== -1) {
                    state.allPosts[index].likes.push(action.payload);
                }
            })

            // ============ remove like ============ //
            .addCase(removeLike.fulfilled, (state, action) => {
                // remove the deleted like from the post
                const index = state.allPosts.findIndex(
                    (post) => post.id === action.payload.postId,
                );
                if (index !== -1) {
                    state.allPosts[index].likes = state.allPosts[index].likes.filter(
                        (like) => like.id !== action.payload.id,
                    );
                }
            })

            // ============ add a new post ============ //
            .addCase(addPost.fulfilled, (state, action) => {
                // add the new post to the state
                state.allPosts = [action.payload, ...state.allPosts];
            })

            // ============ delete a post ============ //
            .addCase(deletePost.fulfilled, (state, action) => {
                // remove the deleted post from the state
                state.allPosts = state.allPosts.filter(
                    (post) => post.id !== action.payload,
                );
            })

            // ============ add a new comment ============ //
            .addCase(addComment.fulfilled, (state, action) => {
                // add the new comment to the post
                const index = state.allPosts.findIndex(
                    (post) => post.id === action.payload.postId,
                );
                if (index !== -1) {
                    state.allPosts[index].comments.push(action.payload);
                }
            })

            // ============ delete a comment ============ //
            .addCase(deleteComment.fulfilled, (state, action) => {
                // remove the deleted comment from the post
                const index = state.allPosts.findIndex(
                    (post) => post.id === action.payload.postId,
                );
                if (index !== -1) {
                    state.allPosts[index].comments = state.allPosts[
                        index
                    ].comments.filter((comment) => comment.id !== action.payload.id);
                }
            });
    },
});

export default postsSlice.reducer;
