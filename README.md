<h1 align="center"> Taskery </h1>

A task manager mobile application that optimises productivity by integrating task management with a blog-like community timeline.

## Getting Started

Open the link below or scan the QR code for your device to view the app on Expo Go.

-   Link: exp://u.expo.dev/update/f74b5490-daf6-4792-a19d-046d7a122486

<p align="center">
  <img src="https://github.com/jxne00/taskery/tree/master/src/assets/qrlinks.png" alt="QR Code for opening the app on Expo Go" width="600">
</p>

## To run locally

1. Clone this repo: `git clone https://github.com/jxne00/taskery.git`.

2. Install dependencies: `npm install`.

3. Run the app: `npx expo start`.

4. Scan the QR code generated to view the app (ensure Expo Go app is downloaded).

5. Tests can be executed using `npm run test`.

## Firestore security rules

To ensure data security, several security rules are in place within Cloud Firestore and Firebase Storage. Those rules can be found [here](src/services/firebase/rules.md).
