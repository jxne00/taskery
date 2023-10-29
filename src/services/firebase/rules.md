Cloud Firestore rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // users collection
    match /users/{userId} {
      allow read, update: if request.auth.uid == userId;
      allow create: if request.auth.uid != null;

      // users can read & write (create, update, delete) own tasks
      match /tasks/{taskId} {
        allow read, write: if request.auth.uid == userId;
      }

      // users can read and write own task categories
      match /categories/{categoryId} {
        allow read, write: if request.auth.uid == userId;
      }

      // users can read and write own task tags
      match /tags/{tagId} {
        allow read, write: if request.auth.uid == userId;
      } 
    }

    // posts collection
    match /posts/{postId} {
      // users can read posts where owner's "is_public" is true
      // users can read their own posts
      allow read: if get(/databases/$(database)/documents/users/$(resource.data.userId)).data.is_public == true || request.auth.uid == resource.data.userId;
      
      // users can write (create, update, delete) own post
      allow write: if request.auth.uid == resource.data.userId;

      match /comments/{commentId} {
        // all authenticated users can read and create comment on a post
        allow read, create: if request.auth.uid != null;

        // users can update or delete their own comment
        // users can delete any comment on their own posts
        allow update, delete: if request.auth.uid == resource.data.userId || request.auth.uid == get(/databases/$(database)/documents/posts/$(postId)).data.userId;
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
