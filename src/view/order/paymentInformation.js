import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { CheckBox, Text as Rtext, Button } from 'react-native-elements'
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StatusBar,
  TextInput
} from 'react-native';
import { Styles, deviceHeight, deviceWidth } from '../../styles';
import { Colors } from '../../styles/colors';
import { Buttons, CustomButton } from '../../components/button';
import { Space } from '../../components/container';
import { setRoot, setRootTabs } from '../../router/navigator';
import { containerStyles } from '../../styles/container';

function PaymentInformation(props) {


  return (
    <View style={{
      flex: 1
    }}>
      <SafeAreaView style={{
        flex: 1
      }}>
        <Space size={50} />
        <View style={{
          alignItems: 'center'
        }}>
          <View style={{
            width: deviceWidth - 200,
            height: deviceWidth - 200,
            borderRadius: 100,
            backgroundColor: Colors.danger
          }} />
        </View>
        <Space size={50} />
        <Rtext h4 style={{
          color: Colors.grey,
          textAlign: 'center'
        }}>Pembayaran Berhasil</Rtext>
        <Space size={20} />
        <Text style={{
          textAlign: 'center',
          color: Colors.grey,
          fontSize: 16
        }}>Tips: jangan lupa melakukan penggantian password secara berkala</Text>
        <View style={{
          width: '100%',
          position: 'absolute',
          bottom: 0
        }}>
          <CustomButton
            color={Colors.danger}
            title={'Kembali Ke Daftar Transaksi'}
            onPress={() => {
              setRootTabs({ ID: props.componentId })
            }}
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

PaymentInformation.propTypes = {
  navigator: PropTypes.object,
  componentId: PropTypes.string
}

export default PaymentInformation;