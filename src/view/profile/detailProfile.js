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
  Picker,
  TextInput,
  DatePickerAndroid
} from 'react-native';

import moment from 'moment'

import { Styles } from '../../styles';
import { textStyles } from '../../styles/text';
import { Colors } from '../../styles/colors';
import { InputLogin, InputImage } from '../../components/textInput';
import { Buttons } from '../../components/button';
import { Space } from '../../components/container';
import logo from '../../assets/images/initial-profile.png'
import { arkFormPost, arkApi } from '../../config/api';
import { Nav } from '../../router/navigator';
import { LoadingOverlay } from '../../components/loading';
import { snackBarSuccessOK, snackBarError } from '../../components/snackBar';
import { resValid, reqOtpValid } from '../../config/validator';
import { getStorage, setStorage } from '../../config/storage';
import { inputStyles } from '../../styles/input';
import { refreshToken } from '../../config/refreshToken';
import { Navigation } from 'react-native-navigation';

function DetailProfile(props) {

  const [name, setName] = useState('');
  const [dateBirth, setDateBirth] = useState('');
  const [placeBirth, setPlaceBirth] = useState('');
  const [gender, setGender] = useState(0);
  const [religion, setReligion] = useState('');
  const [maritial, setMaritial] = useState('');
  const [mother, setMother] = useState('');
  const [npwp, setNpwp] = useState('');

  const listGender = [
    {
      "id_gender": "GN-001",
      "name_gender": "MALE"
    },
    {
      "id_gender": "GN-002",
      "name_gender": "FEMALE"
    }
  ]

  const listReligion = [
    {
      "id_religion": "RG-001",
      "name_religion": "ISLAM"
    },
    {
      "id_religion": "RG-002",
      "name_religion": "HINDU"
    }
  ]

  const listMarital = [
    {
      id: '0',
      name: 'Jomblo'
    },    
    {
      id: '1',
      name: 'Menikah'
    },    
    {
      id: '2',
      name: 'Cerai'
    },    
  ]

  const [load, setLoad] = useState(false);

  const changeData = async () => {
    try {
      setLoad(true);
      let body = {
        name: name,
        npwp: npwp,
        mother_name: mother,
        id_gender: gender,
        id_religion: religion,
        birth_place: placeBirth,
        birth_date: dateBirth,
        marital_status: maritial,
        account_bank: 'string',
        name_bank: 'string'

      }
      let res = await arkApi({ metod: 'post', svc: 'member', url: 'updateProfile', param: null, body });
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

  const checkAll = async (num) => {
    try {
      let full = await arkApi({ metod: 'get', svc: 'loan', url: 'checkFulFillment', param: null, body: null });

      let newFull = [];
      let fullKey = Object.keys(full);
      for (let i in fullKey) {
        if (full[fullKey[i]].length === 0) {
          newFull.push(fullKey[i])
        }
      }
      setStorage('requireProfile', newFull)
    } catch (err) {
      alert(JSON.stringify(err));
      setLoad(false);
    }
  }

  const refresh = async () => {
    try {
      setLoad(true);
      const data = await refreshToken();
      const payload = data.user.profile;
      if (payload) {
        getData();
        setLoad(false);
        Navigation.pop(props.componentId)
      }
    } catch (error) {
      setLoad(false)
      console.log(error)
      snackBarError(JSON.stringify(error))
    }
  }

  useEffect(() => {
    getData()
  }, [])

  const openCalendar = async () => {
    try {
      const { action, year, month, day } = await DatePickerAndroid.open({
        // Use `new Date()` for current date.
        // May 25 2020. Month 0 is January.
        date: new Date(1995, 4, 25),
      });
      if (action !== DatePickerAndroid.dismissedAction) {
        setDateBirth(moment(new Date(year, month, day)).format('YYYY-MM-DD'))
      }
    } catch ({ code, message }) {
      console.warn('Cannot open date picker', message);
    }
  }

  const getData = async () => {
    try {
      let data = await getStorage('user');
      setName(data.name);
      setDateBirth(data.birth_date);
      setPlaceBirth(data.birth_place);
      setGender(data.id_gender === null ? 0 : data.id_gender);
      setReligion(data.id_religion === null ? 0 : data.id_religion);
      setMaritial(data.marital_status);
      setMother(data.mother_name);
      setNpwp(data.npwp);
      checkAll()
    } catch (error) {
      console.log(error)
      snackBarError(JSON.stringify(error))
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
            margin: 20
          }}>
            <InputLogin
              placeholder={'Name'}
              onChangeText={val => setName(val)}
              value={name}
            />
            <TextInput
              style={[
                inputStyles.textInputLogin,
                inputStyles.nonActive
              ]}
              placeholder={'Date Birth'}
              value={dateBirth}
              onTouchStart={() => {
                openCalendar()
              }}
            />
            <InputLogin
              placeholder={'Place Of Birth'}
              onChangeText={val => setPlaceBirth(val)}
              value={placeBirth}
            />
            <View style={{
              paddingLeft: 5,
              paddingRight: 5,
              borderWidth: 1,
              borderColor: Colors.grey,
              margin: 10,
              borderRadius: 10
            }}>
              <Picker
                selectedValue={gender}
                onValueChange={(itemValue, itemIndex) => {
                  if (itemValue !== "null") {
                    setGender(itemValue)
                  }
                }
                }>
                <Picker.Item label="Select Gender" value="null" />
                {listGender.map((row, index) => (
                  <Picker.Item label={row.name_gender} value={row.id_gender} />
                ))}
              </Picker>
            </View>
            <View style={{
              paddingLeft: 5,
              paddingRight: 5,
              borderWidth: 1,
              borderColor: Colors.grey,
              margin: 10,
              borderRadius: 10
            }}>
              <Picker
                selectedValue={religion}
                onValueChange={(itemValue, itemIndex) => {
                  if (itemValue !== "0") {
                    setReligion(itemValue)
                  }
                }
                }>
                <Picker.Item label="Select Religion" value="0" />
                {listReligion.map((row, index) => (
                  <Picker.Item label={row.name_religion} value={row.id_religion} />
                ))}
              </Picker>
            </View>
            <View style={{
              paddingLeft: 5,
              paddingRight: 5,
              borderWidth: 1,
              borderColor: Colors.grey,
              margin: 10,
              borderRadius: 10
            }}>
              <Picker
                selectedValue={maritial}
                onValueChange={(itemValue, itemIndex) => {
                  if (itemValue !== "0") {
                    setMaritial(itemValue)
                  }
                }
                }>
                <Picker.Item label="Select Maritial Status" value="0" />
                {listMarital.map((row, index) => (
                  <Picker.Item label={row.name} value={row.id} />
                ))}
              </Picker>
            </View>
            {/* <InputLogin
              placeholder={'Maritial Status'}
              onChangeText={val => setMaritial(val)}
              value={maritial}
            /> */}
            <InputLogin
              placeholder={'Mother Name'}
              onChangeText={val => setMother(val)}
              value={mother}
            />
            <InputLogin
              placeholder={'NPWP'}
              onChangeText={val => setNpwp(val)}
              value={npwp}
            />
          </View>
          <Space size={20} />
          <Buttons text={'Save'} onClick={() => {
            changeData();
          }} />
          <Space size={20} />
        </ScrollView>
      </SafeAreaView>
    </Fragment>
  );
};

DetailProfile.propTypes = {
  navigator: PropTypes.object,
  componentId: PropTypes.string
}

export default DetailProfile;
