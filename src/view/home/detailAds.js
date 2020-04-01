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
  Image
} from 'react-native';
import { Styles, deviceHeight } from '../../styles';
import { Buttons } from '../../components/button';
import { Space } from '../../components/container';
import { setRoot } from '../../router/navigator';
import { Colors } from '../../styles/colors';

function DetailAds(props) {

  // useEffect(() => {

  // }, [])

  return (
    <Fragment>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={{
        flex: 1,
        backgroundColor: Colors.light
      }}>
        <View style={{
          flex: 1,
        }}>
          <Image style={{
            flex: 1,
            margin: 20,
            borderRadius: 30
          }} source={props.image} />
        </View>
      </SafeAreaView>
    </Fragment>
  );
};

DetailAds.propTypes = {
  navigator: PropTypes.object,
  componentId: PropTypes.string
}

export default DetailAds;