import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ImagePicker from 'react-native-image-picker';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StatusBar,
  Image,
  Picker
} from 'react-native';

import { Styles } from '../../styles';
import { textStyles } from '../../styles/text';
import { Colors } from '../../styles/colors';
import { InputLogin, InputImage } from '../../components/textInput';
import { MenuAccount } from '../../components/button';
import { Space } from '../../components/container';
import logo from '../../assets/images/initial-profile.png'
import { arkFormPost, arkApi } from '../../config/api';
import { Nav, setRoot } from '../../router/navigator';
import { LoadingOverlay } from '../../components/loading';
import { snackBarSuccessOK, snackBarError } from '../../components/snackBar';
import { resValid, reqOtpValid } from '../../config/validator';
import { clearStorage, getStorage, setStorage } from '../../config/storage';
import { refreshToken } from '../../config/refreshToken';

function Account(props) {

  const [load, setLoad] = useState(false);
  const [data, setData] = useState(false);

  useEffect(() => {
    saveComponent();
    newRefresh();
  }, [])

  const newRefresh = async () => {
    try {
      setLoad(true);
      const data = await refreshToken();
      const payload = data.user.profile;
      if (payload) {
        setLoad(false);
        setData(payload)
      }
    } catch (error) {
      setLoad(false)
      console.log(error)
      snackBarError(JSON.stringify(error))
    }
  }

  const saveComponent = () => {
    setStorage('idSettings', props.componentId);
  }

  function pushPage(title, page) {
    Nav({ title: title, page, param: null, ID: props.componentId })
  }

  const refresh = async () => {
    try {
      setLoad(true);
      const data = await refreshToken();
      if (data) {
        setLoad(false);
      }
    } catch (error) {
      setLoad(false)
      console.log(error)
      snackBarError(JSON.stringify(error))
    }
  }

  function logOut() {
    clearStorage();
    setRoot({ title: 'Login', page: 'ark.Login', param: null, ID: props.componentId })
  }


  return (
    <Fragment>
      <LoadingOverlay loading={load} />
      <StatusBar barStyle="light-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="always" style={Styles.scrollView}>
          <Space size={20} />
          <MenuAccount
            icon={'ios-call'}
            title={'Nomer Ponsel'}
            text={data ? data.phone_number : 'Loading'}
            subText={'Nomer Ponsel Sudah Terverifikasi'}
            rightText={'Ubah'}
            onClick={() => {
              Nav({ title: 'Change Phone Number', page: 'ark.LoginPhone', param: { flag: 'change-phone' }, ID: props.componentId })
            }} />
          <MenuAccount
            icon={'ios-mail'}
            title={'Alamat Email'}
            text={data ? data.email : 'Loading'}
            subText={'Email Anda Sudah Terverifikasi'}
            rightText={'Ubah'}
            onClick={() => {
              pushPage('Change Email Address', 'ark.ChangeEmail')
            }} />
          <MenuAccount
            icon={'ios-key'}
            title={'Password'}
            text={null}
            subText={'Ganti Password Akun Anda'}
            rightText={'Ubah'}
            onClick={() => {
              pushPage('Change Password', 'ark.ChangePass')
            }} />
          <MenuAccount
            icon={'ios-link'}
            title={'Hubungkan Akun'}
            text={null}
            subText={'Hubungkan akun anda dengan LinkAja, Gopay, OVO'}
            rightText={null}
            onClick={() => {
              snackBarSuccessOK('Menu Under Construction')
            }} />
          <MenuAccount
            icon={'ios-trash'}
            title={'Pengaturan Sistem'}
            text={'Clear Cache'}
            subText={'Bersihkan Data Yang Tidak Perlu'}
            rightText={null}
            onClick={() => {
              snackBarSuccessOK('Berhasil Membersihkan Cache')
            }} />
          <Space size={40} />
        </ScrollView>
      </SafeAreaView>
    </Fragment>
  );
};

Account.propTypes = {
  navigator: PropTypes.object,
  componentId: PropTypes.string
}

export default Account;
