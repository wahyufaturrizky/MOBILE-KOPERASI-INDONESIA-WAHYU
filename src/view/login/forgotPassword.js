import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  SafeAreaView,
  ScrollView,
  View,
  StatusBar,
  Image,
} from 'react-native';

import logo from '../../assets/images/logo.png';

import { Styles, deviceHeight, deviceWidth } from '../../styles';
import { InputLogin } from '../../components/textInput';
import { Buttons } from '../../components/button';
import { Space } from '../../components/container';
import { LoadingOverlay } from '../../components/loading';
import { arkPost } from '../../config/api';
import { Nav } from '../../router/navigator';
import { resValid, reqOtpValid, nullChecker } from '../../config/validator';
import { snackBarError } from '../../components/snackBar';

function ForgotPass(props) {

  const [valueID, setValueID] = useState('');
  const [load, setLoad] = useState(false);

  // useEffect(() => {
  //   // alert('budi')
  // }, [])

  function goOtp(value) {
    Nav({ title: 'OTP Verification', page: 'ark.OTP', param: value, ID: props.componentId })
  }

  const doForgot = async () => {
    try {
      setLoad(true);
      let body = {
        username: valueID,
      }
      let res = await arkPost('forgot_password', body, 'member');
      if (res) {
        setLoad(false);
        if (resValid(res)) {
          let val = reqOtpValid(res, 'forgot_password');
          if (val !== false) {
            goOtp(val);
          }
        }
        // else {
        //    //bypass
        //    goOtp({id_otp_request: 'B56A34A0-1A95-11EA-8C0D-F1C599318B69', time_limit: '2'});
        // }
      }
    } catch (error) {
      setLoad(false);
      alert(JSON.stringify(error))
    }
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
                keyboardType={valueID.toString().substring(0, 1) === '0' || valueID.toString().substring(0, 1) === '6' ? 'phone-pad' : 'default'}
                placeholder={'ID Koperasi Or Phone Number'}
                onChangeText={val => setValueID(val)}
                value={valueID}
              />
            </View>
            <View style={{
              height: 100
            }} >
              <Buttons
                text={'Submit'}
                onClick={() => {
                  if (nullChecker({ valueID })) {
                    doForgot();
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

ForgotPass.propTypes = {
  navigator: PropTypes.object,
  componentId: PropTypes.string
}

export default ForgotPass;
