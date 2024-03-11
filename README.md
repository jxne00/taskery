<h1 align="center"> Taskery </h1>

A task manager mobile application that optimises productivity by integrating task management with a blog-like community timeline.

## Getting Started

Open the link below or scan the QR code for your device to view the app on Expo Go.

-   Link: exp://u.expo.dev/update/ad31da8d-0309-4e97-b8bf-c76281635fef

<img src="https://github.com/jxne00/taskery/blob/master/src/assets/demos/qrlinks.png" alt="QR Code for opening the app on Expo Go" width="800">

## Demo

### Task management

<img src="https://github.com/jxne00/taskery/blob/master/src/assets/demos/home.png" alt="Screenshots of homescreen" width="800">

<img src="https://github.com/jxne00/taskery/blob/master/src/assets/demos/home2.png" alt="Screenshots of homescreen(2)" width="800">

### Community timeline

<img src="https://github.com/jxne00/taskery/blob/master/src/assets/demos/community.png" alt="Screenshots of community components" width="800">

### Profile

<img src="https://github.com/jxne00/taskery/blob/master/src/assets/demos/profile.png" alt="Screenshots of profile components" width="800">

## To run locally

1. Clone this repo: `git clone https://github.com/jxne00/taskery.git`.

2. Install dependencies: `npm install`.

3. Run the app: `npx expo start`.

4. Scan the QR code generated to view the app (ensure Expo Go app is downloaded).

5. Tests can be executed using `npm run test`.

## Firestore security rules

To ensure data security, several security rules are in place within Cloud Firestore and Firebase Storage. Those rules can be found [here](src/services/firebase/rules.md).
