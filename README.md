<h1 align="center"> taskery 👥 </h1>

A task manager mobile app that brings together task management and social interaction, fuelling productivity through peer motivation and social accountability.

-   🛠️ Developed using React Native, managed by Expo.
-   🛠️ Authentication handled using Firebase, while Firestore is used for data storage.
-   🛠️ Redux Toolkit for state management.

## Features

-   **Task Management**: Easily create and manage your tasks, with additional options like categorization, supplementry notes, images, and subtasks if needed.

-   **Community**: Share completed tasks, achievments, and takeaways. Leave comments for fellow task conquerors.

-   **Personalisation**: Adapt the app to your own needs through a variety of sorting and filtering options.

-   **Productivity Sessions**: Elevate your focus with timer-based sessions and a range of background noise choices such as white noise and ambience sound.

## Getting Started

Open the link for your device to view the app.

-   For iOS: _-TBC-_
-   For Android: _-TBC-_

_Note: The Expo Go app has to be installed on your physical device or else the links above will not work._

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

5. The tests can be run using `npm run test`.

## Firestore security rules

To ensure data security, several security rules are in place within Cloud Firestore. Those rules can be found [here](src/services/firebase/rules.md).
