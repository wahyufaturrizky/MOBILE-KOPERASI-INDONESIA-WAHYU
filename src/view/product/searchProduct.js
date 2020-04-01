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
  ImageBackground,
  TextInput
} from 'react-native';
import { Styles, deviceWidth, deviceHeight } from '../../styles';
import { containerStyles } from '../../styles/container';
import { Colors } from '../../styles/colors'
import { Space } from '../../components/container';
import { LoadingOverlay } from '../../components/loading';
import { resValid } from '../../config/validator';
import { Buttons, HeaderIcon } from '../../components/button';
import { Nav } from '../../router/navigator';
import { Navigation } from 'react-native-navigation';
import { arkApi } from '../../config/api';
import { HomeHeader } from '../../components/header';
import { Banner, BannerFull } from '../../components/banner';
import { CustomCard } from '../../components/card';
import { textStyles } from '../../styles/text';

function SearchProduct(props) {

  const [load, setLoad] = useState(false);
  const [search, setSearch] = useState('');
  const [product, setProduct] = useState([])

  const getData = () => {
    setSearch(props.search);
    setProduct(props.payload)
  }

  useEffect(() => {
    getData()
  }, [])

  const doSearch = async () => {
    try {
      alert('sip')
      // setLoad(true);
      // let res = await arkApi({ metod: 'get', svc: 'product', url: 'getProduct', param: search, body: null });
      // if (res) {
      //   setProduct(res)
      //   setLoad(false);
      // } else {
      //   setLoad(false);
      // }
      // setListBillers(dummy)
    } catch (err) {
      console.log(err)
      setLoad(false);
    }
  }

  return (
    <Fragment>
      <LoadingOverlay loading={load} />
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={{
        flex: 1
      }}>
        <Header
          backgroundColor={Colors.primary}
          containerStyle={{
            height: deviceHeight / 6.75,
            marginBottom: -5,
            borderBottomWidth: 5,
            flexDirection: 'row',
            marginTop: -25
          }}
          leftComponent={
            <View style={[containerStyles.leftRow, {
              width: deviceWidth - 120,
            }]}>
              <Icon
                containerStyle={{
                  marginLeft: 5,
                  marginRight: 20
                }}
                name='md-arrow-back'
                type='ionicon'
                onPress={()=>{
                  Navigation.pop(props.componentId)
                }}
                color={Colors.light}
              />
              <View style={{
                borderRadius: 10,
                width: deviceWidth - 130,
                borderColor: Colors.grey,
                backgroundColor: Colors.light,
                flexDirection: 'row',
                alignItems: 'center'
              }}>
                <Icon
                  name='ios-search'
                  type={'ionicon'}
                  color={Colors.primary}
                  iconStyle={{
                    padding: 10
                  }}
                  size={20} />
                <TextInput style={{
                  width: '100%',
                  height: '100%',
                  padding: 5
                }} value={search} onChangeText={(e) => {
                  setSearch(e)
                }}
                  // onBlur={() => {
                  //   doSearch();
                  // }}
                />
              </View>
            </View>
          }
          rightComponent={
            <TouchableOpacity style={containerStyles.centerRow} onPress={()=>{
              Navigation.pop(props.componentId)
            }}>
              <Text style={[textStyles.h3, {
                color: Colors.light
              }]}>Batalkan</Text>
            </TouchableOpacity>
          }
        />
        <ScrollView
          contentInsetAdjustmentBehavior="always"
          style={[Styles.body, {
            // backgroundColor: 'red'
          }]}>
          <Space size={20} />
          <View style={{
            flexWrap: 'wrap',
            flexDirection: 'row',
            flex: 1,
            margin: 10
          }}>
            {product.map((row, index) => (
              <CustomCard
                onPress={() => {
                  Nav({ title: 'Detail Product', page: 'ark.DetailProduct', param: row, ID: props.componentId, header: false })
                }}
                key={index.toString()}
                name={row.name}
                row={row}
                image={row.brand_image}
                discount={index % 2 === 2 ? 10 : false}
                price={row.base_price}
                store={row.store_front} />
            ))}
          </View>
          <Space size={20} />
        </ScrollView>
      </SafeAreaView>
    </Fragment>
  );
};

SearchProduct.propTypes = {
  navigator: PropTypes.object,
  componentId: PropTypes.string
}

export default SearchProduct;