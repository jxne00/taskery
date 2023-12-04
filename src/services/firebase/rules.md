Cloud Firestore rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // users collection
    match /users/{userId} {
        allow read, update: if request.auth.uid == userId;
        allow create: if request.auth.uid != null;

        // tasks subcollection
    	match /tasks/{taskId} {
             // users can read & write (create, update, delete) own task
            allow read, write: if request.auth.uid == userId;
        }

        // category subcollection
    	match /categories/{categoryId} {
             // users can read and write own task categories
            allow read, write: if request.auth.uid == userId;
        }
    }
    // posts collection
    match /posts/{postId} {
        // users can read all public posts
        allow read: if resource.data.is_public == true;

        // users can write (create, update, delete) own post
        allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;

        // comments subcollection
        match /comments/{commentId} {
            // users can read and create comments
            allow read, create: if request.auth != null;

            // users can only update and delete own comments
            allow update, delete: if request.auth != null && request.auth.uid == resource.data.userId;
        }
    }
  }
}
```

Firebase Storage rules:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
  // allow public read
  match /avatars/{avatar} {
      allow read;
      allow write: if request.auth != null;
    }

    match /usersAvatar/{userId} {
      // users can read and write own avatar
      allow read, write: if request.auth != null && request.auth.uid == userId;

      // authenticated users can read avatars
      allow read: if request.auth != null;
    }
  }
}
```
