import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Text, Icon, Button, CheckBox } from 'react-native-elements';
import ImagePicker from 'react-native-image-picker';
import {
  SafeAreaView,
  ScrollView,
  View,
  StatusBar,
  Image,
  Picker,
  RefreshControl,
  TouchableOpacity
} from 'react-native';

import { Styles, deviceHeight } from '../../styles';
import { textStyles } from '../../styles/text';
import { Colors } from '../../styles/colors';
import { InputLogin, InputImage } from '../../components/textInput';
import { Buttons, CustomButton } from '../../components/button';
import { Space } from '../../components/container';
import logo from '../../assets/images/initial-profile.png'
import { arkFormPost, arkApi } from '../../config/api';
import { Nav } from '../../router/navigator';
import { LoadingOverlay } from '../../components/loading';
import { snackBarSuccessOK, snackBarWarning } from '../../components/snackBar';
import { resValid, reqOtpValid } from '../../config/validator';
import img from '../../assets/images/chuwi.jpg'
import { containerStyles } from '../../styles/container';
import { IDR } from '../../helper/numberFormat';
import { Navigation } from 'react-native-navigation';
import { setStorage } from '../../config/storage';

const dummy = [
  {
    "_id": "5e21b895b85f0000bb0060e2",
    "id_user": "1CE86F60-2B7B-11EA-A2B5-B7974A4CF7CA",
    "id_product": "offline",
    "id_product_ark": "5e2132db4d7f000011006fe3",
    "id_master": "offline",
    "product_name": "Ayam Bakar 1",
    "sell_price": "10000",
    "id_master_type": "product",
    "item_code": "Ayam Bakar",
    "store_front": "bukan jakarta",
    "store_location": {
      "lat": "0",
      "lng": "0",
      "description": "store location"
    },
    "channel": {
      "channel_id": "CHN-0000",
      "channel_name": "Offline",
      "channel_image": "https://www.metranet.co.id/wp-content/uploads/2019/06/Metranet.png"
    },
    "id_holding": 26,
    "created_by": "1CE86F60-2B7B-11EA-A2B5-B7974A4CF7CA",
    "updated_at": "2020-01-17 20:37:25",
    "created_at": "2020-01-17 20:37:25"
  },
  {
    "_id": "5e21b8a1b85f0000bb0060e3",
    "id_user": "1CE86F60-2B7B-11EA-A2B5-B7974A4CF7CA",
    "id_product": "offline",
    "id_product_ark": "5e2132db4d7f000011006fe3",
    "id_master": "offline",
    "product_name": "Ayam Bakar Madu",
    "sell_price": "20000",
    "id_master_type": "product",
    "item_code": "Ayam Bakar",
    "store_front": "Jakarta",
    "store_location": {
      "lat": "0",
      "lng": "0",
      "description": "store location"
    },
    "channel": {
      "channel_id": "CHN-0000",
      "channel_name": "Offline",
      "channel_image": "https://www.metranet.co.id/wp-content/uploads/2019/06/Metranet.png"
    },
    "id_holding": 26,
    "created_by": "1CE86F60-2B7B-11EA-A2B5-B7974A4CF7CA",
    "updated_at": "2020-01-17 20:37:37",
    "created_at": "2020-01-17 20:37:37"
  },
  {
    "_id": "5e21b8a1b85f0000bb0060e3",
    "id_user": "1CE86F60-2B7B-11EA-A2B5-B7974A4CF7CA",
    "id_product": "offline",
    "id_product_ark": "5e2132db4d7f000011006fe3",
    "id_master": "offline",
    "product_name": "Ayam Goyeng",
    "sell_price": "15000",
    "id_master_type": "product",
    "item_code": "Ayam Goreng",
    "store_front": "Jakarta",
    "store_location": {
      "lat": "0",
      "lng": "0",
      "description": "store location"
    },
    "channel": {
      "channel_id": "CHN-0000",
      "channel_name": "Offline",
      "channel_image": "https://www.metranet.co.id/wp-content/uploads/2019/06/Metranet.png"
    },
    "id_holding": 26,
    "created_by": "1CE86F60-2B7B-11EA-A2B5-B7974A4CF7CA",
    "updated_at": "2020-01-17 20:37:37",
    "created_at": "2020-01-17 20:37:37"
  }
];

