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
        allow read, write: if resource.data.is_public == true;

        // users can write (create, update, delete) own post
        allow read, write: if request.auth.uid == resource.data.userId;

        allow create: if request.auth.uid != null;

        // comments subcollection
        match /comments/{commentId} {
						// users can read & write (create, update, delete) comments
            allow read, write: if request.auth != null;
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
