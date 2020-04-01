import React, { useEffect } from 'react';
import { AsyncStorage, View } from 'react-native';
import firebase from 'react-native-firebase';

export const MainFirebase = (props) => {

  useEffect(() => {
    checkPermission()
  }, [])

  //1
  const checkPermission = async () => {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      getToken();
    } else {
      requestPermission();
    }
  }

  //3
  const getToken = async () => {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    if (!fcmToken) {
      fcmToken = await firebase.messaging().getToken();
      alert('Token Firebase Hp Ini => ' + JSON.stringify(fcmToken))
      if (fcmToken) {
        // user has a device token
        await AsyncStorage.setItem('fcmToken', fcmToken);
      } else {
      }
    } else {
      alert('Token Firebase Hp Ini => ' + JSON.stringify(fcmToken))
    }
  }

  //2
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

  return (
    <View />
  );
};