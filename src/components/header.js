import React, { useState, useEffect } from 'react';
import { Icon, Badge } from 'react-native-elements';
import Icons from 'react-native-vector-icons/Ionicons';
import {
  TouchableOpacity,
  Text,
  View
} from 'react-native';
import { buttonStyles as styles } from '../styles/button';
import { Colors } from '../styles/colors';
import { Header } from 'react-native-elements';
import { Navigation } from 'react-native-navigation';
import { deviceWidth, deviceHeight } from '../styles';
import { Nav } from '../router/navigator';
import { arkApi } from '../config/api';
import { getStorage } from '../config/storage';

export const ModalHeader = (props) => {

  return (
    <Header
      backgroundColor={Colors.primary}
      containerStyle={{
        height: deviceHeight / 6.75,
        marginBottom: -5,
        borderBottomWidth: 5,
        flexDirection: 'row',
        marginTop: -25
      }}
      leftComponent={
        <View style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-start',
          marginLeft: 10,
          marginTop: -20,
          width: 200
        }}>
          <TouchableOpacity onPress={props.onPress}>
            <Icon
              name='md-arrow-back'
              type='ionicon'
              color={Colors.light}
            />
          </TouchableOpacity>
          <Text style={{
            fontSize: 22,
            marginLeft: 20,
            color: Colors.light
          }}>
            {props.title}
          </Text>
        </View>
      }
    />
  );
};

export const CustomHeader = (props) => {

  const ID = props.id;

  return (
    <Header
      backgroundColor={Colors.primary}
      containerStyle={{
        height: deviceHeight / 6.75,
        marginBottom: -5,
        borderBottomWidth: 5,
        flexDirection: 'row',
        marginTop: -25
      }}
      leftComponent={
        <View style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          alignContent: 'center',
          justifyContent: 'flex-start',
          marginLeft: 10,
          marginTop: -20,
          width: 200
        }}>
          {ID !== undefined ? (
            <TouchableOpacity onPress={() => {
              Navigation.pop(props.componentId)
            }}>
              <Icon
                name='md-arrow-back'
                type='ionicon'
                color={Colors.light}
              />
            </TouchableOpacity>
          ) : (
              <View style={{
                marginRight: -20
              }} />
            )}
          <Text style={{
            fontSize: 22,
            marginLeft: 20,
            color: Colors.light
          }}>
            {props.title}
          </Text>
        </View>
      }
    />
  );
};

export const ProfileHeader = (props) => {

  const ID = props.id;

  return (
    <Header
      backgroundColor={Colors.light}
      containerStyle={{
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.light,
        // opacity: 0.4
      }}
      leftComponent={
        <View style={{
          marginTop: -20
        }}>
          <Text style={{
            fontSize: 26,
            marginLeft: 20,
            fontWeight: 'bold',
            width: 200,
            color: Colors.dark
          }}>
            {props.title}
          </Text>
        </View>
      }
      rightComponent={
        <View style={{
          marginTop: -20
        }}>
          <TouchableOpacity
            onPress={() => {
              Nav({ title: 'Notification', page: 'ark.Notif', param: null, ID, header: false })
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
      }
    />
  );
};

export const HomeHeader = (props) => {

  const [notif, setNotif] = useState([])
  const ID = props.ID;
  const [read, setRead] = useState(0)

  useEffect(() => {
    if (props.getNotif) {
      getNotif()
    }
  }, [])

  const getNotif = async () => {
    try {
      const data = await getStorage('user')
      let res = await arkApi({ metod: 'get', svc: 'notification', url: 'notif', param: data.id_user, body: null });
      if (res) {
        setNotif(res)
        let newRead = 0;
        for (let i in res) {
          if (!res[i].read) {
            newRead = newRead + 1;
          }
        }
        setRead(newRead);
      }
    } catch (err) {
      console.log(err)
    }
  }

  const RightContent = () => {
    return (
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Icon
          name='md-paper'
          type={'ionicon'}
          color={Colors.light}
          iconStyle={{
            fontSize: 30,
            padding: 10
          }}
          size={15}
          onPress={() => {
            Nav({ title: 'Detail Wishlist', page: 'ark.WishList', param: null, ID, header: false })
          }} />
        <View>
          <Icon
            name='ios-notifications'
            type={'ionicon'}
            color={Colors.light}
            iconStyle={{
              fontSize: 30,
              padding: 10
            }}
            size={15}
            onPress={() => {
              Nav({ title: 'Detail Notif', page: 'ark.Notif', param: { notif }, ID, header: false })
            }} />
          {read > 0 ? (
            <Badge
              value={notif.length}
              status="success"
              containerStyle={{ position: 'absolute', top: -4, right: -4 }}
            />
          ) : (
              <View />
            )}
        </View>
      </View>
    )
  }

  return (
    <Header
      backgroundColor={Colors.primary}
      containerStyle={{
        height: deviceHeight / 6.75,
        marginBottom: -5,
        borderBottomWidth: 5,
        flexDirection: 'row',
        marginTop: -25
      }}
      leftComponent={
        <TouchableOpacity style={{
          borderRadius: 10,
          width: deviceWidth - 120,
          borderColor: Colors.grey,
          backgroundColor: Colors.light,
          flexDirection: 'row',
        }} onPress={props.onPress}>
          <Icon
            name='ios-search'
            type={'ionicon'}
            color={Colors.primary}
            iconStyle={{
              padding: 10
            }}
            size={20} />
        </TouchableOpacity>
      }
      rightComponent={
        <RightContent />
      }
    />
  );
};

export const ProductHeader = (props) => {
  return (
    <Header
      backgroundColor={Colors.primary}
      containerStyle={{
        height: deviceHeight / 6.75,
        marginBottom: -5,
        borderBottomWidth: 5,
        flexDirection: 'row',
        marginTop: -25
      }}
      leftComponent={
        <View style={{
          padding: 5,
          height: 30,
          width: 30,
          marginRight: 10,
          alignItems: 'center',
          justifyContent: 'flex-start',
          flexDirection: 'row',
          width: deviceWidth / 2
        }}>
          <TouchableOpacity style={{
            padding: 5,
            height: 30,
            width: 30,
            marginLeft: 10,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 100,
            backgroundColor: Colors.light
          }} onPress={() => {
            Navigation.pop(props.ID)
          }}>
            <Icons
              name='md-arrow-back'
              type={'ionicon'}
              color={Colors.dark}
              iconStyle={{
                padding: 10
              }}
              size={20} />
          </TouchableOpacity>
          <Text style={{
            marginLeft: 20,
            fontSize: 22,
            color: Colors.light,
            fontWeight: 'bold',
            textTransform: 'capitalize'
          }}>{props.title}</Text>
        </View>
      }
      rightComponent={
        <TouchableOpacity style={{
          padding: 5,
          height: 30,
          width: 30,
          marginRight: 10,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          borderRadius: 100,
          backgroundColor: Colors.light
        }} onPress={() => {
          Nav({ title: 'Keranjang Belanja', page: 'ark.Cart', param: null, ID: props.ID})          
        }}>
          <Icons
            name='ios-cart'
            type={'ionicon'}
            color={Colors.dark}
            iconStyle={{
              padding: 10
            }}
            size={20} />
        </TouchableOpacity>
      }
    />
  );
}