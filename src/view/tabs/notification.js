import React, { Fragment, useEffect, useState } from 'react';
import Contacts from 'react-native-unified-contacts';
import PropTypes from 'prop-types';
import { CheckBox, Text as Rtext, Button, Icon, Header } from 'react-native-elements'
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StatusBar,
  TextInput,
  TouchableOpacity,
  PermissionsAndroid,
  Modal,
  Alert
} from 'react-native';
import { Styles, deviceHeight } from '../../styles';
import { Colors } from '../../styles/colors';
import { containerStyles } from '../../styles/container';
import { Buttons, HeaderTabs, CustomButton } from '../../components/button';
import { Space } from '../../components/container';
import { setRoot, setRootTabs, Nav } from '../../router/navigator';
import { snackBarSuccessOK, snackBarError, snackBarWarning } from '../../components/snackBar';
import { Navigation } from 'react-native-navigation';
import { InputIcon, InputSellected } from '../../components/textInput';
import { getStorage } from '../../config/storage';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { ModalHeader } from '../../components/header';
import { LoadingOverlay } from '../../components/loading';
import { arkApi } from '../../config/api';
import { IDR } from '../../helper/numberFormat';
import { textStyles } from '../../styles/text';

function Notification(props) {

  const [active, setActive] = useState([false, true])

  useEffect(() => {
    // getPermission();
  }, [])

  return (
    <SafeAreaView>
      {/* <LoadingOverlay loading={load} /> */}
      <StatusBar barStyle="light-content" backgroundColor={Colors.primaryDark} />
      <Header
        backgroundColor={Colors.primary}
        containerStyle={{
          height: 64,
          marginBottom: -5,
          marginTop: -5,
        }}
        leftComponent={
          <View style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            marginLeft: 10,
            marginTop: -26,
            width: 200
          }}>
            <TouchableOpacity onPress={() => {
              Navigation.pop(props.componentId)
            }}>
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
              {'Notifikasi'}
            </Text>
          </View>
        }
      />
      <Header
        backgroundColor={Colors.primary}
        containerStyle={{
          height: 64,
          marginBottom: -5,
        }}
        leftComponent={
          <View style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'flex-end',
            marginBottom: 10,
            backgroundColor: Colors.primary,
          }}>
            <HeaderTabs title={'Promo/Diskon'} active={active[0]} onPress={() => {
              // let newActive = [...active];
              // newActive[0] = true;
              // newActive[1] = false;
              // setActive(newActive)
            }} />
            <HeaderTabs title={'Update'} active={active[1]} onPress={() => {
              let newActive = [...active];
              newActive[0] = false;
              newActive[1] = true;
              setActive(newActive)
            }} />
          </View>}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="always" style={Styles.scrollView}
      >
        {props.notif.map((row, index) => (
          <TouchableOpacity style={{
            paddingVertical: 10,
            marginHorizontal: 20,
            borderBottomWidth: 1,
            borderColor: Colors.grey
          }}>
            <Text style={textStyles.title}>{row.message.header}</Text>
            <Space size={20} />
            <Text>{row.message.detail}</Text>
          </TouchableOpacity>
        ))}        
      </ScrollView>
    </SafeAreaView>
  );
};

Notification.propTypes = {
  navigator: PropTypes.object,
  componentId: PropTypes.string
}

export default Notification;