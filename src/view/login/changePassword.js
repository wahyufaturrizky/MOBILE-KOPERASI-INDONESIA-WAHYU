import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { PasswordMeter } from 'password-meter';
import Icon from 'react-native-vector-icons/Ionicons';
import { Text as Rtext } from 'react-native-elements'
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TextInput,
  Image,
  Button,
  TouchableHighlight
} from 'react-native';

import { Styles, deviceHeight, deviceWidth } from '../../styles';
import { Colors } from '../../styles/colors';
import { InputLogin } from '../../components/textInput';
import { Buttons } from '../../components/button';
import { Space } from '../../components/container';

import logo from '../../assets/images/logo.png';
import { snackBarWarning, snackBarError } from '../../components/snackBar';
import { LoadingOverlay } from '../../components/loading';
import { arkPostAuth, arkApi } from '../../config/api';
import { resValid } from '../../config/validator';
import { Nav } from '../../router/navigator';
import { clearStorage, getStorage, setStorage } from '../../config/storage';

function ChangePass(props) {

  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [pActive, setpActive] = useState(false);
  const [meter, setMeter] = useState(0);

  const [load, setLoad] = useState(false);

  const progressLayout = deviceWidth - 60;

  function alertNewMember() {
    setTimeout(() => {
      snackBarWarning('Selamat Datang Member Baru, Silakan isi password baru anda disini')
    }, 2000);
  }

  // function goInformation() {
  //   clearStorage();
  //   Nav({ title: 'Success Change Password', page: 'ark.Information', param: { information: 'Thank You, Password has been changed ' }, ID: props.componentId })
  // }

  useEffect(() => {
    alertNewMember();
  }, [])

  const goOTP = async () => {
    try {
      setLoad(true);
      const data = await getStorage('user');
      let body = {
        phone: data.phone_number
      }
      let res = await arkApi({ metod: 'post', svc: 'member', url: 'generateOtpRegister', param: null, body });
      if (res) {
        setLoad(false);
        Nav({ title: 'OTP Verification', page: 'ark.OTP', param: { phone: data.phone_number, flag: 'changePassword' }, ID: props.componentId })
      } else {
        setLoad(false);
        // Nav({ title: 'OTP Verification', page: 'ark.OTP', param: props.payload, ID: props.componentId })
      }
    } catch (err) {
      console.log(err)
      setLoad(false);
      alert(JSON.stringify(err))
    }
  }

  const doChangePass = async () => {
    try {

      if (newPass === confirmPass) {
        let body = {
          old_password: oldPass,
          new_password: newPass
        }
        setStorage('changePassword', body);
        goOTP();
        // setLoad(true);
        // let body = {
        //   old_password: oldPass,
        //   new_password: newPass
        // }
        // let token = await getStorage('token');
        // let res = await arkApi({ metod: 'post', svc: 'member', url: 'changePassword', param: token, body });
        // if (res) {
        //   setLoad(false);
        // }
      } else {
        snackBarError('password not math')
      }
    } catch (error) {
      setLoad(false);
      console.log(error)
      alert(JSON.stringify(error));
    }
  }

  function passwordMeter(pass) {
    return new PasswordMeter({}, {
      "40": "E",  // 001 <= x <  040
      "80": "D",  // 040 <= x <  080
      "120": "C", // 080 <= x <  120
      "180": "B", // 120 <= x <  180
      "200": "A", // 180 <= x <  200
      "_": "A+"   //        x >= 200
    }).getResult(pass)
  }

  return (
    <Fragment>
      <LoadingOverlay loading={load} />
      <StatusBar barStyle="light-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="always" style={Styles.scrollView}>
          <View style={{
            height: deviceHeight - 120,
            flex: 1,
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: 'column'
          }}>
            <View style={{
              width: deviceWidth - 30,
            }}>
              <Space size={20} />
              <View style={{
                alignItems: 'center'
              }}>
                <Space size={50} />
                <Image style={{
                  width: 100,
                  height: 100
                }} source={logo} />
                <Space size={50} />
              </View>
              <Space size={20} />
              <InputLogin
                placeholder={'Old Password'}
                onChangeText={val => setOldPass(val)}
                value={oldPass}
              />
              {pActive && newPass.length >= 1 ? (
                <View style={{
                  height: 10,
                  marginLeft: 15,
                  marginRight: 15,
                  marginTop: 10,
                  width: progressLayout
                }}
                >
                  <View style={{
                    backgroundColor: meter <= 20 ? 'red' : meter <= 50 ? 'orange' : meter <= 70 ? 'yellow' : 'green',
                    borderRadius: 10,
                    height: 10,
                    width: progressLayout * meter / 100
                  }} />
                  <Text style={{
                    color: meter <= 20 ? 'red' : meter <= 50 ? 'orange' : meter <= 70 ? 'grey' : 'black',
                    position: 'absolute',
                    right: 10,
                    fontSize: 18,
                    fontWeight: 'bold'
                  }}>
                    {meter <= 20 ? 'Very Weak' : meter <= 50 ? 'Weak' : meter <= 70 ? 'Normal' : 'Strong'}
                  </Text>
                </View>
              ) : (
                  <View />
                )}
              <InputLogin
                type={'password'}
                placeholder={'New Password'}
                onChangeText={val => {
                  setNewPass(val);
                  setMeter(passwordMeter(val).percent);
                }}
                value={newPass}
                onFocus={() => {
                  setpActive(true)
                }}
                onBlur={() => {
                  setpActive(false)
                }}
              />
              <InputLogin
                type={'password'}
                placeholder={'Confirm Password'}
                onChangeText={val => setConfirmPass(val)}
                value={confirmPass}
              />
            </View>
            <View style={{
              height: 100
            }} >
              <Buttons
                text={'Submit'}
                onClick={() => {
                  doChangePass();
                }}
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Fragment>
  );
};

ChangePass.propTypes = {
  navigator: PropTypes.object,
  componentId: PropTypes.string
}

export default ChangePass;
