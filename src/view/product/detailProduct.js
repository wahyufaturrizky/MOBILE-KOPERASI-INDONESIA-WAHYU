import React, { Fragment, useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import PropTypes from 'prop-types';
import { CheckBox, Text as Rtext, Button, Header } from 'react-native-elements'
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity
} from 'react-native';
import { Styles, deviceHeight, deviceWidth } from '../../styles';
import { Colors } from '../../styles/colors';
import { containerStyles } from '../../styles/container';
import { textStyles } from '../../styles/text';
import { Space } from '../../components/container';
import { Buttons, HeaderIcon, CustomButton } from '../../components/button';
import { snackBarWarning, snackBarError, snackBarSuccess, snackBarSuccessOK } from '../../components/snackBar';
import { Nav } from '../../router/navigator';
import { getStorage } from '../../config/storage';
import { BannerFull } from '../../components/banner';
import { IDR } from '../../helper/numberFormat';
import { ProductHeader } from '../../components/header';
import config from '../../config/device.json';
import { arkApi } from '../../config/api';
import { LoadingOverlay } from '../../components/loading';

function DetailProduct(props) {

  const [header, setHeader] = useState(false);
  const [qty, setQty] = useState(0);
  const [load, setLoad] = useState(false);
  const [myWishList, setMyWishList] = useState([]);
  const [wish, setWish] = useState(false);
  const [banner, setBanner] = useState([]);
  const [idWish, setIdWish] = useState('');

  useEffect(() => {
    getWishlist()
    getBanner()
  }, [])

  const getBanner = () => {
    let newBanner = [];
    let data = props.assets.images;
    for(let i in data){
      newBanner.push({
        image: {uri: data[i].src}
      })
    }
    setBanner(newBanner)
  }

  const isWishlist = (data) => {
    let newData = data.filter(function(row) {
      return row.id_product === props.id_product;
    });
    if(newData.length > 0){
      setWish(true)
      setIdWish(newData[0]._id)
    }
  }

  const getWishlist = async () => {
    try {
      setLoad(true);      
      let res = await arkApi({ metod: 'get', svc: 'product', url: 'wishlist', param: null, body: null });
      if (res) {
        setMyWishList(res);
        isWishlist(res)
        setLoad(false);
      } else {
        setLoad(false);
      }
    } catch (err) {
      console.log(err)
      setLoad(false);
    }
  }

  const deleteWishlist = async () => {
    try {
      setWish(false)
      setLoad(true);     
      let res = await arkApi({ metod: 'delete', svc: 'product', url: 'deleteWishlist', param: idWish, body: null });
      if (res) {
        snackBarSuccessOK('Berhasil Menghapus Wishlist')
        setLoad(false);
      } else {
        setLoad(false);
      }
    } catch (err) {
      console.log(err)
      setLoad(false);
    }
  }

  const addWishlist = async (ID) => {
    try {
      setWish(true)
      setLoad(true);
      let body = {
        id_product: ID
      }
      let res = await arkApi({ metod: 'post', svc: 'product', url: 'wishlist', param: null, body });
      if (res) {
        snackBarSuccessOK('Berhasil menambahkan kedalam wishlist')
        getWishlist()
        setLoad(false);
      } else {
        setLoad(false);
      }
    } catch (err) {
      console.log(err)
      setLoad(false);
    }
  }

  const doCart = async (goCart) => {
    try {
      setLoad(true);
      let body = {
        id_holding: config.id_holding,
        id_product_ark: props._id
      }
      let res = await arkApi({ metod: 'post', svc: 'product', url: 'saveCart', param: null, body });
      if (res) {
        if (goCart) {
          Nav({ title: 'Keranjang Belanja', page: 'ark.Cart', param: null, ID: props.componentId })
        } else {
          snackBarSuccessOK('success added cart');
        }
        setLoad(false);
      } else {
        setLoad(false);
      }
    } catch (err) {
      alert(JSON.stringify(err))
      setLoad(false);
    }
  }

  const getPosition = (event) => {
    if (event.nativeEvent.contentOffset.y >= deviceHeight / 2) {
      setHeader(true)
    } else {
      setHeader(false)
    }
  }

  return (
    <Fragment>
      <LoadingOverlay loading={load} />      
      <StatusBar barStyle="light-content" />
      {header ? (
        <ProductHeader title={props.name} ID={props.componentId} />
      ) : (
          <View />
        )}
      <SafeAreaView style={{
        flex: 1
      }}>
        <ScrollView
          contentInsetAdjustmentBehavior="always"
          style={Styles.body}
          onScroll={event => {
            getPosition(event)
          }}
        >
          <BannerFull data={banner} height={deviceHeight / 2} />
          <View style={{
            margin: 20
          }}>
            <View style={containerStyles.betweenRow}>
              <View>
                <Text style={textStyles.title}>{props.name}</Text>
              </View>
              <TouchableOpacity style={{
                padding: 5,
                height: 60,
                width: 60,
                marginRight: 10,
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
              }} onPress={() => {
                if(wish){
                  deleteWishlist()
                  // snackBarWarning('Kamu telah menambahkan kedalam wishlist')
                } else {
                  addWishlist(props._id)
                }
              }}>
                <Icon
                  name={wish ? 'ios-heart' : 'ios-heart-empty'}
                  type={'ionicon'}
                  color={Colors.danger}
                  iconStyle={{
                    padding: 10
                  }}
                  size={40} />
              </TouchableOpacity>
            </View>
            <View style={containerStyles.leftRow}>
              <Text style={textStyles.h1}>{IDR(props.base_price)}</Text>
            </View>
          </View>
          <View style={[containerStyles.centerRow, {
            padding: 10,
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderColor: Colors.grey,
            marginVertical: 20
          }]}>
            <View style={containerStyles.centerColumn}>
              <Text style={textStyles.h3}>Penilaian</Text>
              <View style={containerStyles.centerRow}>
                <Icon
                  name='ios-star'
                  type={'ionicon'}
                  color={Colors.danger}
                  iconStyle={{
                    padding: 10
                  }}
                  size={20} />
                <Text style={{
                  fontWeight: 'bold',
                  marginLeft: 5
                }}>0</Text>
              </View>
            </View>
            <View style={containerStyles.centerColumn}>
              <Text style={textStyles.h3}>Kondisi</Text>
              <View style={containerStyles.centerRow}>
                <Text style={{
                  fontWeight: 'bold',
                  marginLeft: 5
                }}>Baru</Text>
              </View>
            </View>
            <View style={containerStyles.centerColumn}>
              <Text style={textStyles.h3}>Stock</Text>
              <View style={containerStyles.centerRow}>
                <Text style={{
                  fontWeight: 'bold',
                  marginLeft: 5
                }}>{props.stock}</Text>
              </View>
            </View>
            <View style={containerStyles.centerColumn}>
              <Text style={textStyles.h3}>Terjual</Text>
              <View style={containerStyles.centerRow}>
                <Text style={{
                  fontWeight: 'bold',
                  marginLeft: 5
                }}>0</Text>
              </View>
            </View>
          </View>
          {/* <View style={[{
            paddingHorizontal: 20,
            paddingTop: 10,
            paddingBottom: 20,
            borderColor: Colors.grey,
            borderBottomWidth: 1
          }, containerStyles.betweenRow]}>
            <Text style={textStyles.h3}>Jumlah</Text>
            <View style={containerStyles.rightRow}>
              <TouchableOpacity style={{
                padding: 5,
                marginRight: 10,
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
                height: 30,
                width: 30,
                borderColor: Colors.dark,
                borderRadius: 100,
                borderWidth: 1,
                marginRight: 10
              }} onPress={() => {
                if (qty >= 1) {
                  setQty(qty - 1)
                }
              }}>
                <Icon
                  name='md-remove'
                  type={'ionicon'}
                  color={Colors.danger}
                  iconStyle={{
                    padding: 10
                  }}
                  size={30} />
              </TouchableOpacity>
              <Text style={[textStyles.h3, {
                borderBottomWidth: 1,
                borderColor: Colors.grey,
                marginHorizontal: 5
              }]}>{qty}</Text>
              <TouchableOpacity style={{
                padding: 5,
                marginRight: 10,
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
                height: 30,
                width: 30,
                borderColor: Colors.dark,
                borderRadius: 100,
                borderWidth: 1,
                marginLeft: 10
              }} onPress={() => {
                if (qty <= props.stock) {
                  setQty(qty + 1)
                }
              }}>
                <Icon
                  name='md-add'
                  type={'ionicon'}
                  color={Colors.danger}
                  iconStyle={{
                    padding: 10
                  }}
                  size={30} />
              </TouchableOpacity>
            </View>
          </View> */}
          <View style={{
            paddingHorizontal: 30,
          }}>
            <View style={[containerStyles.leftRow, {
              padding: 20,
              borderBottomWidth: 1,
              borderColor: Colors.grey
            }]}>
              <View style={{
                width: 40
              }}>
                <Icon
                  name='md-home'
                  type={'ionicon'}
                  color={Colors.danger}
                  iconStyle={{
                    padding: 10
                  }}
                  size={20} />
              </View>
              <View>
                <Text style={textStyles.title}>{props.store_front}</Text>
                <Text>{props.store_location.description}</Text>
              </View>
            </View>
          </View>
          <View style={{
            paddingHorizontal: 30,
          }}>
            <View style={{
              padding: 20,
              borderBottomWidth: 1,
              borderColor: Colors.grey
            }}>
              <Text style={textStyles.h3}>Informasi Produk</Text>
              <Space size={50} />
              <Text>Nama Brand: {props.brand_name}</Text>
              <Text>Kategori : {'props.categories'}</Text>
              <Text>Berat : {props.dimension.weight_gram} gram</Text>
              <Text>Dimensi : {props.dimension.height_cm} x {props.dimension.length_cm} x {props.dimension.width_cm} </Text>
              <Space size={50} />
            </View>
          </View>
          <Space size={100} />
        </ScrollView>
        <View style={[{
          width: '100%',
          position: 'absolute',
          zIndex: 0,
          bottom: 0,
          backgroundColor: Colors.light,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 7,
          },
          shadowOpacity: 0.41,
          shadowRadius: 9.11,
          elevation: 14,
        }, containerStyles.spaceRow]}>
          <TouchableOpacity style={{
            width: 50,
            height: 50,
            borderRadius: 100,
            backgroundColor: Colors.danger,
            alignItems: 'center',
            marginLeft: 20,
            justifyContent: 'center'
          }} onPress={() => {
            doCart(false)
          }}>
            <Icon
              name='ios-cart'
              type={'ionicon'}
              color={Colors.light}
              iconStyle={{
                padding: 10
              }}
              size={30} />
          </TouchableOpacity>
          <View style={{
            flex: 1
          }}>
            <CustomButton
              color={Colors.danger}
              title={'Beli Sekarang'}
              onPress={() => {
                doCart(true)
              }}
            />
          </View>
        </View>
      </SafeAreaView>
    </Fragment>
  );
};

DetailProduct.propTypes = {
  navigator: PropTypes.object,
  componentId: PropTypes.string
}

export default DetailProduct;