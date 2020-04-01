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
import { containerStyles } from '../../styles/container';
import { Styles, deviceHeight } from '../../styles';
import { Buttons } from '../../components/button';
import { Space } from '../../components/container';
import { setRoot } from '../../router/navigator';
import { Colors } from '../../styles/colors';
import { LoadingOverlay } from '../../components/loading';
import { arkApi } from '../../config/api';

function Loan(props) {

  const [load, setLoad] = useState(false)
  const [loan, setLoan] = useState([])

  const getLoan = () => {
    try {
      if (props.res) {
        if (props.res.config_loan) {
          if (props.res.config_loan[0].loan_product) {
            setLoan(props.res.config_loan[0].loan_product)
          }
        }
      }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getLoan();
  }, [])

  const TopButton = (props) => {
    return (
      <View style={{
        flex: 1,
        height: 50,
        borderRadius: 10,
        backgroundColor: Colors.primary,
        margin: 2,
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Text>{props.title}</Text>
      </View>
    )
  }

  return (
    <Fragment>
      <LoadingOverlay loading={load} />
      <StatusBar barStyle="light-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="always" style={Styles.scrollView}>
          <Space size={50} />
          <View style={containerStyles.centerColumn}>
            <Rtext h4>Payment This Month</Rtext>
            <Rtext h3>Rp. 50.000.000,00</Rtext>
          </View>
          <Space size={30} />
          <View style={{
            margin: 20
          }}>
            <View style={[containerStyles.centerRow]}>
              <TopButton title={'All'} />
              <TopButton title={'Micro Loan'} />
              <TopButton title={'Loan'} />
            </View>
            <Space size={30} />
            {loan.map((row, index) => (
              <View style={[containerStyles.betweenRow, { margin: 10 }]}>
                <View>
                  <Rtext h4>{row.name_loan_product}</Rtext>
                  <Text>Last Transaction On {row.updated_at.substring(0, 9)}</Text>
                  <Text>Time Approval Limit {row.time_approval_limit}</Text>
                </View>
                <View>
                  <Text>{row.id_master_cash}</Text>
                  <Rtext h4>{'Rp. ' + row.cost_administration}</Rtext>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </Fragment>
  );
};

Loan.propTypes = {
  navigator: PropTypes.object,
  componentId: PropTypes.string
}

export default Loan;