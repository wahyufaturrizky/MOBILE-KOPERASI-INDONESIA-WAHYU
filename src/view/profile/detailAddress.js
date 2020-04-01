import React, { Fragment, useEffect, useState } from 'react';
import Geolocation from 'react-native-geolocation-service';
import Icon from 'react-native-vector-icons/Ionicons';
import MapView from 'react-native-maps';
import PropTypes from 'prop-types';
import { CheckBox, Text as Rtext, Button } from 'react-native-elements'
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StatusBar,
  Picker, PermissionsAndroid
} from 'react-native';
import { Styles, deviceWidth } from '../../styles';
import { Colors } from '../../styles/colors';
import { Space } from '../../components/container';
import { Buttons, HeaderIcon } from '../../components/button';
import { snackBarWarning, snackBarError, snackBarSuccess } from '../../components/snackBar';
import { Nav, popToSettings } from '../../router/navigator';
import { InputLogin } from '../../components/textInput';
import { LoadingOverlay } from '../../components/loading';
import { getIDProfile } from '../../config/storage';
import { arkPostAuth, arkApi } from '../../config/api';
import { Navigation } from 'react-native-navigation';
import { refreshToken } from '../../config/refreshToken';

function DetailAddress(props) {

  const [load, setLoad] = useState(false);
  const [name, setName] = useState('');
  const [recieve, setRecieve] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [code, setCode] = useState('');
  const [loc, setLoc] = useState('');
  const [lat, setLat] = useState(0);
  const [long, setLong] = useState(0);

  const [isMapReady, setMapReady] = useState(false);

  useEffect(() => {
    hasLocationPermission();
  }, [])  

  const hasLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message:
            'Please Allow Your Location ',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        checkLoc();
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  }

  const checkLoc = () => {
    try {
      Geolocation.getCurrentPosition(
        (position) => {
          console.log(position)
          setLat(position.coords.latitude);
          setLong(position.coords.longitude);
        },
        (error) => {
          // See error code charts below.
          console.log(error.code, error.message);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    } catch (error) {
      console.log(error)
      alert(JSON.stringify(error))
    }
  }

  const saveAddress = async () => {
    try {
      setLoad(true)
      let ID = await getIDProfile();
      let body = {
        id_user_profile: ID,
        address_name: name,
        receiver_name: recieve,
        address_text: address,
        city_or_district: city,
        postal_code: code,
        receiver_phone: phone,
        address_latitude: lat.toString(),
        address_longitude: long.toString(),
        address_latlong_text: loc,
        status: 0,
        is_main_address: 1
      }
      let res = await arkApi({ metod: 'post', svc: 'member', url: 'saveAddress', param: null, body });
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

  const refresh = async () => {
    try {
      setLoad(true);
      const data = await refreshToken();
      const payload = data.user.profile;
      if (payload) {
        setLoad(false);
        snackBarSuccess('Sukses Create Address')
        if(props.flag){
          setTimeout(function(){ 
            Navigation.pop(props.componentId)            
          }, 1000);
        } else {
          setTimeout(function(){ 
            popToSettings();
          }, 1000);
        }        
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
            margin: 20
          }}>
            <InputLogin
              placeholder={'Address Name'}
              onChangeText={val => setName(val)}
              value={name}
            />
            <InputLogin
              placeholder={'Recieve Name'}
              onChangeText={val => setRecieve(val)}
              value={recieve}
            />
            <InputLogin
              placeholder={'Recieve Phone Number'}
              onChangeText={val => setPhone(val)}
              value={phone}
              keyboardType={'number-pad'}
            />
            <InputLogin
              placeholder={'Address'}
              onChangeText={val => setAddress(val)}
              value={address}
            />
            <InputLogin
              placeholder={'City'}
              onChangeText={val => setCity(val)}
              value={city}
            />
            <InputLogin
              placeholder={'Postal Code'}
              onChangeText={val => setCode(val)}
              value={code}
              keyboardType={'number-pad'}
            />
            <InputLogin
              placeholder={'Shiping Address'}
              onChangeText={val => setLoc(val)}
              value={loc}
            />
            <View style={{
              margin: 10
            }}>
              <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#F5FCFF',
              }}>
                <MapView style={{
                  width: deviceWidth - 60,               
                  height: 100
                }}
                  onPress={e => alert(isMapReady)}
                  initialRegion={{
                    latitude: 47.6062,
                    longitude: 122.3321,
                    latitudeDelta: 0.02,
                    longitudeDelta: 0.02
                  }}
                  onLayout={() => {
                    setMapReady(true)
                  }}
                >
                  {isMapReady && (
                    <MapView.Marker
                      coordinate={{
                        latitude: 47.6062,
                        longitude: 122.3321
                      }}
                      title={"title"}
                      description={"description"}
                  /> ) }                  
                </MapView>
              </View>
            </View>
          </View>
          <Space size={30} />
          <Buttons text={'submit'} onClick={() => {
            saveAddress();
          }} />
          <Space size={30} />
        </ScrollView>
      </SafeAreaView>
    </Fragment>
  );
};

DetailAddress.propTypes = {
  navigator: PropTypes.object,
  componentId: PropTypes.string
}

export default DetailAddress;