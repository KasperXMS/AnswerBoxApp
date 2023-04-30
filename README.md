### Question-Answer Box App

##### Dependencies

should be installed via npm by `npm install (name)`

```
@rneui/themed
@react-navigation/bottom-tabs
@react-navigation/native-stack
@react-native-clipboard
react-native-vector-icons
```

##### Compile and run

firstly make sure you have correctly configured React Natice environment (installation, Android Studio environment variable, cocoapods). If not, refer to React Native development documents: https://reactnative.dev/docs/environment-setup?guide=native

If you have **yarn** installed, run the following at the project directory:

```
yarn android
```

to compile Android apk, and will call your Android simulator to run the app.

For iOS, run:

```
yarn ios
```



If not, firstly start **Metro** service by executing this command under your project root:

```
npx react-native start
```

Then to compile and run on Android:

```
npx react-native run-android
```

for iOS:

```
npx react-native run-ios
```



If success, the app is run on the simulator.