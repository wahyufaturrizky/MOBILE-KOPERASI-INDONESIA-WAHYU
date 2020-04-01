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
import { HomeHeader } from '../../components/header';
import { Banner, BannerFull } from '../../components/banner';
import { CustomCard } from '../../components/card';
import { RefreshControl } from 'react-native';
import { setStorage } from '../../config/storage';

const banner = [
  {
    image: require('../../assets/images/banner1.jpg')
  },
  {
    image: require('../../assets/images/banner2.jpg')
  },
  {
    image: require('../../assets/images/banner3.webp')
  }
]

function Product(props) {

  const [load, setLoad] = useState(false);
  const [product, setProduct] = useState([]);
  const [cat, setCat] = useState([]);
  const [refreshing, setRefreshing] = useState(false);


  useEffect(() => {
    getProduct();
  }, [])

  function getSugestion(data){
    let sugestion = []
    for(let i in data){
      if(Number(i) < 2){
        sugestion.push(data[i])
      }
    }
    setStorage('sugestion', sugestion);
  }

  function getCategory(data) {
    let newCat = []
    for (let i in data) {
      if (i === '0') {
        newCat.push(data[i].categories[0])
      } else {
        let x = 1;
        for (let j in newCat) {
          if (newCat[j].category_id === data[i].categories[0].category_id) {
            x = x * 0
          } else {
            x = x * 1
          }
          if (x === 1) {
            newCat.push(data[i].categories[0])
          }
        }
      }
    }
    setCat(newCat)
    setRefreshing(false)
  }

  const getProduct = async () => {
    try {
      // setLoad(true);
      let res = await arkApi({ metod: 'get', svc: 'product', url: 'getProduct', param: null, body: null });
      if (res) {
        setProduct(res);
        getSugestion(res);
        getCategory(res);        
        setLoad(false);
      } else {
        setLoad(false);
      }
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
        <HomeHeader ID={props.componentId} title={'Home'} onPress={() => {
          Nav({ title: 'Search', page: 'ark.SearchPage', param: null, ID: props.componentId, header: false })
        }} />
        <ScrollView
          contentInsetAdjustmentBehavior="always"
          style={[Styles.body, {
            // backgroundColor: 'red'
          }]} refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={getProduct} />
          }>
          <Banner data={banner} height={170} />
          <Space size={20} />
          <Text h4 style={{
            marginLeft: 20,
            color: Colors.dark
          }}>Pilih Kategori</Text>
          <View style={{
            margin: 20
          }}>
            <View style={{
              flex: 1,
              flexWrap: 'wrap',
              flexDirection: 'row',
            }}>
              {cat.map((row, index) => (
                <TouchableOpacity style={{
                  padding: 10
                }} onPress={()=> {
                  Nav({ title: 'Search', page: 'ark.SearchProduct', param: { search: row.category_name, payload: product }, ID: props.componentId, header: false })
                }}>
                  <View style={{
                    width: 50,
                    height: 50,
                    borderRadius: 100,
                    backgroundColor: Colors.primary,
                    margin: 5
                  }} />
                  <Text style={{
                    textAlign: 'center',
                    fontWeight: 'bold'
                  }}>{row.category_name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <Space size={20} />
          <BannerFull data={banner} height={100} />
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
                row={row}
                key={index.toString()}
                name={row.name}
                image={row.brand_image}
                discount={index % 2 === 2 ? 10 : false}
                price={row.base_price}
                store={row.store_front} />
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </Fragment>
  );
};

Product.propTypes = {
  navigator: PropTypes.object,
  componentId: PropTypes.string
}

export default Product;