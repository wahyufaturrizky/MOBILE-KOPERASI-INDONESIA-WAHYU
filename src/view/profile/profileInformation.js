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

function ProfileInformation(props) {

 
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
                Thank you Please Verify your email
              </Text>
            </View>
            <View style={{
              height: 100
            }} >
              <Buttons
                text={'Back To Menu'}
                onClick={() => {
                  setRootTabs({ ID: props.componentId })                  
                }}
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Fragment>
  );
};

ProfileInformation.propTypes = {
  navigator: PropTypes.object,
  componentId: PropTypes.string
}

export default ProfileInformation;