<h1 align="center"> taskery 👥 </h1>

A task manager mobile app that brings together task management and social interaction, fueling your productivity through peer motivation and social accountability.

- 🛠️ Developed using **React Native**, managed by **Expo**.
- 🛠️ Authentication handled using **Firebase**, while **Firestore** is used for data storage.
- 🛠️ **Redux Toolkit** for state management.

## Features

- **Task Management**: Easily create and manage your tasks, with additional options like categorization, supplementry notes, images, and subtasks if needed.

- **Community**: Share completed tasks, achievments, and takeaways. Leave words of encouragement for fellow task conquerors.

- **Personalisation**: Adapt the app to your own needs through a multitude of sorting and filtering options.

- **Productivity Sessions**: Elevate your focus with timer-based sessions and a range of background noise choices such as white noise and ambience sound.

## Getting Started

Open the link for your device to view the app.

- For iOS: *-TBC-*
- For Android: *-TBC-*

*Note: The Expo Go app has to be installed on your physical device or else the links above will not work.*

### Login

To login to the app, you can create an account through the "Register" screen, or use the following credentials:

```
Email: user@demo.com
Password: password
```

## To run locally

1. Clone the repository.

2. Install dependencies with `npm install`.

3. Run the app with `npx expo start`.

4. Scan the QR code generated to view the app (ensure ExpoGo app is downloaded).

## Firestore security rules

Below are the Cloud Firestore security rules that are in place to ensure data security.

```JSON
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
