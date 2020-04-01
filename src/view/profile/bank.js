import React, { Fragment, useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import PropTypes from 'prop-types';
import { CheckBox, Text as Rtext, Button } from 'react-native-elements'
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StatusBar,
  Picker
} from 'react-native';
import { Styles } from '../../styles';
import { Colors } from '../../styles/colors';
import { Space } from '../../components/container';
import { Buttons, HeaderIcon } from '../../components/button';
import { snackBarWarning, snackBarSuccessOK, snackBarError } from '../../components/snackBar';
import { Nav } from '../../router/navigator';
import { InputLogin } from '../../components/textInput';
import { arkApi } from '../../config/api';
import { Navigation } from 'react-native-navigation';
import { LoadingOverlay } from '../../components/loading';
import { nullChecker } from '../../config/validator';
import { getStorage, getIDUser } from '../../config/storage';
import { refreshToken } from '../../config/refreshToken';

function Bank(props) {

  const [load, setLoad] = useState(false);
  const [listBank, setListBank] = useState([]);
  const [bankSelected, setBank] = useState('');
  const [bankID, setBankID] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    getData();
    getListBank();
  }, [])

  const getListBank = async () => {
    try {
      setLoad(true);
      let res = await arkApi({ metod: 'get', svc: 'master', url: 'bank', param: null, body: null });
      if (res) {
        setLoad(false);
        setListBank(res)
      }
    } catch (err) {
      console.log(err)
      setLoad(false);
    }
  }

  const getData = async () => {
    try {
      let data = await getStorage('user');
      setBank(data.id_bank);
      setBankID(data.account_bank);
      setName(data.name_bank);
    } catch (error) {
      console.log(error)
      snackBarError(JSON.stringify(error))
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

  const doChangeBank = async () => {
    try {
      let data = await getStorage('user');
      let body = {
        id_bank: bankSelected,
        account_bank: bankID,
        name_bank: name
      }
      setLoad(true);
      let res = await arkApi({ metod: 'put', svc: 'member', url: 'updateBank', param: data.id_user_profile, body });
      if (res) {
        alert(JSON.stringify(res))
        setLoad(false);
        refresh();
      } else {
        setLoad(false);
      }
    } catch (err) {
      alert(JSON.stringify(err))
      console.log(err)
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
            margin: 20
          }}>
            <View style={{
              paddingLeft: 5,
              paddingRight: 5,
              borderWidth: 1,
              borderColor: Colors.grey,
              marginLeft: 10,
              marginRight: 10,
              marginTop: 3,
              marginBottom: 3,
              borderRadius: 10
            }}>
              <Picker
                mode={'dropdown'}
                selectedValue={bankSelected}
                onValueChange={(itemValue, itemIndex) => {
                  if (itemValue !== "0") {
                    setBank(itemValue)
                  }
                }}>
                <Picker.Item label="Select Bank" value="0" />
                {listBank.map((row, index) => (
                  <Picker.Item label={row.name_bank} value={row.id_bank} key={index.toString()} />
                ))}
              </Picker>
            </View>
            <InputLogin
              placeholder={'Nomer Rekening'}
              onChangeText={val => setBankID(val)}
              value={bankID}
              keyboardType={'number-pad'}
            />
            <InputLogin
              placeholder={'Nama Pemilik Rekening'}
              onChangeText={val => setName(val)}
              value={name}
            />
          </View>
          <Space size={200} />
          <Buttons text={'submit'} onClick={() => {
            doChangeBank();
          }} />
        </ScrollView>
      </SafeAreaView>
    </Fragment>
  );
};

Bank.propTypes = {
  navigator: PropTypes.object,
  componentId: PropTypes.string
}

export default Bank;