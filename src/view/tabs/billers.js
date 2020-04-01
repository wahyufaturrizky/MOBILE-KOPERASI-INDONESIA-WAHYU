import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Header, Icon, SearchBar, colors, Text } from 'react-native-elements'
import {
  SafeAreaView,
  ScrollView,
  View,
  StatusBar,
  Image,
  TouchableOpacity,
  ImageBackground
} from 'react-native';
import { Styles, deviceWidth } from '../../styles';
import { containerStyles } from '../../styles/container';
import { Colors } from '../../styles/colors'
import { Space } from '../../components/container';
import { LoadingOverlay } from '../../components/loading';
import { resValid } from '../../config/validator';
import { Buttons, HeaderIcon } from '../../components/button';
import { Nav } from '../../router/navigator';
import { Navigation } from 'react-native-navigation';
import { arkApi } from '../../config/api';


function Billers(props) {

  const [load, setLoad] = useState(false);
  const [listBillers, setListBillers] = useState([]);

  useEffect(() => {
    getBillers();
  }, [])

  const getBillers = async () => {
    try {

      setLoad(true);
      let res = await arkApi({ metod: 'get', svc: 'product', url: 'billers', param: null, body: null });
      if (res) {
        setLoad(false);
        // alert(JSON.stringify(res))
        // setListBillers(res)
      }
      // setListBillers(dummy)
    } catch (err) {
      console.log(err)
      setLoad(false);
    }
  }

  const CardBillers = (props) => {
    return (
      <TouchableOpacity style={{
        flex: 1,
        backgroundColor: Colors.grey,
        borderColor: Colors.dark,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
        height: 140,
        borderRadius: 10
      }} onPress={() => {
        // Nav({ title: 'Balance', page: 'ark.Balance', param: null, ID: props.componentId })
      }}>
        <ImageBackground
          source={{ uri: props.image }}
          style={{ 
            width: '100%', 
            height: '100%' ,
            flex: 1,
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'flex-end',
          }}
        >
          <View style={{
            padding: 10
          }}>
          <Text h3 style={{
            color: Colors.danger,
          }}>{props.name}</Text>
          <Text h4 style={{
            color: Colors.light
          }}>{props.desc}</Text>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    )
  }


  return (
    <Fragment>
      {/* <LoadingOverlay loading={load} /> */}
      <StatusBar barStyle="light-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="always" style={Styles.scrollView}>
          <Space size={10} />
          {listBillers.map((row, index) => (
            <CardBillers name={row.name} desc={row.desc[0].val} image={row.brand.img.src} key={index.toString()} />
          ))}
        </ScrollView>
      </SafeAreaView>
    </Fragment>
  );
};

Billers.propTypes = {
  navigator: PropTypes.object,
  componentId: PropTypes.string
}

export default Billers;