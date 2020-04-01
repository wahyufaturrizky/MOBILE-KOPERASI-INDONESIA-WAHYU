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
} from 'react-native';
import { Styles } from '../../styles';
import { Colors } from '../../styles/colors';
import { Space } from '../../components/container';
import { Buttons, HeaderIcon } from '../../components/button';
import { snackBarWarning, snackBarError } from '../../components/snackBar';
import { Nav } from '../../router/navigator';
import { getStorage } from '../../config/storage';

function Balance(props) {

  const [userData, setUserData] = useState({ loan_balance: 0, saving_balance: 0, micro_balance: 0 })

  // useEffect(() => {
  //   getData()
  // }, [])

  // const getData = async () => {
  //   try {
  //     let data = await getStorage('user');
  //     setUserData(data)
  //   } catch (error) {
  //     snackBarError(JSON.stringify(error))
  //   }
  // }

  const SubPrice = (props) => {
    return (
      <Text style={{
        margin: 10,
        fontWeight: 'bold'
      }}>
        Rp. {props.price}
      </Text>
    )
  }

  return (
    <Fragment>
      <StatusBar barStyle="light-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="always" style={Styles.scrollView}>
          <Space size={20} />
          <View style={{
            flex: 1,
            alignItems: 'center'
          }}>
            <Rtext h3>
              Total Balance
            </Rtext>
          </View>
          <Space size={20} />
          <View style={{
            marginLeft: 20,
            marginRight: 20,
            alignItems: 'center'
          }}>
            <Rtext h4>
              Total Micro Loan Balance
            </Rtext>
            <SubPrice price={props.microloan_balance} />
            <Rtext h4>
              Total Middle Loan Balance
            </Rtext>
            <SubPrice price={props.loan_balance} />
            <Rtext h4>
              Total Saving Balance
            </Rtext>
            <SubPrice price={props.saving_balance} />
          </View>
          <Space size={100} />
          <View style={{
            alignItems: 'center'
          }}>
            <View style={{
              width: 160,
            }}>
              <HeaderIcon
                onClick={() => { alert('sip') }}
                icon={'ios-wallet'}
                color={Colors.light}
                background={Colors.primary}
              />
              <Rtext h4 style={{
                textAlign: 'center'
              }}>
                Top Up My Balance
              </Rtext>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Fragment>
  );
};

Balance.propTypes = {
  navigator: PropTypes.object,
  componentId: PropTypes.string
}

export default Balance;