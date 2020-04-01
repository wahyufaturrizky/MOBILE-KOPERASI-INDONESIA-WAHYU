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
import { Buttons } from '../../components/button';
import { Space } from '../../components/container';
import logo from '../../assets/images/initial-profile.png'
import { arkFormPost, arkApi } from '../../config/api';
import { Nav, setRoot } from '../../router/navigator';
import { LoadingOverlay } from '../../components/loading';
import { snackBarSuccessOK, snackBarError } from '../../components/snackBar';
import { resValid, reqOtpValid } from '../../config/validator';
import { clearStorage, getStorage, setStorage } from '../../config/storage';
import { refreshToken } from '../../config/refreshToken';

function Settings(props) {

  const [load, setLoad] = useState(false);
  const [photo, setPhoto] = useState(false);

  const options = {
    title: 'Select Avatar',
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
  };

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
        getData(payload)
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

  const getData = async (data) => {
    try {
      setPhoto({uri: data.photo});
    } catch (error) {
      console.log(error)
      snackBarError(JSON.stringify(error))
    }
  }

  function pushPage(title, page) {
    Nav({ title: title, page, param: null, ID: props.componentId })
  }

  const changeData = async (file) => {
    try {
      setLoad(true);
      let formData = new FormData();
      formData.append('photo', file);
      let res = await arkApi({ metod: 'post', svc: 'member', url: 'updateProfile', param: null, body: formData });
      if (res) {
        setLoad(false);
        refresh();
      } else {
        setLoad(false);
      }
    } catch (err) {
      console.log(err)
      setLoad(false);
    }
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

  function photoPicker() {
    ImagePicker.launchCamera(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = { uri: response.uri, name: response.fileName, type: response.type };

        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };
        setPhoto(source);
        changeData(source)
      }
    });
  }

  return (
    <Fragment>
      <LoadingOverlay loading={load} />
      <StatusBar barStyle="light-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="always" style={Styles.scrollView}>
          <Space size={40} />
          <View style={{
            flex: 1,
            alignItems: 'center'
          }} onTouchStart={() => {
            photoPicker();
          }}>
            <Image style={{
              width: 150,
              height: 150,
              backgroundColor: Colors.light,
              borderRadius: 20,
              borderColor: Colors.grey,
              borderWidth: 2
            }}
              source={photo.uri ? { uri: photo.uri } : logo}
            />
            <Text style={textStyles.h1}> Change Photo </Text>
          </View>
          <Space size={20} />
          <Buttons text={'My Profile'} menu onClick={() => {
            pushPage('My Profile', 'ark.DetailProfile')
          }} />
          <Buttons text={'Phone Number'} menu subText={'Edit'} onClick={() => {
            Nav({ title: 'Change Phone Number', page: 'ark.LoginPhone', param: { flag: 'change-phone' }, ID: props.componentId })
          }} />
          <Buttons text={'Email Addres'} menu subText={'Edit'} onClick={() => {
            pushPage('Change Email Address', 'ark.ChangeEmail')
          }} />
          <View style={{
            marginLeft: 40
          }}>
            <Text style={{
              fontWeight: 'bold'
            }}>
              Terverifikasi
            </Text>
          </View>
          <Buttons text={'Password'} menu subText={'Change'} onClick={() => {
            pushPage('Change Password', 'ark.ChangePass')
          }} />
          <Buttons text={'Address'} menu subText={'edit'} onClick={() => {
            pushPage('Address', 'ark.Address')
          }} />
          <Buttons text={'Staffing And Sallary'} menu onClick={() => {
            pushPage('Staffing and Salary Data', 'ark.Employe')
          }} />
          <View style={{
            marginLeft: 40
          }}>
            <Text style={{
              fontWeight: 'bold'
            }}>
              Terverifikasi
            </Text>
          </View>
          <Buttons text={'Bank Information'} menu onClick={() => {
            pushPage('Bank Information', 'ark.Bank')
          }} />
          <Buttons text={'Document Management'} menu onClick={() => {
            pushPage('Document Management', 'ark.Documents')
          }} />
          <Buttons text={'Sync Account'} menu />
          <Buttons text={'System Settings'} menu onClick={() => {
            pushPage('System Settings', 'ark.System')
          }} />
          <Buttons text={'Log Out'} danger menu onClick={() => {
            logOut();
          }} />
          <Space size={40} />
        </ScrollView>
      </SafeAreaView>
    </Fragment>
  );
};

Settings.propTypes = {
  navigator: PropTypes.object,
  componentId: PropTypes.string
}

export default Settings;
