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
import { Buttons } from '../../components/button';
import { snackBarWarning } from '../../components/snackBar';
import { Nav } from '../../router/navigator';
import { LoadingOverlay } from '../../components/loading';
import { arkApi } from '../../config/api';

function TermANC(props) {

  const [check, setCheck] = useState(false);
  const [load, setLoad] = useState(false);

  // useEffect(() => {
  //   // alert('budi')
  // }, [])

  const goOTP = async () => {
    try {
      setLoad(true);
      let body = {
        phone: props.payload.phone
      }
      let res = await arkApi({ metod: 'post', svc: 'member', url: 'generateOtpRegister', param: null, body });
      if (res) {
        setLoad(false);
        Nav({ title: 'OTP Verification', page: 'ark.OTP', param: props.payload, ID: props.componentId })
      } else {
        setLoad(false);
        Nav({ title: 'OTP Verification', page: 'ark.OTP', param: props.payload, ID: props.componentId })
      }
    } catch (err) {
      console.log(err)
      setLoad(false);
    }
  }

  return (
    <Fragment>
      <StatusBar barStyle="light-content" />
      <LoadingOverlay loading={load} />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="always" style={Styles.scrollView}>
          <Space size={40} />
          <View style={{
            flex: 1,
            alignItems: 'center'
          }}>
            <Rtext h4>
              Term And Conditions
            </Rtext>
          </View>
          <Space size={20} />
          <View style={{
            margin: 20
          }}>
            <Text style={{
              textAlign: 'center'
            }}>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?
          </Text>
          </View>
          <Space size={20} />
          <View style={{
            marginLeft: 50,
            marginRight: 50
          }}>
            <CheckBox
              center
              title='Click Here'
              checked={check}
              onPress={() => {
                setCheck(!check)
              }}
            />
          </View>
          <Space size={10} />
          <Buttons text={'Next'} onClick={() => {
            if (check) {
              goOTP();
            } else {
              snackBarWarning('Term And Condition Not Accepted');
            }
          }} />
        </ScrollView>
      </SafeAreaView>
    </Fragment>
  );
};

TermANC.propTypes = {
  navigator: PropTypes.object,
  componentId: PropTypes.string
}

export default TermANC;