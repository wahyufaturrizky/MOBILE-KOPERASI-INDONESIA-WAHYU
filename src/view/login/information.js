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
import { Styles, deviceHeight } from '../../styles';
import { Buttons } from '../../components/button';
import { Space } from '../../components/container';
import { setRoot } from '../../router/navigator';

function Information(props) {

  // useEffect(() => {

  // }, [])

  function backLogin() {
    setRoot({ title: 'Login', page: 'ark.Login', param: {}, ID: props.componentId })
  }

  return (
    <Fragment>
      <StatusBar barStyle="light-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="always" style={Styles.scrollView}>
          <View style={{
            height: deviceHeight - 120,
            flex: 1,
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: 'column'
          }}>
            <View>
              <Space size={100} />
              <Text style={{
                padding: 30,
                textAlign: 'center',
                fontWeight: 'bold',
                fontSize: 14
              }}>
                {props.information}
              </Text>
            </View>
            <View style={{
              height: 100
            }} >
              <Buttons
                text={'Back To Login'}
                onClick={() => {
                  backLogin();
                }}
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Fragment>
  );
};

Information.propTypes = {
  navigator: PropTypes.object,
  componentId: PropTypes.string
}

export default Information;