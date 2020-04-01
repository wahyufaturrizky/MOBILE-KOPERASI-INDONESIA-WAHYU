import React, { Fragment, useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import PropTypes from 'prop-types';
import { CheckBox, Text as Rtext, Button, colors } from 'react-native-elements'
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';
import { Styles, deviceHeight } from '../../styles';
import { Colors } from '../../styles/colors';
import { Space } from '../../components/container';
import { Buttons, CustomButton } from '../../components/button';
import { snackBarWarning } from '../../components/snackBar';
import { Nav } from '../../router/navigator';
import { LoadingOverlay } from '../../components/loading';
import { arkApi } from '../../config/api';

function LoanTNC(props) {

  const [check, setCheck] = useState(false);
  const [load, setLoad] = useState(false);

  // useEffect(() => {
  //   // alert('budi')
  // }, [])

  return (
    <Fragment>
      <StatusBar barStyle="light-content" />
      <LoadingOverlay loading={load} />
      <SafeAreaView>
      {/* <ScrollView
          contentInsetAdjustmentBehavior="always" style={Styles.scrollView}> */}
        <Space size={20} />
        <View style={{
          flex: 1,
          marginHorizontal: 20
        }}>
          <Rtext h4>
            Syarat & Ketentuan Pinjaman
            </Rtext>
        </View>
        <Space size={20} />
        <ScrollView
          contentInsetAdjustmentBehavior="always" style={{
            height: deviceHeight / 2,
            margin: 20,
            borderWidth: 2,
            borderRadius: 15,
          }}>
          <View style={{
            padding: 20
          }}>
            <Text>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?
          </Text>
          </View>
        </ScrollView>
        <View style={{
          marginHorizontal: 20,
        }}>
          <CheckBox
            center
            title='Saya Setuju Dengan Ketentuan & Syarat Pinjaman Yang Berlaku'
            checked={check}
            containerStyle={{
              borderWidth: 0              
            }}
            onPress={() => {
              setCheck(!check)
            }}
          />
        </View>
        <CustomButton onPress={() => {
          if(!check){
            snackBarWarning('Anda belum menyetujui syarat dan ketentuan pinjaman')
          } else {
            Nav({ title: 'Detail Pinjaman', page: 'ark.SumaryLoan', param: null, ID: props.componentId })
          }
        }}
          color={Colors.danger}
          title={'Lanjutkan'} />
      </SafeAreaView>
    </Fragment>
  );
};

LoanTNC.propTypes = {
  navigator: PropTypes.object,
  componentId: PropTypes.string
}

export default LoanTNC;