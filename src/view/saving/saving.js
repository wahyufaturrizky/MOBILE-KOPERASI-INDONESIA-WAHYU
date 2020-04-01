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

function Saving(props) {

  const [load, setLoad] = useState(false)
  const [saving, setSaving] = useState([])

  // const getSaving = async () => {
  //   try {
  //     setLoad(true);
  //     let res = await arkApi({ metod: 'get', svc: 'configuration', url: 'configBySub', param: null, body: null });
  //     if (res) {
  //       setLoad(false);
  //       console.log(res.config_saving)
  //       setSaving(res.config_saving)
  //     } else {
  //       setLoad(false)
  //     }
  //     // setSaving(props.res.config_saving)
  //   } catch (err) {
  //     console.log(err)
  //     setLoad(false);
  //   }
  // }
  const getSaving = async () => {
    try {
      if (props.res) {
        if (props.res.config_saving) {
          setSaving(props.res.config_saving)
        }
      }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getSaving();
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

  function backLogin() {
    setRoot({ title: 'Login', page: 'ark.Login', param: {}, ID: props.componentId })
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
            <Rtext h4>Total Balance Saving</Rtext>
            <Rtext h3>Rp. 50.000.000,00</Rtext>
          </View>
          <Space size={30} />
          <View style={{
            margin: 20
          }}>
            <View style={[containerStyles.centerRow]}>
              <TopButton title={'All'} />
              <TopButton title={'Required'} />
              <TopButton title={'On Going'} />
              <TopButton title={'Completed'} />
            </View>
            <Space size={30} />
            {saving.map((row, index) => (
              <View style={[containerStyles.betweenRow, { margin: 10 }]}>
                <View>
                  <Rtext h4>{row.saving_product[0].name_saving_product}</Rtext>
                  <Text>Last Transaction On {row.saving_product[0].updated_at.substring(0, 9)}</Text>
                  <Text>Time Approval Limit {row.saving_product[0].time_approval_limit}</Text>
                </View>
                <View>
                  <Text>{row.saving_product[0].id_master_cash}</Text>
                  <Rtext h4>{'Rp. ' + row.saving_product[0].interest_pinalty}</Rtext>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </Fragment>
  );
};

Saving.propTypes = {
  navigator: PropTypes.object,
  componentId: PropTypes.string
}

export default Saving;