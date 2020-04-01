import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Text, Header, Icon } from 'react-native-elements'
import {
  SafeAreaView,
  ScrollView,
  View,
  StatusBar,
  Image,
  TouchableOpacity,
  RefreshControl
} from 'react-native';
import { Styles, deviceHeight, deviceWidth } from '../../styles';
import { Colors } from '../../styles/colors'
import { Space } from '../../components/container';
import { LoadingOverlay } from '../../components/loading';
import { resValid } from '../../config/validator';
import { Buttons, HeaderIcon, IconHeader, CustomButton } from '../../components/button';
import { Nav, setRoot } from '../../router/navigator';
import { snackBarError } from '../../components/snackBar';
import { getStorage, clearStorage } from '../../config/storage';
import { CustomHeader, ProfileHeader } from '../../components/header';
import SplashScreen from 'react-native-splash-screen'
import { textStyles } from '../../styles/text';
import { containerStyles } from '../../styles/container';

import { connect } from 'react-redux';

import { action$fetchPosts } from '../../redux/action';
import { refreshToken } from '../../config/refreshToken';

function Profile(props) {

  const [load, setLoad] = useState(false);
  const [userData, setUserData] = useState({ name: 'loading', id_koperasi: 'loading' });
  const [refreshing, setRefreshing] = useState(false);


  useEffect(() => {
    // SplashScreen.hide()
    getData()
    // props.action$fetchPosts()
  }, [])

  const refresh = async () => {
    try {
      setLoad(true);
      const data = await refreshToken();
      if (data) {
        setLoad(false);
        setUserData(data)
      }
      setRefreshing(false)
    } catch (error) {
      setLoad(false)
      console.log(error)
      snackBarError(JSON.stringify(error))
    }
  }

  const getData = async () => {
    try {
      let data = await getStorage('user');
      setUserData(data)
    } catch (error) {
      snackBarError(JSON.stringify(error))
    }
  }

  function logOut() {
    clearStorage();
    setRoot({ title: 'Login', page: 'ark.Login', param: null, ID: props.componentId })
  }

  const Settings = (props) => {
    return (
      <TouchableOpacity style={[containerStyles.leftRow, {
        marginVertical: 10
      }]}>
        <Icon
          name={props.icon}
          type={'ionicon'}
          color={Colors.light}
          containerStyle={{
            width: 40,
            height: 40,
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: Colors.light,
            borderRadius: 10
          }}
          iconStyle={{
            fontSize: 30,
          }}
        />
        <View style={{
          marginHorizontal: 20
        }}>
          <Text style={textStyles.contentProfile}>{props.title}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <Fragment>
      <LoadingOverlay loading={load} />
      {/* <StatusBar barStyle="dark-content" backgroundColor={Colors.light} /> */}
      <SafeAreaView style={{
        flex: 1
      }}>
        {/* <ProfileHeader title={'Personal'} /> */}
        <View style={[{
          // top: 0,
          height: 60,
          width: '100%',
          backgroundColor: Colors.light,
          flexDirection: 'row',
          alignContent: 'center',
          alignItems: 'center',
          justifyContent: 'space-between',
        }]}>
          <View style={containerStyles.leftRow}>
            <Text style={{
              fontSize: 26,
              paddingLeft: 20,
              fontWeight: 'bold',
              color: Colors.dark
            }}>
              Personal
            </Text>
          </View>
          <TouchableOpacity
            style={{
              padding: 10
            }}
            onPress={() => {
              Nav({ title: 'Notification', page: 'ark.Notif', param: { notif: [] }, ID: props.componentId, header: false })
            }} >
            <Icon
              name='ios-notifications'
              type={'ionicon'}
              color={Colors.dark}
              iconStyle={{
                fontSize: 30,
                padding: 10
              }}
              size={15}
            />
          </TouchableOpacity>
        </View>
        <ScrollView
          contentInsetAdjustmentBehavior="always" style={[Styles.body, {
            top: 0
          }]} 
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={refresh} />
          }>
          <View style={{
            marginTop: deviceHeight / 6,
            // height: deviceHeight / 1.25,
            // position: 'absolute',
            bottom: 0,
            width: deviceWidth,
            backgroundColor: Colors.danger,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30
          }}>
            <TouchableOpacity style={{
              right: 20,
              top: 20,
              position: 'absolute'
            }} onPress={() => {
              Nav({ title: 'Pengaturan Akun', page: 'ark.Account', param: null, ID: props.componentId })
            }}>
              <Icon
                name={'ios-settings'}
                type={'ionicon'}
                color={Colors.light}
                iconStyle={{
                  fontSize: 30,
                  padding: 10
                }}
                size={15} />
            </TouchableOpacity>
            <View style={{
              flex: 1,
              alignItems: 'center',
              marginTop: -80
            }}>
              <Image style={{
                width: 130,
                height: 130,
                borderWidth: 5,
                borderColor: Colors.light,
                backgroundColor: Colors.grey,
                borderRadius: 100,
              }} source={{ uri: userData.photo }} />
              <Space size={10} />
              <Text style={{
                fontWeight: 'bold',
                fontSize: 24,
                color: Colors.light
              }}>{userData.name}</Text>
              <Text style={{
                fontSize: 20,
                color: Colors.light,
                marginTop: 5
              }}>{userData.id_koperasi}</Text>
            </View>
            <View style={{
              flex: 2,
              margin: 20
            }}>
              <TouchableOpacity style={{
                paddingVertical: 10,
                borderBottomWidth: 1,
                borderTopWidth: 1,
                borderColor: Colors.light
              }} onPress={()=>{
                Nav({ title: 'Personal Settings', page: 'ark.Settings', param: null, ID: props.componentId })
              }}>
                <Text style={textStyles.contentProfile}>Data Keanggotaan</Text>
                <View style={[containerStyles.betweenRow, {
                  marginVertical: 10
                }]}>
                  <Icon
                    name={'ios-contact'}
                    type={'ionicon'}
                    color={Colors.light}
                    containerStyle={{
                      width: 40,
                      height: 40,
                      justifyContent: 'center',
                      borderWidth: 1,
                      borderColor: Colors.light,
                      borderRadius: 10
                    }}
                    iconStyle={{
                      fontSize: 30,
                    }}
                  />
                  <View style={{
                    marginRight: 20
                  }}>
                    <Text style={{
                      marginLeft: 10,
                      color: Colors.light
                    }}>Lengkapi data untuk mendapatkan kesempatan persetujuan pinjaman hingga Rp 100.000.000</Text>
                  </View>
                </View>
              </TouchableOpacity>
              <Space size={10} />
              <Settings title={'frequently Answerd Question (FAQ)'} icon={'ios-quote'} />
              <Settings title={'Kebijakan Layanan Dan Privasi'} icon={'ios-list'} />
              <Settings title={'Tentang Kami'} icon={'ios-information-circle'} />
              <TouchableOpacity style={[containerStyles.betweenRow, {
                marginVertical: 10
              }]}>
                <View style={containerStyles.leftRow}>
                  <Icon
                    name={'ios-star-outline'}
                    type={'ionicon'}
                    color={Colors.light}
                    containerStyle={{
                      width: 40,
                      height: 40,
                      justifyContent: 'center',
                      borderWidth: 1,
                      borderColor: Colors.light,
                      borderRadius: 10
                    }}
                    iconStyle={{
                      fontSize: 30,
                    }}
                  />
                  <View style={{
                    marginHorizontal: 20
                  }}>
                    <Text style={textStyles.contentProfile}>{'Beri Kami Nilai'}</Text>
                  </View>
                </View>
                <View>
                  <Text style={{
                    fontWeight: 'bold',
                    color: Colors.light
                  }}>v0.0.1</Text>
                </View>
              </TouchableOpacity>
              <Space size={20} />
              <CustomButton title={'KELUAR'} color={Colors.danger} lineColor={Colors.light} onPress={() => {
                logOut()
              }} />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Fragment>
  );
};

Profile.propTypes = {
  navigator: PropTypes.object,
  componentId: PropTypes.string,
  action$fetchPosts: PropTypes.func,
  posts: PropTypes.array
}

function mapStateToProps(state) {
  return {
    posts: state.posts
  };
}

// export default Profile;
export default connect(mapStateToProps, { action$fetchPosts })(Profile);