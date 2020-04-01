import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  View,
} from 'react-native';

import { deviceHeight } from '../../styles';
import { Colors } from '../../styles/colors';
import { getStorage, clearStorage, setStorage } from '../../config/storage';
import { setRoot, setRootTabs } from '../../router/navigator';

import SplashScreen from 'react-native-splash-screen'
import { arkApi } from '../../config/api';

function Splash(props) {

  useEffect(() => {
    SplashScreen.hide()
    checkUser();
  }, [])

  function getAds(data) {
    let topAds = [];
    let bottomAds = [];
    for (let i in data) {
      if (data[i].position) {
        if (data[i].images.length > 0) {
          if (data[i].position === 'UP') {
            for (let j in data[i].images) {
              topAds.push({
                image: { uri: data[i].images[j] },
                title: data[i].alias
              })
            }
          } else {
            for (let j in data[i].images) {
              bottomAds.push({
                image: { uri: data[i].images[j] },
                title: data[i].alias
              })
            }
          }
        }
      }
    }
    setStorage('topAds', topAds);
    setStorage('bottomAds', bottomAds);
    setRootTabs({ ID: props.componentId });
  }

  const checkValidToken = async () => {
    try {
      let res = await arkApi({ metod: 'get', svc: 'product', url: 'ads', param: null, body: null });
      if (res) {
        getAds(res)
      }
    } catch (err) {
      console.log(err)
    }
  }

  checkUser = async () => {
    const data = await getStorage('user');
    if (data) {
      if (data.user) {
        userValidation(data.user)
      }
    } else {
      logOut();
    }
  }

  function logOut() {
    clearStorage();
    setRoot({ title: 'Login', page: 'ark.Intro', param: null, ID: props.componentId })
  }


  function userValidation(data) {
    if (data.id_workflow_status == 'MBR-003') {
      logOut();
    } else {
      checkValidToken()
    }
  }

  return (
    <View style={{
      flex: 1,
      height: deviceHeight,
      backgroundColor: Colors.primary
    }}
    />
  );
};

Splash.propTypes = {
  navigator: PropTypes.object,
  componentId: PropTypes.string
}

export default Splash;