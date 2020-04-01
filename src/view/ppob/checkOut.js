import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { CheckBox, Text as Rtext, Button } from 'react-native-elements'
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StatusBar,
  TextInput,
  TouchableOpacity
} from 'react-native';
import { Styles, deviceHeight } from '../../styles';
import { containerStyles } from '../../styles/container';
import { Colors } from '../../styles/colors';
import { Buttons, CustomButton } from '../../components/button';
import { Space } from '../../components/container';
import { setRoot, setRootTabs, Nav } from '../../router/navigator';
import { arkApi } from '../../config/api';
import { LoadingOverlay } from '../../components/loading';
import { Navigation } from 'react-native-navigation';
import { IDR } from '../../helper/numberFormat';

function CheckOut(props) {

  useEffect(() => {
    // getListPulsa();
  }, [])


  const Child = () => {
    return (
      props.child ? props.child : (
        <View />
      )
    );
  }

  return (
    <View style={{
      flex: 1,
    }}>
      <SafeAreaView style={{
        flex: 1
      }}>
        <ScrollView>
          <View style={{
            width: '100%',
            padding: 20,
            borderBottomColor: Colors.tightGrey,
            borderBottomWidth: 1,
          }}>
            <Rtext h4>{props.title}</Rtext>
            <Space size={5} />
            <Text>Silakan selesaikan pembelian anda</Text>
          </View>
          <View style={{
            width: '100%',
            padding: 20,
            borderBottomColor: Colors.tightGrey,
            borderBottomWidth: 1,
          }}>
            <Rtext h4>Rincian Informasi</Rtext>
            <Space size={5} />
            <Child />
          </View>
          <View style={{
            width: '100%',
            padding: 20,
            borderBottomColor: Colors.tightGrey,
            borderBottomWidth: 1,
          }}>
            <View style={containerStyles.betweenRow}>
              <Rtext h4>Total Pembayaran</Rtext>
              <Rtext h4>{IDR(props.price)}</Rtext>
            </View>
          </View>
        </ScrollView>
        <View style={{
          width: '100%',
          position: 'absolute',
          bottom: 0
        }}>
          <CustomButton
            color={Colors.danger}
            title={'Bayar'}
            onPress={() => {
              Nav({ title: 'Pembayaran', page: 'ark.Payment', param: { payload: props.payload, total: props.price, param: props.param, flag: props.flag }, ID: props.componentId })
            }}
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

CheckOut.propTypes = {
  navigator: PropTypes.object,
  componentId: PropTypes.string
}

export default CheckOut;