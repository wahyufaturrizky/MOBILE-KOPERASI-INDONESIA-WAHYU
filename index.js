import { AsyncStorage } from 'react-native'
import { Navigation } from "react-native-navigation";
import { registerScreens } from './src/router/register';
import firebase from 'react-native-firebase';

const firebasePermission = async () => {
  const enabled = await firebase.messaging().hasPermission();
  if (enabled) {
    getToken();
  } else {
    requestPermission();
  }
}

const getToken = async () => {
  let fcmToken = await AsyncStorage.getItem('fcmToken');
  console.log('Token Firebase Hp Ini => ' + JSON.stringify(fcmToken))
  console.log(fcmToken)
  if (!fcmToken) {
    fcmToken = await firebase.messaging().getToken();
    console.log('Token Firebase Hp Ini => ' + JSON.stringify(fcmToken))
    if (fcmToken) {
      // user has a device token
      await AsyncStorage.setItem('fcmToken', fcmToken);
    }
  }
}

const requestPermission = async () => {
  try {
    await firebase.messaging().requestPermission();
    // User has authorised
    getToken();
  } catch (error) {
    // User has rejected permissions
    console.log('permission rejected');
  }
}

const createNotificationListeners = async () => {
  firebase.notifications().onNotification(notification => {
    notification.android.setChannelId('insider').setSound('default')
    firebase.notifications().displayNotification(notification)
  });
}

const firebaseStart = () => {
  const channel = new firebase.notifications.Android.Channel('insider', 'insider channel', firebase.notifications.Android.Importance.Max)
  firebase.notifications().android.createChannel(channel);
  createNotificationListeners();
  firebasePermission();
}

registerScreens();
firebaseStart();

Navigation.events().registerAppLaunchedListener(() => {
  Navigation.setRoot({
    root: {
      stack: {
        children: [
          {
            component: {
              name: 'ark.Splash',
              options: {
                topBar: {
                  visible: false
                }
              }
            }
          }
        ],
      }
    }
  });
});