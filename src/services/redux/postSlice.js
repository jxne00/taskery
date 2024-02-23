import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '../firebase';
import {
    collection,
    getDocs,
    query,
    where,
    orderBy,
    doc,
    getDoc,
    updateDoc,
} from 'firebase/firestore';
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

        // fetch comments for each post
        for (const post of posts) {
            const commentsRef = collection(db, 'posts', post.id, 'comments');
            const commentsSnapshot = await getDocs(commentsRef);
            const comments = [];

            commentsSnapshot.forEach((doc) => {
                const data = doc.data();
                // convert firestore timestamp to milliseconds
                data.time_created = data.time_created.toMillis();

                comments.push({ ...data, id: doc.id });
            });

            post.comments = comments;
        }

        return posts;
    } catch (err) {
        console.log(err);
        alert(err);
    }
});

/** fetch all posts by a user */
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

                posts.push({ ...data, id: doc.id });
            });

            // fetch comments for each post
            for (const post of posts) {
                const commentsRef = collection(db, 'posts', post.id, 'comments');
                const commentsSnapshot = await getDocs(commentsRef);
                const comments = [];

                commentsSnapshot.forEach((doc) => {
                    const data = doc.data();
                    // convert firestore timestamp to milliseconds
                    data.time_created = data.time_created.toMillis();

                    comments.push({ ...data, id: doc.id });
                });

                post.comments = comments;
            }

            return posts;
        } catch (err) {
            console.log(err);
            alert(err);
        }
    },
);

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

/** toggle like */
export const toggleLike = createAsyncThunk(
    'posts/toggleLike',
    async ({ postId, userId }) => {
        try {
            const postRef = doc(db, 'posts', postId);
            const snapshot = await getDoc(postRef);

            if (!snapshot.exists()) {
                throw new Error('Post does not exist.');
            }

            const postData = snapshot.data();
            let likes = postData.likes || [];

            // check if user already liked post
            const index = likes.indexOf(userId);

            if (index !== -1) {
                // remove if already liked
                likes.splice(index, 1);
            } else {
                // add if not liked
                likes.push(userId);
            }

            // update firestore with new like list
            await updateDoc(postRef, { likes });

            return { postId, likes };
        } catch (err) {
            console.log('(posts/toggleLike)', err);
            alert(err);
        }
    },
);

/** delete a post */
export const deletePost = createAsyncThunk('posts/deletePost', async (postId) => {
    try {
        // delete post from firestore
        await db.collection('posts').doc(postId).delete();
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

            // ============ add a new post ============ //
            .addCase(addPost.fulfilled, (state, action) => {
                // add the new post to the state
                state.allPosts = [action.payload, ...state.allPosts];
            })

            // ============ delete a post ============ //
            .addCase(deletePost.pending, (state) => {
                state.loading.allPosts = true;
            })
            .addCase(deletePost.fulfilled, (state, action) => {
                state.loading.allPosts = false;
                // remove the deleted post from the state
                state.allPosts = state.allPosts.filter(
                    (post) => post.id !== action.payload,
                );
            })

            // ============ toggle like ============ //
            .addCase(toggleLike.pending, (state) => {
                state.loading.likes = true;
            })
            .addCase(toggleLike.fulfilled, (state, action) => {
                state.loading.likes = false;
                // update the likes of the post
                const index = state.allPosts.findIndex(
                    (post) => post.id === action.payload.postId,
                );
                if (index !== -1) {
                    state.allPosts[index].likes = action.payload.likes;
                }
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