function Cart(props) {

  const [load, setLoad] = useState(false);
  const [check, setCheck] = useState(false);
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [count, setCount] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  function wait(timeout) {
    return new Promise(resolve => {
      setTimeout(resolve, timeout);
    });
  }

  const onRefresh = () => {
    getCart(true);
    // translate(dummy)
  }

  const getCart = async (flag) => {
    try {
      setLoad(true);
      let res = await arkApi({ metod: 'get', svc: 'product', url: 'cart', param: null, body: null });
      if (res) {
        setCart([])
        if (res.length !== 0) {
          translate(res)
        }
        if (flag) {
          setRefreshing(false)
        }
        setLoad(false);
      } else {
        setLoad(false);
      }
    } catch (err) {
      console.log('skskksskkskskkskskskskkskskskkskskks')
      console.log(err)
      setLoad(false);
    }
  }

  const doPayment = () => {
    let newCart = [];
    for (let i in cart) {
      let product = []
      for (let j in cart[i].product) {
        if (cart[i].product[j].check) {
          product.push(cart[i].product[j])
        }
      }
      if (product.length > 0) {
        newCart.push({
          store_front: cart[i].store_front,
          id_product_ark: cart[i].id_product_ark,
          check: cart[i].check,
          product
        })
      }
    }
    // console.log(newCart)
    if (newCart.length < 1) {
      snackBarWarning('Barang Yang DI Checklist Tidak Boleh Kosong')
    } else {
      setStorage('cart', newCart)
      Nav({ title: 'Konfirmasi Belanja', page: 'ark.PaymentAddress', param: null, ID: props.componentId })
    }
  }

  const delCart = async (id) => {
    try {
      setLoad(true);
      let res = await arkApi({ metod: 'delete', svc: 'product', url: 'delCart', param: id, body: null });
      if (res) {
        getCart()
        setLoad(false);
      } else {
        getCart()
        setLoad(false);
      }
    } catch (err) {
      getCart()
      setLoad(false);
    }
  }

  const deleteAll = async () => {
    console.log(cart)
    for (let i in cart) {
      for (let j in cart[i].product) {
        if (cart[i].product[j].check) {
          delCart(cart[i].product[j]._id)
        }
      }
    }
  }

  const calculation = (item) => {
    let calc = 0;
    let count = 0;
    for (let i in item) {
      for (let j in item[i].product) {
        if (item[i].product[j].check) {
          count += item[i].product[j].amount
          calc += item[i].product[j].sell_price * item[i].product[j].amount;
        }
      }
    }
    setTotal(calc)
    setCount(count)
  }

  function groupBy(OurArray, property) {
    return OurArray.reduce(function (accumulator, object) {
      // get the value of our object(age in our case) to use for group    the array as the array key   
      const key = object[property];
      // if the current value is similar to the key(age) don't accumulate the transformed array and leave it empty  
      if (!accumulator[key]) {
        accumulator[key] = [];
      }
      // add the value to the array
      accumulator[key].push(object);
      // return the transformed array
      return accumulator;
      // Also we also set the initial value of reduce() to an empty object
    }, {});
  }

  const translate = (data) => {
    let newData = [];
    const sort = groupBy(data, 'store_front')
    const key = Object.keys(sort);
    for (let i in key) {
      let row = sort[key[i]];
      for (let j in row) {
        row[j].check = false;
        row[j].amount = 1;
        row[j].favorite = false;
      }
      // sort[key[i]].childCheck = true;
      newData.push({
        product: row,
        store_front: row[0].store_front,
        id_product_ark: row[0].id_product_ark,
        check: false,
      })
    }
    setCart(newData)
    calculation(newData)
  }

  useEffect(() => {
    getCart()
  }, [])

  const ChildOrder = (props) => {
    const row = props.row
    const index = props.index
    const cIndex = props.cIndex
    return (
      <View style={{
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        marginTop: 20
      }}>
        <View style={{
          flex: 1
        }}>
          <CheckBox
            center
            containerStyle={{
              marginRight: -20
            }}
            checked={row.check}
            onPress={() => {
              let newData = [...cart]
              newData[index].product[cIndex].check = !newData[index].product[cIndex].check
              setCart(newData)
              calculation(newData)
            }}
          />
        </View>
        <Image
          style={{
            flex: 2,
            width: '100%',
            height: '80%',
            borderRadius: 15,
            resizeMode: 'contain',
            backgroundColor: Colors.lightGrey,
            borderColor: Colors.grey,
            borderWidth: 1,
            marginHorizontal: 10
          }}
          source={{ uri: row.channel.channel_image }}
        />
        <View style={{
          flex: 4,
          marginLeft: 10,
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'flex-start'
        }}>
          <Text style={textStyles.title}>{row.product_name}</Text>
          <Text h4>{IDR(row.sell_price)}</Text>
          <Space size={20} />
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
          }}>
            <Icon
              name='ios-remove-circle'
              type={'ionicon'}
              containerStyle={{
                marginRight: 10
              }}
              color={Colors.primary}
              iconStyle={{
                fontSize: 30
              }}
              size={15}
              onPress={() => {
                if (!row.check) {
                  snackBarWarning('Check List Product Terlebih dahulu')
                } else {
                  let newData = [...cart]
                  if (newData[index].product[cIndex].amount > 0) {
                    newData[index].product[cIndex].amount -= 1
                    setCart(newData)
                    calculation(newData)
                  }
                }
              }} />
            <Text h4>{row.amount}</Text>
            <Icon
              name='ios-add-circle'
              type={'ionicon'}
              color={Colors.primary}
              iconStyle={{
                fontSize: 30
              }}
              containerStyle={{
                marginHorizontal: 10
              }}
              size={15}
              onPress={() => {
                if (!row.check) {
                  snackBarWarning('Check List Product Terlebih dahulu')
                } else {
                  let newData = [...cart]
                  newData[index].product[cIndex].amount += 1
                  setCart(newData)
                  calculation(newData)
                }
              }} />
            <Text style={{
              fontSize: 30,
              marginTop: -2
            }}>|</Text>
            <Icon
              name='ios-heart'
              type={'ionicon'}
              containerStyle={{
                marginHorizontal: 10
              }}
              color={Colors.primary}
              iconStyle={{
                fontSize: 30
              }}
              size={15}
              onPress={() => {
              }} />
            <Icon
              name='ios-trash'
              type={'ionicon'}
              containerStyle={{
                marginRight: 10
              }}
              color={Colors.primary}
              iconStyle={{
                fontSize: 30
              }}
              size={15}
              onPress={() => {
                // alert(row._id)
                delCart(row._id)
              }} />
          </View>
        </View>
      </View>
    )
  }

  const ListOrder = (props) => {
    const row = props.row
    const index = props.index
    return (
      <View key={index.toString()}>
        <View>
          <View style={containerStyles.leftRow}>
            <CheckBox
              containerStyle={{
                width: 20,
                borderWidth: 0,
                marginRight: 30
              }}
              textStyle={textStyles.title}
              checked={row.check}
              onPress={() => {
                let newData = [...cart]
                newData[index].check = !newData[index].check;
                for (let j in newData[index].product) {
                  newData[index].product[j].check = newData[index].check;
                }
                setCart(newData)
                calculation(newData)
              }}
            />
            <Icon
              name='ios-home'
              type={'ionicon'}
              containerStyle={{
                // marginRight: 30
              }}
              color={Colors.primary}
              iconStyle={{
                fontSize: 30
              }}
              size={20}
            />
            <Text style={[textStyles.title, {
              marginLeft: 5
            }]}>{row.store_front}</Text>
          </View>
          <Text style={{
            marginLeft: 60
          }}>{row.product[0].store_location.description}</Text>
        </View>
        {row.product.map((item, cIndex) => (
          <ChildOrder index={index} cIndex={cIndex} row={item} />
        ))}
      </View>
    )
  }

  return (
    <Fragment>
      <LoadingOverlay loading={load} />
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={{
        flex: 1
      }}>
        <ScrollView
          contentInsetAdjustmentBehavior="always" style={Styles.body}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          } >
          <Space size={10} />
          <View style={[containerStyles.betweenRow, {
            borderBottomWidth: 1,
            borderColor: Colors.grey,
          }]}>
            <CheckBox
              title={'Semua'}
              containerStyle={{
                width: 200,
                borderWidth: 0,
                paddingVertical: 20
              }}
              textStyle={textStyles.title}
              checked={check}
              onPress={() => {
                setCheck(!check)
                let newData = [...cart];
                for (let i in newData) {
                  newData[i].check = !check
                  for (let j in newData[i].product) {
                    newData[i].product[j].check = !check
                  }
                }
                setCart(newData)
                calculation(newData)
              }}
            />
            <Icon
              name='ios-trash'
              type={'ionicon'}
              containerStyle={{
                marginRight: 30
              }}
              color={Colors.primary}
              iconStyle={{
                fontSize: 30
              }}
              size={30}
              onPress={() => {
                deleteAll()
              }} />
          </View>
          {cart.map((row, index) => (
            <ListOrder index={index} row={row} />
          ))}
          <Space size={100} />
        </ScrollView>
        <View style={[{
          width: '100%',
          position: 'absolute',
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
          <View style={{
            paddingHorizontal: 30
          }}>
            <Text h4>Total Tagihan</Text>
            <Text style={{
              fontWeight: 'bold'
            }}>{IDR(total)}</Text>
          </View>
          <View style={{
            flex: 1
          }}>
            <CustomButton
              color={Colors.danger}
              title={'Beli (' + count + ' )'}
              onPress={() => {
                doPayment()
              }}
            />
          </View>
        </View>
      </SafeAreaView>
    </Fragment>
  );
};

Cart.propTypes = {
  navigator: PropTypes.object,
  componentId: PropTypes.string
}

export default Cart;
