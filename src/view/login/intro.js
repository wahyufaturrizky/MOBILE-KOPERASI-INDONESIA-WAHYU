import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Navigation } from 'react-native-navigation';
import AppIntroSlider from 'react-native-app-intro-slider';
import { Text } from 'react-native-elements';
import {
  View,
  Image,
  TouchableOpacity
} from 'react-native';

import { textStyles } from '../../styles/text';
import { imageStyles } from '../../styles/image';

import logo from '../../assets/images/logo.png';
import { Colors } from '../../styles/colors';
import { getStorage, clearStorage } from '../../config/storage';
import { setRoot, setRootTabs } from '../../router/navigator';
import { Icon } from 'react-native-elements';
import { Space } from '../../components/container';
import { CustomButton } from '../../components/button';
import slides from '../../config/waltought.json';

function Intro(props) {

  useEffect(() => {
    // checkUser()
  }, [])

  checkUser = async () => {
    const data = await getStorage('user');
    console.log(data)
    if (data.user) {
      userValidation(data.user)
    }
  }

  function logOut() {
    clearStorage();
    setRoot({ title: 'Login', page: 'ark.Login', param: null, ID: props.componentId })
  }


  function userValidation(data) {
    if (data.id_workflow_status == 'MBR-003') {
      logOut();
    } else {
      setRootTabs({ ID: props.componentId })
    }
  }

  function _renderItem({ item }) {
    return (
      <View style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: Colors.light
      }}>
        <Space size={50} />
        <Image style={imageStyles.imageSlider} source={item.image} />
        <Space size={50} />
        <Text style={textStyles.titleSlider}>{item.title}</Text>
        <Text style={textStyles.contentSlider}>{item.text}</Text>
      </View>
    );
  }

  _renderSkipButton = () => {
    return (
      <View style={{
        justifyContent: 'center',    
        alignSelf: 'center'    
      }}>
        <Text style={{
          color: Colors.danger,
          fontWeight: 'bold',
          fontSize: 16
        }}>LEWATI</Text>
      </View>
    );
  };

  _renderDoneButton = () => {
    return (
      <View style={{
        margin: 10,
        borderWidth: props.outline ? 1 : 0,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
        borderRadius: 12,
        paddingHorizontal: 10,
        backgroundColor: Colors.danger
      }}>
        <Text style={{
          fontSize: 16,
          paddingHorizontal: 5,
          color: Colors.light,
          textAlign: 'center',
          padding: 20,
          fontWeight: 'bold'
        }}>Login</Text>
      </View>
    )
  }

  _renderNextButton = () => {
    return (
      <View style={{
        borderRadius: 100,
        height: 50,
        width: 50,
        backgroundColor: Colors.danger,
        justifyContent: 'center',
        alignContent: 'flex-end',
        alignSelf: 'flex-end'
      }}>
        <Icon
          name='ios-arrow-forward'
          type={'ionicon'}
          color={Colors.light}
          iconStyle={{
            padding: 10
          }}
          size={40} />
      </View>
    );
  };

  function _onDone() {
    Navigation.push(props.componentId, {
      component: {
        name: 'ark.Login',
        options: {
          topBar: {
            visible: false,
            background: {
              color: Colors.primary
            }
          }
        }
      }
    });
  }

  return (
    <AppIntroSlider
      renderItem={_renderItem}
      slides={slides}
      onDone={_onDone}
      bottomButton
      dotStyle={{
        backgroundColor: Colors.lightGrey
      }}
      activeDotStyle={{
        backgroundColor: Colors.danger
      }}
      showSkipButton
      renderDoneButton={_renderDoneButton}
      renderNextButton={_renderNextButton}
      renderSkipButton={_renderSkipButton}
    />
  );
};

Intro.propTypes = {
  navigator: PropTypes.object,
  componentId: PropTypes.string
}

export default Intro;
