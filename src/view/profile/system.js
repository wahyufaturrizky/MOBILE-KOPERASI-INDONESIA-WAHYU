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
import { setRoot, setRootTabs } from '../../router/navigator';
import { snackBarSuccessOK } from '../../components/snackBar';
import { Navigation } from 'react-native-navigation';

function System(props) {


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
            <View style={{
              height: 100
            }} >
              <Buttons text={'Clear Cache'} menu onClick={() => {
                snackBarSuccessOK('Clear Cache Successfuly');
                Navigation.pop(props.componentId)
              }} />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Fragment>
  );
};

System.propTypes = {
  navigator: PropTypes.object,
  componentId: PropTypes.string
}

export default System;