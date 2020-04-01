import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  SafeAreaView,
  ScrollView,
  View,
  StatusBar,
  Image
} from 'react-native';

import { Styles, deviceHeight, deviceWidth } from '../../styles';
import { InputLogin } from '../../components/textInput';
import { Buttons } from '../../components/button';
import { Space } from '../../components/container';
import logo from '../../assets/images/logo.png';
import { LoadingOverlay } from '../../components/loading';
import { arkPost, arkPostAuth, arkApi } from '../../config/api';
import { Nav } from '../../router/navigator';
import { resValid, reqOtpValid, nullChecker } from '../../config/validator';
import { snackBarError } from '../../components/snackBar';
import { getStorage } from '../../config/storage';

function LoginPhone(props) {

  const [phone, setPhone] = useState('');
  const [load, setLoad] = useState(false);

  // useEffect(() => {
  //   // alert('budi')
  // }, [])

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
        Nav({ title: 'Change Phone Number', page: 'ark.OTP', param: { phone: phone.toString(), flag: 'changePhone' }, ID: props.componentId })
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

  const signInPhone = async () => {
    try {
      setLoad(true);
      let body = {
        phone: phone.toString()
      }
      let res = await arkApi({ metod: 'post', svc: 'member', url: 'generateOtpRegister', param: null, body });
      if (res) {
        setLoad(false);
        Nav({ title: 'Sign In By Phone Number', page: 'ark.OTP', param: { phone: phone.toString(), flag: 'login' }, ID: props.componentId })
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

  function goOtp(value) {
    Nav({ title: 'Login Verification', page: 'ark.OTP', param: value, ID: props.componentId })
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
              width: deviceWidth - 30
            }}>
              <Space size={70} />
              <InputLogin
                keyboardType={'phone-pad'}
                placeholder={'Phone Number'}
                onChangeText={val => setPhone(val)}
                value={phone}
              />
            </View>
            <View style={{
              height: 100
            }} >
              <Buttons
                text={props.flag === 'change-phone' ? 'Change Phone Number' : 'Sign In'}
                onClick={() => {
                  if (nullChecker({ phone })) {
                    if (props.flag === 'change-phone') {
                      goOTP();
                    } else {
                      signInPhone();
                    }
                  } else {
                    snackBarError('isi data dengan benar')
                  }
                }}
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Fragment>
  );
};

LoginPhone.propTypes = {
  navigator: PropTypes.object,
  componentId: PropTypes.string
}

export default LoginPhone;
