import React, { Fragment, useEffect, useState, useLayoutEffect } from 'react';
// import Icon from 'react-native-vector-icons/Ionicons';
import PropTypes from 'prop-types';
import { CheckBox, Text as Rtext, Button, Icon } from 'react-native-elements'
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StatusBar,
  Picker,
  TouchableOpacity,
  PermissionsAndroid,
  Alert
} from 'react-native';
import { Styles } from '../../styles';
import { Colors } from '../../styles/colors';
import { Space } from '../../components/container';
import { Buttons, HeaderIcon } from '../../components/button';
import { snackBarWarning, snackBarError, snackBarSuccess } from '../../components/snackBar';
import { Nav, popToSettings } from '../../router/navigator';
import { InputLogin } from '../../components/textInput';
import { arkPostAuth, arkGetAuth, arkApi } from '../../config/api';
import { getUrlProfile, getLocProfile, getIDProfile, getIDUser } from '../../config/storage';
import { resValid } from '../../config/validator';
import { LoadingOverlay } from '../../components/loading';
import { refreshToken } from '../../config/refreshToken';

function Address(props) {

  const [loc, setLoc] = useState([])
  const [load, setLoad] = useState(false)

  useEffect(() => {
    // alert('budi')
    getData()
  }, [])

  function extract(payload) {
    let data = []
    for (let i in payload) {
      data.push({ id: payload[i].id_user_address, name: payload[i].address_name, desc: payload[i].address_text, city: payload[i].city_or_district, zip: payload[i].postal_code, hp: payload[i].receiver_phone, check: payload[i].is_main_address ? true : false, payload: payload[i] })
    }
    setLoc(data);
    setLoad(false);
  }

  const getData = async () => {
    try {
      setLoad(true);
      const payload = await getLocProfile();
      extract(payload);
    } catch (error) {
      setLoad(false)
      console.log(error)
      snackBarError(JSON.stringify(error))
    }
  }

  const updateMain = (index, item) => {
    updateData(item);
    let data = [...loc];
    data[index].check = true
    setLoc(data);
    for (let i in loc) {
      if (Number(i) !== index) {
        let data = [...loc];
        data[i].check = false
        setLoc(data);
      }
    }
  }

  const updateData = async (item) => {
    try {
      const data = item.payload
      setLoad(true)
      let ID = await getIDUser();
      let body = {
        id_user_address: item.id,
        address_name: data.address_name,
        receiver_name: data.receiver_name,
        address_text: data.address_text,
        city_or_district: data.city_or_district,
        postal_code: data.postal_code.length !== 5 ? '10110' : data.postal_code,
        receiver_phone: data.receiver_phone,
        address_latitude: data.address_latitude,
        address_longitude: data.address_longitude,
        address_latlong_text: data.address_latlong_text,
        is_main_address: 1
      }
      let res = await arkApi({ metod: 'put', svc: 'member', url: 'updateAddress', param: ID, body });
      if (res) {
        setLoad(false);
        refresh();
      } else {
        setLoad(false)
      }
    } catch (error) {
      snackBarError(JSON.stringify(error))
    }
  }

  const doRemove = async (id) => {
    try {
      setLoad(true)

      let res = await arkApi({ metod: 'delete', svc: 'member', url: 'deleteAddress', param: id, body: null });
      if (res) {
        setLoad(false);
        refresh();
      } else {
        refresh();
        setLoad(false)
      }
    } catch (error) {
      console.log(error)
      setLoad(false)
      snackBarError(JSON.stringify(error))
    }
  }

  const refresh = async () => {
    try {
      setLoad(true);
      const data = await refreshToken();
      const payload = data.user.profile;
      if (payload) {
        setLoad(false);
        snackBarSuccess('Sukses Update Address')
        getData()
        setTimeout(function(){ 
          popToSettings();
        }, 1000);
      }
    } catch (error) {
      setLoad(false)
      console.log(error)
      snackBarError(JSON.stringify(error))
    }
  }

  return (
    <Fragment>
      <StatusBar barStyle="light-content" />
      <LoadingOverlay loading={load} />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="always" style={Styles.scrollView}>
          <View style={{
            margin: 30
          }}>
            {loc.map((item, index) => (
              loc.length === 0 ? (
                <View />
              ) : (
                  <View key={index.toString()} style={{
                    marginBottom: 15
                  }}>
                    <View style={{
                      flex: 1,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <Rtext h4>{item.name}</Rtext>
                      <CheckBox
                        center
                        title='Main'
                        checked={item.check}
                        onPress={() => {
                          updateMain(index, item);
                        }}
                      />
                    </View>
                    <Rtext>Recieve Name: {item.name} ( {item.hp} ), {item.desc}, {item.city} ( {item.zip} )</Rtext>
                    <View style={{
                      flex: 1,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'flex-end'
                    }}>
                      <TouchableOpacity
                        style={{
                          margin: 5
                        }}
                        onPress={() => {
                          Nav({ title: 'Update ' + item.name, page: 'ark.UpdateAddress', param: { data: item.payload }, ID: props.componentId })
                        }}>
                        <Text style={{
                          fontSize: 14,
                          fontWeight: 'bold',
                          color: Colors.primary
                        }}>Edit</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{
                          margin: 5
                        }}
                        onPress={() => {
                          Alert.alert(
                            'Hapus Alamat',
                            'Yakin Mau Hapus ' + item.name + ' ?',
                            [
                              {text: 'Gak Jadi', onPress: () => console.log('Ask me later pressed')},
                              {text: 'Iya', onPress: () => doRemove(item.id)},
                            ],
                            {cancelable: false},
                          );
                        }}>
                        <Text style={{
                          fontSize: 14,
                          fontWeight: 'bold',
                          color: Colors.danger
                        }}>Remove</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )
            ))}
            <TouchableOpacity style={{
              borderWidth: 4,
              borderColor: Colors.primary,
              borderRadius: 10,
              marginTop: 30
            }}
              onPress={() => {
                Nav({ title: 'Add New Address', page: 'ark.DetailAddress', param: null, ID: props.componentId })
              }}>
              <Icon
                name={'ios-add'}
                type='ionicon'
                size={50}
                color={Colors.primary}
              />
            </TouchableOpacity>
          </View>
          <Space size={20} />
        </ScrollView>
      </SafeAreaView>
    </Fragment>
  );
};

Address.propTypes = {
  navigator: PropTypes.object,
  componentId: PropTypes.string
}

export default Address;