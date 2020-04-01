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
import { resValid, reqOtpValid } from '../../config/validator';
import { snackBarError } from '../../components/snackBar';
import { getStorage } from '../../config/storage';

function ChangeEmail(props) {

  const [email, setEmail] = useState('');
  const [load, setLoad] = useState(false);

  // useEffect(() => {
  //   // alert('budi')
  // }, [])

  const updateEmail = async () => {
    try {
      setLoad(true);
      const data = await getStorage('user');
      let body = {
        email: email
      }
      let res = await arkApi({ metod: 'put', svc: 'member', url: 'changeEmail', param: data.id_user_profile, body });
      if (res) {
        setLoad(false);
        Nav({ title: 'Update Email Information', page: 'ark.ProfileInformation', param: null, ID: props.componentId })
      } else {
        setLoad(false);
      }
    } catch (error) {
      alert(JSON.stringify(error))
      setLoad(false);
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
                placeholder={'New Email Address'}
                onChangeText={val => setEmail(val)}
                value={email}
              />
            </View>
            <View style={{
              height: 100
            }} >
              <Buttons
                text={'Submit'}
                onClick={() => {
                  updateEmail()
                }}
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Fragment>
  );
};

ChangeEmail.propTypes = {
  navigator: PropTypes.object,
  componentId: PropTypes.string
}

export default ChangeEmail;
