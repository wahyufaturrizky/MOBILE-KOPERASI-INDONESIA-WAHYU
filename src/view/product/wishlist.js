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
import { IDR } from '../../helper/numberFormat';


function WishList(props) {

  const [load, setLoad] = useState(false);
  const [search, setSearch] = useState('');
  const [product, setProduct] = useState([]);
  const [master, setMaster] = useState([]);
  const [mode, setMode] = useState(true);

  const getData = async () => {
    try {
      setLoad(true);
      let res = await arkApi({ metod: 'get', svc: 'product', url: 'wishlist', param: search, body: null });
      if (res) {
        setProduct(res)
        // setMaster(res)
        setLoad(false);
      } else {
        setLoad(false);
      }
    } catch (err) {
      console.log(err)
      setLoad(false);
    }
  }

  useEffect(() => {
    getData()
  }, [])

  const doSearch = () => {
    try {
      // let data = master.find(row => row.name === search);      
      // setProduct(data)
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
                onPress={() => {
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
                  setSearch(e);
                  if (e.length >= 3) {
                    // doSearch();
                  } else {
                    setProduct(master)
                  }
                }}
                />
              </View>
            </View>
          }
          rightComponent={
            <TouchableOpacity style={containerStyles.centerRow} onPress={() => {
              setMode(!mode)
            }}>
              <Icon
                name={mode ? 'ios-list-box' : 'ios-list'}
                type={'ionicon'}
                color={Colors.light}
                iconStyle={{
                  padding: 10
                }}
                size={30} />
            </TouchableOpacity>
          }
        />
        <ScrollView
          contentInsetAdjustmentBehavior="always"
          style={[Styles.body, {
            // backgroundColor: 'red'
          }]}>
          <Space size={10} />
          <View style={{
            flexWrap: 'wrap',
            flexDirection: mode ? 'row' : 'column',
            flex: 1,
            margin: 10
          }}>
            {product.map((row, index) => (
              mode ? (
                <CustomCard
                  onPress={() => {
                    Nav({ title: 'Detail Product', page: 'ark.DetailProduct', param: row, ID: props.componentId, header: false })
                  }}
                  key={index.toString()}
                  row={row}
                  name={row.name}
                  image={row.brand_image}
                  discount={index % 2 === 2 ? 10 : false}
                  price={row.base_price}
                  store={row.store_front} />
              ) : (
                  <TouchableOpacity
                    style={[containerStyles.betweenRow, {
                      borderWidth: 1,
                      borderRadius: 15,
                      shadowColor: Colors.dark,
                      shadowOffset: {
                        width: 0,
                        height: 6,
                      },
                      shadowOpacity: 0.37,
                      shadowRadius: 7.49,
                      elevation: 12,
                      backgroundColor: Colors.light,
                      margin: 10,
                    }]}
                  >
                    <View style={{
                      flex: 1,
                    }}>
                      <Image style={{
                        height: '100%',
                        width: '100%',
                        borderTopLeftRadius: 15,
                        borderBottomLeftRadius: 15
                      }} source={{ uri: row.brand_image }} />
                    </View>
                    <View style={{
                      flex: 3,
                      padding: 10,
                      marginLeft: 5,
                      flexDirection: 'column',
                    }}>
                      <Text style={textStyles.title}>{row.name}</Text>
                      <Text h3>{IDR(row.sell_price)}</Text>
                      <Space size={10} />
                      <Text style={{
                        fontWeight: 'bold',
                        fontSize: 16
                      }}>{row.store_front}</Text>
                    </View>
                  </TouchableOpacity>
                )
            ))}
          </View>
          <Space size={20} />
        </ScrollView>
      </SafeAreaView>
    </Fragment>
  );
};

WishList.propTypes = {
  navigator: PropTypes.object,
  componentId: PropTypes.string
}

export default WishList;