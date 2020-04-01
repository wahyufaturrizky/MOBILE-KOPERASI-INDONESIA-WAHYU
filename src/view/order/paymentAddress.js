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
  TouchableOpacity
} from 'react-native';

import { Styles, deviceHeight, deviceWidth } from '../../styles';
import { containerStyles } from '../../styles/container';
import { textStyles } from '../../styles/text';
import { Colors } from '../../styles/colors';
import { InputLogin, InputImage, InputIcon } from '../../components/textInput';
import { Buttons, CustomButton } from '../../components/button';
import { Space } from '../../components/container';
import logo from '../../assets/images/initial-profile.png'
import { arkFormPost, arkApi } from '../../config/api';
import { Nav } from '../../router/navigator';
import { LoadingOverlay } from '../../components/loading';
import { snackBarSuccessOK, snackBarWarning, snackBarError } from '../../components/snackBar';
import { resValid, reqOtpValid } from '../../config/validator';
import img from '../../assets/images/chuwi.jpg'
import { getStorage } from '../../config/storage';
import { IDR } from '../../helper/numberFormat';

function PaymentAddress(props) {

  const [redeem, setRedeem] = useState('');
  const [voc, setVoc] = useState(false);
  const [load, setLoad] = useState(false);
  const [ship, setShip] = useState('');
  const [duration, setDuration] = useState();
  const [address, setAddress] = useState([]);
  const [change, setChange] = useState(false);
  const [allAddress, setAllAddress] = useState([]);
  const [cart, setCart] = useState([]);
  const [kurir, setKurir] = useState([]);
  const [listDur, setListDur] = useState([]);
  const [total, setTotal] = useState([]);
  const [totalAll, setTotalAll] = useState({
    total: 0,
    ongkir: 0,
    count: 0,
    subTotal: 0
  });

  const options = {
    title: 'Select Avatar',
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
  };

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

  const translateKurir = (data) => {
    let newData = [];
    const sort = groupBy(data, 'name_courier')
    const key = Object.keys(sort);
    for (let i in key) {
      let duration = [];
      let row = sort[key[i]];
      console.log(row)
      for (let j in row) {
        duration.push(row[i].duration)
      }
      newData.push({
        kurir: {
          name_courier: row[0].name_courier,
          id_courier: row[0].detail.id_courier,
          duration
        }
      })
      calculate()
      setKurir(newData)
    }
  }

  // asuransi: 1000,
  // check: false,
  // ongkir: 0,
  // price,
  // kurir: '',
  // duration: '',
  // count

  const calculate = () => {
    let calc = 0;
    let ongkir = 0;
    let count = 0;
    console.log('totallllllll')
    console.log(total)
    for (let i in total) {
      calc = calc + total[i].count * total[i].price;
      ongkir = ongkir + total[i].ongkir;
      count = count + total[i].count
    }
    newTotal = { ...totalAll, total: calc, ongkir: ongkir, subTotal: calc + ongkir };
    setTotalAll(newTotal)

  }

  const getCurir = async (id) => {
    try {
      setLoad(true);
      let res = await arkApi({ metod: 'get', svc: 'master', url: 'kurir', param: null, body: null });
      if (res) {
        let data = [];
        for (let i in res) {
          data.push({
            name_courier: res[i].courier.name_courier,
            detail: res[i].courier,
            duration: res[i].duration
          })
        }
        translateKurir(data)
        setLoad(false);
      } else {
        getCart()
        setLoad(false);
      }
    } catch (err) {
      console.log(err)
      setLoad(false);
    }
  }

  const getAddress = async () => {
    const data = await getStorage('user')
    const allAddress = data.user_address;
    let newData = null;
    for (let i in allAddress) {
      if (allAddress[i].is_main_address) {
        newData = allAddress[i];
      }
    }
    setAddress(newData === null ? allAddress[0] : newData)
  }

  const getCart = async () => {
    const data = await getStorage('cart');
    console.log(data);
    let initTotal = []
    let initDur = []
    for (let i in data) {
      let price = 0;
      let count = 0;
      for (let j in data[i].product) {
        price += Number(data[i].product[j].sell_price);
        count += data[i].product[j].amount;
      }
      initTotal.push({
        asuransi: 0,
        check: false,
        ongkir: 0,
        price,
        kurir: '',
        duration: '',
        count,
        detail: {}
      })
      initDur.push([])
    }
    setListDur(initDur)
    setTotal(initTotal);
    setCart(data);
  }

  const getData = () => {
    getAddress()
    getCart()
    getCurir()
  }

  useEffect(() => {
    getData()
  }, [])

  function pushPage(title, page) {
    Nav({ title: title, page, param: null, ID: props.componentId })
  }


  const DetailOrder = (props) => {
    const row = props.row;

    return (
      <View>
        <View style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around',
          marginTop: 20
        }}>
          <View style={{
            flex: 2,
            alignContent: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: Colors.light,
            borderRadius: 10,
            minHeight: 100,
            borderWidth: 2,
            padding: 5,
            borderColor: Colors.grey
          }}>
            <Image
              style={{
                width: '100%',
                height: '100%',
                resizeMode: 'cover'
              }}
              source={{ uri: row.channel.channel_image }}
            />
          </View>
          <View style={{
            flex: 3,
            marginLeft: 10,
            paddingRight: 20,
            flexDirection: 'column',
            alignItems: 'flex-end',
            justifyContent: 'space-between'
          }}>
            <Text style={{
              fontWeight: 'bold',
              fontSize: 18
            }}>{row.store_front}</Text>
            <Space size={10} />
            <Text style={{
              fontWeight: 'bold',
              fontSize: 18
            }}> {IDR(row.sell_price)} x {row.amount}</Text>
          </View>
        </View>
      </View>
    )
  }

  const ListOrder = (props) => {
    const row = props.row;
    const index = props.index;
    return (
      <View>
        <Text style={textStyles.title}>{row.store_front}</Text>
        <Text style={{ fontWeight: 'bold' }}>{row.product[0].store_location.description}</Text>
        <View style={{
          marginVertical: 20
        }}>
          {row.product.map((detail, cIndex) => (
            <DetailOrder row={detail} cIndex={cIndex} index={index} />
          ))}
        </View>
        <View style={{
          margin: 10
        }}>
          <View style={{
            paddingLeft: 5,
            paddingRight: 5,
            borderWidth: 1,
            borderColor: Colors.grey,
            borderRadius: 10,
            width: '80%',
            marginBottom: 20
          }}>
            <Picker
              mode='dropdown'
              selectedValue={total[index].kurir}
              onValueChange={(itemValue, itemIndex) => {
                console.log(itemIndex)
                if (itemValue !== "zzzz") {
                  newListDur = [...listDur];
                  newListDur[index] = kurir[itemIndex - 1].kurir.duration;
                  setListDur(newListDur)
                  newOngkir = [...total];
                  newOngkir[index].ongkir = 0;
                  newOngkir[index].kurir = itemValue
                  newOngkir[index].detail = kurir[itemIndex - 1]
                  setTotal(newOngkir);
                  calculate()
                }
              }
              }>
              <Picker.Item label="Pilih Kurir" value="zzzz" />
              {kurir.map((item, i) => (
                <Picker.Item label={item.kurir.name_courier} value={item.kurir.id_courier} />
              ))}
            </Picker>
          </View>
          <View style={{
            paddingLeft: 5,
            paddingRight: 5,
            borderWidth: 1,
            borderColor: Colors.grey,
            borderRadius: 10,
            width: '80%'
          }}>
            <Picker
              mode='dropdown'
              enabled={false}
              // enabled={listDur.length !== 0}
              selectedValue={total[index].duration}
              onValueChange={(itemValue, itemIndex) => {
                if (itemValue !== "zzzzz") {
                  newOngkir = [...total];
                  newOngkir[index].duration = itemValue
                  setTotal(newOngkir);
                  console.log(newOngkir)
                }
              }
              }>
              {listDur[index].length > 0 ? (
                <Picker.Item label={listDur[index][0].name_courier_duration} value="0" />
              ) : (
                  <Picker.Item label="Pilih Durasi" value="zzzzz" />
                )}
            </Picker>
          </View>
          <View>
            <View style={{
              margin: 20,
              marginBottom: 0
            }}>
              <View style={containerStyles.betweenRow}>
                <Text style={textStyles.subtitle}>Sub Total</Text>
                <Text style={textStyles.subtitle}>{IDR(total[index].price)}</Text>
              </View>
              <View style={containerStyles.betweenRow}>
                <Text style={textStyles.subtitle}>Harga ({row.product.length} barang)</Text>
                <Text style={textStyles.subtitle}>{IDR(total[index].price)}</Text>
              </View>
              <View style={containerStyles.betweenRow}>
                <Text style={textStyles.subtitle}>Ongkos Kirim</Text>
                <Text style={textStyles.subtitle}>{IDR(total[index].ongkir)}</Text>
              </View>
              <View style={containerStyles.betweenRow}>
                <Text style={textStyles.subtitle}>Asuransi</Text>
                <Text style={textStyles.subtitle}>{total[index].check ? IDR(total[index].asuransi) : 0}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    )
  }

  return (
    <Fragment>
      <LoadingOverlay loading={load} />
      <StatusBar barStyle="light-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="always" style={Styles.scrollView}>
          <View>
            <View style={{
              marginVertical: 20
            }}>
              <View style={{
                paddingBottom: 20,
                borderBottomWidth: 1,
                borderColor: Colors.grey,
                marginLeft: 20
              }}>
                <Text h4>Alamat Pengiriman</Text>
              </View>
              <View style={[containerStyles.betweenRow, {
                padding: 20,
              }]}>
                <Text style={{
                  fontWeight: 'bold',
                  fontSize: 16
                }}>( Alamat Pengiriman Utama )</Text>
                <TouchableOpacity onPress={async () => {
                  const data = await getStorage('user')
                  const allAddress = data.user_address;
                  setAllAddress(allAddress);
                  setChange(true)
                }}>
                  <Text style={{
                    color: Colors.grey,
                    fontWeight: 'bold'
                  }}>Ubah Alamat</Text>
                </TouchableOpacity>
              </View>
              {change ? (
                <View style={{
                  margin: 20
                }}>
                  {allAddress.map((row, index) => (
                    <TouchableOpacity style={{
                      padding: 10,
                      backgroundColor: row.address_name === address.address_name ? Colors.primary : Colors.lightGrey
                    }} onPress={() => {
                      setAddress(row)
                      setChange(false)
                    }}>
                      <Text style={textStyles.h3}>{row.address_name}</Text>
                      <Text style={textStyles.h3}>Recieve Name: {row.receiver_name} ( {row.receiver_phone} ), {row.address_text}, {row.city_or_district} ( {row.postal_code} )</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                  <View />
                )}
              <View style={{
                padding: 20,
                borderBottomWidth: 1,
                borderColor: Colors.grey,
              }}>
                <View>
                  <Text style={textStyles.h3}>{address.address_name}</Text>
                  <Text style={textStyles.h3}>Recieve Name: {address.receiver_name} ( {address.receiver_phone} ), {address.address_text}, {address.city_or_district} ( {address.postal_code} )</Text>
                </View>
                <View style={containerStyles.centerRow}>
                  <CustomButton title={'Tambah Alamat'} outline onPress={() => {
                    Nav({ title: 'Tambah Alamat', page: 'ark.DetailAddress', param: { flag: true }, ID: props.componentId })
                  }} />
                  <CustomButton title={'Kirim ke banyak alamat'} color={Colors.danger} />
                </View>
              </View>
              <View style={{
                margin: 20
              }}>
                {cart.map((row, index) => (
                  <ListOrder row={row} index={index} />
                ))}
              </View>
            </View>
            <View style={{
              marginLeft: 200
            }}>
              <CustomButton
                color={Colors.danger}
                title={'Redeem Voucher'}
                onPress={() => {
                  setVoc(true)
                }}
              />
            </View>
            <Space size={20} />
            <View style={{
              marginLeft: 30,
              marginBottom: 30
            }}>
              <Text h4 style={{
                marginBottom: 20
              }}>Ringkasan Belanja</Text>
              <Text>Total Harga ({totalAll.count}) : {IDR(totalAll.total)}</Text>
              <Text>Total Ongkos Kirim : {IDR(totalAll.ongkir)}</Text>
              <Text>Total Promo/Diskon : 0</Text>
            </View>
          </View>
          <Space size={100} />
        </ScrollView>
        {voc ? (
          <View style={{
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
            width: deviceWidth - 40,
            padding: 10,
            position: 'absolute',
            bottom: 100,
            alignSelf: 'center'
          }}>
            <TouchableOpacity style={{
              position: 'absolute',
              top: 0,
              right: 0,
              marginTop: -10,
              marginRight: -5
            }} onPress={() => {
              setVoc(false)
            }}>
              <Icon
                name='ios-close-circle'
                type={'ionicon'}
                color={Colors.danger}
                // iconStyle={{
                //   padding: 50
                // }}
                size={50} />
            </TouchableOpacity>
            <View style={{
              width: '100%'
            }}>
              <InputIcon
                title={'Kode Voucher'}
                placeholder={'Masukan Kode Voucher Disini'}
                onChangeText={(value) => {
                  setRedeem(value)
                }}
                icon={'ios-redo'}
                onClick={() => {
                  try {
                    snackBarError('Voucher Yang Anda Masukan Salah')
                  } catch (error) {
                    alert(JSON.stringify(error))
                  }
                }}
                value={redeem}
              />
            </View>
          </View>
        ) : (
            <View />
          )}
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
            }}>{IDR(totalAll.subTotal)}</Text>
          </View>
          <View style={{
            flex: 1
          }}>
            <CustomButton
              color={Colors.danger}
              title={'Bayar'}
              onPress={() => {
                let next = 1;
                for(let i in listDur){
                  if(listDur[i].length < 1){
                    next = next * 0;
                    break;
                  }
                }
                if (next === 0) {
                  snackBarWarning('Durasi Pengiriman Tidak Boleh Kosong')
                } else {
                  let products = {
                    deliveries: [],
                    products: []
                  }
                  for (let i in cart) {
                    if (cart[i].product.length > 0) {
                      for (let j in cart[i].product) {
                        products.deliveries.push({
                          id_order_delivery_type: total[i].detail.kurir.name_courier,
                          receipt_number: address.receiver_phone,
                          address: address.address_name
                        });
                        products.products.push({
                          delivery_index: i,
                          id_product: cart[i].product[j].id_product,
                          quantity: cart[i].product[j].amount,
                        })
                      }
                    }
                  }
                  let param = {
                    products,
                    flag: 'product',
                    total: totalAll.total
                  }
                  Nav({ title: 'Payment', page: 'ark.Payment', param, ID: props.componentId })
                }
              }}
            />
          </View>
        </View>
      </SafeAreaView>
    </Fragment >
  );
};

PaymentAddress.propTypes = {
  navigator: PropTypes.object,
  componentId: PropTypes.string
}

export default PaymentAddress;
