import React, { Fragment, useEffect, useState } from 'react';
import Contacts from 'react-native-unified-contacts';
import PropTypes from 'prop-types';
import { CheckBox, Text as Rtext, Button, Icon, Header } from 'react-native-elements'
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StatusBar,
  TextInput,
  TouchableOpacity,
  PermissionsAndroid,
  Modal,
  Alert
} from 'react-native';
import { Styles, deviceHeight } from '../../styles';
import { Colors } from '../../styles/colors';
import { containerStyles } from '../../styles/container';
import { Buttons, HeaderTabs, CustomButton } from '../../components/button';
import { Space } from '../../components/container';
import { setRoot, setRootTabs, Nav } from '../../router/navigator';
import { snackBarSuccessOK, snackBarError, snackBarWarning } from '../../components/snackBar';
import { Navigation } from 'react-native-navigation';
import { InputIcon, InputSellected, InputLogin } from '../../components/textInput';
import { getStorage } from '../../config/storage';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { ModalHeader } from '../../components/header';
import { LoadingOverlay } from '../../components/loading';
import { arkApi } from '../../config/api';
import { IDR } from '../../helper/numberFormat';

const listrik = [
  {
    "_id": "5e1d79b002210000a9002532",
    "id_product": "pln100",
    "id_master": "5deccf167a65079c7260c0fe",
    "id_master_type": "biller",
    "item_code": "Listrik001",
    "description": "Token Listrik 10k",
    "name": "Listrik Kadang mahal kadang murah 10.000",
    "sell_price": "10000",
    "sell_price": "10000",
    "promotions": [],
    "brand_name": "PLN",
    "brand_image": "https://arkamaiadevstorage.blob.core.windows.net/arkamaia-26/product/pln100/brand/PLN.jpg",
    "stock": "9999999",
    "store_front": "MRT Benhil",
    "store_location": {
      "lat": "0",
      "lng": "0",
      "description": "store location"
    },
    "channel": {
      "channel_id": "CHN-0001",
      "channel_name": "Metra Net",
      "channel_image": "https://www.metranet.co.id/wp-content/uploads/2019/06/Metranet.png"
    },
    "dimension": {
      "height_cm": "0",
      "length_cm": "0",
      "width_cm": "0",
      "weight_gram": "0"
    },
    "attributes": [],
    "categories": [
      {
        "category_level": "2",
        "category_id": "CAT10003",
        "category_name": "Listrik Pre Paid",
        "lname_category": "listrik pre paid"
      },
      {
        "category_level": "1",
        "category_id": "CAT10000",
        "category_name": "PPOB",
        "lname_category": "ppob"
      }
    ],
    "assets": {
      "images": [
        {
          "name": "image_1",
          "src": "https://arkamaiadevstorage.blob.core.windows.net/arkamaia-26/product/pln100/assets/image_1.jpg"
        }
      ],
      "videos": [],
      "articles": []
    },
    "is_new": true,
    "created_by": "37503970-2153-11EA-87EC-27897998E92C",
    "updated_by": "37503970-2153-11EA-87EC-27897998E92C",
    "id_holding": 26,
    "updated_at": "2020-01-15 21:11:14",
    "created_at": "2020-01-14 15:20:00"
  }
]

