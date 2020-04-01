import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StatusBar,
  Image,
} from 'react-native';

import { arkPost, arkApi } from '../../config/api';

import { Nav, setRoot, setRootTabs } from '../../router/navigator';

import { Styles } from '../../styles';
import { Colors } from '../../styles/colors';
import { InputLogin } from '../../components/textInput';
import { Buttons } from '../../components/button';
import { Space } from '../../components/container';
import logo from '../../assets/images/logo.png'
import { LoadingOverlay } from '../../components/loading';
import { setStorage, getStorage, getFcmToken } from '../../config/storage';
import { snackBarError } from '../../components/snackBar';
import { nullChecker } from '../../config/validator';

function Login(props) {

  const [valueID, setValueID] = useState('');
  const [pass, setPass] = useState('');
  const [load, setLoad] = useState(false);

  // useEffect(async() => {
  //   // const data = await getStorage('userd');
  //   // alert(JSON.stringify(data))
  // }, [])

  function goSignUp() {
    Nav({ title: 'Sign Up', page: 'ark.Register', param: null, ID: props.componentId })
  }

  function goForgot() {
    Nav({ title: 'Forgot Password', page: 'ark.Forgot', param: null, ID: props.componentId })
  }

  function goLoginPhone() {
    Nav({ title: 'Login Dengan Nomor HP', page: 'ark.LoginPhone', param: null, ID: props.componentId })
  }

  function userValidation(data) {
    if (data.id_workflow_status === 'MBR-003') {
      setRoot({ title: 'Change Password', page: 'ark.ChangePass', param: null, ID: props.componentId })
    } else {
      setRootTabs({ ID: props.componentId })
    }
  }

  function valueVal(){
    let body = {
      username: valueID,
      password: pass
    }
    if(nullChecker(body)){
      doLogin(body)
    } else {
      snackBarError('Masukan ID Koperasi & Password Dengan Benar')
    }
  }

  const updateFCM = async () => {
    try {
      let token = await getFcmToken()
      let body = {
        type: 'ANDROID',
        token
      }
      console.log(body)
      let res = await arkApi({ metod: 'post', svc: 'member', url: 'updateFCM', param: null, body });
      if (!res) {
        console.log(res)
      } 
    } catch (error) {
      alert(JSON.stringify(error))
    }
  }

  const doLogin = async (body) => {
    try {
      setLoad(true);
      let login = await arkPost('login', body, 'member');
      if (login) {
        setLoad(false);
        if (login.Status === 200) {
          if (login.Data !== null) {
            // updateFCM();
            setStorage('auth', body);
            setStorage('user', login.Data.user_profile);
            setStorage('token', login.Data.token);
            setStorage('subscriptionID', login.Data.id_subscription);
            userValidation(login.Data.user_profile.user);
          }
        }
      }
    } catch (err) {
      console.log(err)
      setLoad(false);
      snackBarError(JSON.stringify(err))
    }
  }

  return (
    <Fragment>
      <LoadingOverlay loading={load} />
      <StatusBar barStyle="light-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="always" style={Styles.scrollView}>
          <Space size={100} />
          <View style={{
            flex: 1,
            alignItems: 'center'
          }}>
            <Image style={{
              width: 100,
              height: 100
            }} source={logo} />
          </View>
          <Space size={20} />
          <View style={{
            margin: 20
          }}>
            <InputLogin
              placeholder={'ID Koperasi'}
              onChangeText={val => setValueID(val)}
              value={valueID}
            />
            <InputLogin
              placeholder={'Password'}
              type={'password'}
              onChangeText={val => setPass(val)}
              value={pass}
            />
          </View>
          <View style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}>
            <View onTouchStart={() => {
              goForgot();
            }}>
              <Text>Forgot Password</Text>
            </View>
            <Space size={5} />
            <View>
              <Icon.Button name="ios-call"
                onPress={() => {
                  goLoginPhone();
                }} style={{
                  backgroundColor: Colors.light,
                }} solid iconStyle={{
                  color: Colors.primary
                }}>
                <Text style={{
                  color: 'black'
                }}>Login using phone number</Text>
              </Icon.Button>
            </View>
          </View>
          <Space size={20} />
          <Buttons text={'Sign In'} onClick={() => {
            valueVal()
          }} />
          <Buttons text={'Sign Up'} onClick={() => {
            goSignUp()
          }} />
          <Space size={20} />
        </ScrollView>
      </SafeAreaView>
    </Fragment>
  );
};

Login.propTypes = {
  navigator: PropTypes.object,
  componentId: PropTypes.string
}

export default Login;