function ListrikPost(props) {

  const [active, setActive] = useState([true, false])
  const [hp, setHp] = useState('')
  const [modal, setModal] = useState(false)
  const [load, setLoad] = useState(false)
  const [list, setList] = useState([])
  const [pulsa, setPulsa] = useState(false);
  const [detail, setDetail] = useState({});



  useEffect(() => {
    getListrik()
    // getPermission();
  }, [])

  const MyChild = () => {
    return (
      <View>
        <Text style={{
          fontSize: 18,
          color: Colors.grey
        }}>No. Meter/ID Pelanggan</Text>
        <Text style={{
          fontSize: 20
        }}>{hp}</Text>
        <Space size={10} />
        <Text style={{
          fontSize: 18,
          color: Colors.grey
        }}>Jenis Layanan</Text>
        <Text style={{
          fontSize: 20
        }}>{pulsa ? IDR(pulsa.sell_price) : 0}</Text>
        <Text style={{
          fontSize: 18,
          color: Colors.grey
        }}>Detail Pelanggan</Text>
        <Text style={{
          fontWeight: 'bold'
        }}>ID Pelanggan</Text>
        <Text>{detail.info.details.id_pelanggan}</Text>
        <Text style={{
          fontWeight: 'bold'
        }}>Nama Pelanggan</Text>
        <Text>{detail.info.details.nama_pelanggan}</Text>
        <Text style={{
          fontWeight: 'bold'
        }}>Golongan Daya</Text>
        <Text>{detail.info.details.golongan_daya}</Text>
      </View>
    );
  }

  const getListrik = async () => {
    setLoad(true)
    try {
      let res = await arkApi({ metod: 'get', svc: 'product', url: 'getBillers', param: null, body: null });
      if (res) {
        setLoad(false)
        newList = [];
        for (let i in res) {
          if (res.length > 0) {
            if (res[i].categories[0].category_id === 'CAT10003') {
              newList.push(res[i])
            }
          }
        }
        setList(newList);
      } else {
        setLoad(false)
      }
    } catch (err) {
      console.log(err)
      alert(JSON.stringify(err));
      setLoad(false);
    }
  }

  const doCheckListrik = async () => {
    setLoad(true)
    try {
      let body =
      {
        "product": "pln100",
        "no_listrik": hp
      }

      let res = await arkApi({ metod: 'post', svc: 'member', url: 'checkListrik', param: null, body });
      if (res) {
        setLoad(false)
        if (res.result) {
          setDetail(res)
          snackBarSuccessOK('Nomer listrik anda terdaftar')
          setHp(res.info.details.no_meter)
        } else {
          snackBarError('Nomer listrik anda tidak terdaftar')
          setHp('')
        }
      } else {
        setLoad(false)
      }
    } catch (err) {
      alert(JSON.stringify(err));
      setLoad(false);
    }
  }

  return (
    <SafeAreaView>
      <LoadingOverlay loading={load} />
      <StatusBar barStyle="light-content" backgroundColor={Colors.primaryDark} />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modal}
        onRequestClose={() => {
          setModal(false)
        }}>
        <View style={{
          height: deviceHeight
        }}>
          <View style={{
            backgroundColor: Colors.light,
            flex: 1
          }}>
            <ModalHeader onPress={() => {
              setModal(false)
            }}
              title={'Pilih Nominal'}
            />
            <ScrollView>
              {list.map((row, index) => (
                <TouchableOpacity style={{
                  flex: 1,
                  backgroundColor: Colors.light,
                  borderBottomColor: Colors.grey,
                  borderBottomWidth: 1,
                  padding: 20
                }}
                  key={index.toString()}
                  onPress={() => {
                    doCheckListrik();
                    setPulsa(row)
                    setModal(false);
                  }}
                >
                  <View style={containerStyles.betweenRow}>
                    <View style={{
                      flex: 1
                    }}>
                      <Text style={{
                        fontSize: 18
                      }}>
                        Listrik
                  </Text>
                      <Text style={{
                        fontWeight: 'bold'
                      }}>
                        {row.name}
                      </Text>
                    </View>
                    <Text style={{
                      fontSize: 20,
                      fontWeight: 'bold'
                    }}>{IDR(row.sell_price)}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
      <ScrollView
        contentInsetAdjustmentBehavior="always" style={Styles.scrollView}
      >
        <View>
          <InputLogin
            title={'No Meteran/ID Pelanggan'}
            placeholder={'Cth: 222000229922222002'}
            onChangeText={(value) => {
              setHp(value)
            }}
            // onBlur={()=> {
            //   checkListrik()
            // }}
            value={hp}
            keyboardType={'phone-pad'}
          />
          <InputSellected
            title={'Pilih Nominal'}
            value={pulsa ? IDR(pulsa.sell_price) : 0}
            onPress={() => {
              if (hp.length <= 3) {
                snackBarWarning('Masukan No Meteran/ID Pelanggan Dengan Benar')
              } else {
                setModal(true)
              }
            }} />
        </View>
        <Space size={100} />
        <View style={[{
          borderTopWidth: 1,
          borderColor: Colors.grey,
          borderBottomWidth: 1,
          margin: 10,
          padding: 20
        }, containerStyles.betweenRow]}>
          <Text style={{
            fontWeight: 'bold',
            fontSize: 20
          }}>Harga</Text>
          <Text style={{
            fontWeight: 'bold',
            fontSize: 20
          }}>{pulsa ? IDR(pulsa.sell_price) : 0}</Text>
        </View>
        <Space size={deviceHeight / 7} />
        <CustomButton color={Colors.danger} title={'Beli'} onPress={() => {
          if (pulsa.sell_price) {
            if (pulsa.sell_price !== 0) {
              let param = {
                title: 'Listrik PrePaid',
                price: pulsa ? pulsa.sell_price : 0,
                child: <MyChild />,
                payload: pulsa,
                flag: 'listrik',
                param: hp
              }
              Nav({ title: 'Checkout Pembelian', page: 'ark.CheckOut', param, ID: props.componentId })
            }
          } else {
            snackBarWarning('Pilih Product Dulu')
          }
        }} />
        <Space size={100} />
      </ScrollView>
    </SafeAreaView>
  );
};

ListrikPost.propTypes = {
  navigator: PropTypes.object,
  componentId: PropTypes.string
}

export default ListrikPost;