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
import { InputIcon, InputSellected } from '../../components/textInput';
import { getStorage } from '../../config/storage';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { ModalHeader } from '../../components/header';
import { LoadingOverlay } from '../../components/loading';
import { arkApi } from '../../config/api';
import { IDR } from '../../helper/numberFormat';

function DetailPulsa(props) {

  const [active, setActive] = useState([true, false])
  const [hp, setHp] = useState('')
  const [modal, setModal] = useState(false)
  const [load, setLoad] = useState(false)
  const [list, setList] = useState([])
  const [pulsa, setPulsa] = useState(false);

  const getMyPhone = async () => {
    let data = await getStorage('user');
    setHp(data.phone_number)
  }

  const getPermission = () => {
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
      {
        'title': 'Contacts',
        'message': 'This app would like to view your contacts.'
      }
    ).then(() => {
      getMyPhone()
    })
  }

  const previxPhone = async (data) => {
    setLoad(true)
    let param = data ? data : hp;
    try {
      let res = await arkApi({ metod: 'get', svc: 'product', url: 'previxPhone', param, body: null });
      if (res) {
        setLoad(false)
        setList(res)
      } else {
        setLoad(false)
      }
    } catch (err) {
      alert(JSON.stringify(err));
      setLoad(false);
    }
  }

  useEffect(() => {
    getPermission();
  }, [])

  const MyChild = () => {
    return (
      <View>
        <Text style={{
          fontSize: 18,
          color: Colors.grey
        }}>Nomor Telepon</Text>
        <Text style={{
          fontSize: 20
        }}>{hp}</Text>
        <Space size={10} />
        <Text style={{
          fontSize: 18,
          color: Colors.grey
        }}>Product</Text>
        <Text style={{
          fontSize: 20
        }}>{pulsa ? IDR(pulsa.sell_price) : 0}</Text>
      </View>
    );
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
                    setPulsa(row);
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
                        PULSA
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
      <Header
        backgroundColor={Colors.primary}
        containerStyle={{
          height: 64,
          marginBottom: -5,
          marginTop: -5,
        }}
        leftComponent={
          <View style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            marginLeft: 10,
            marginTop: -26,
            width: 200
          }}>
            <TouchableOpacity onPress={() => {
              Navigation.pop(props.componentId)
            }}>
              <Icon
                name='md-arrow-back'
                type='ionicon'
                color={Colors.light}
              />
            </TouchableOpacity>
            <Text style={{
              fontSize: 22,
              marginLeft: 20,
              color: Colors.light
            }}>
              {'Pulsa'}
            </Text>
          </View>
        }
      />
      <Header
        backgroundColor={Colors.primary}
        containerStyle={{
          height: 64,
          marginBottom: -5,
        }}
        leftComponent={
          <View style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'flex-end',
            marginBottom: 10,
            backgroundColor: Colors.primary,
          }}>
            <HeaderTabs title={'PRA-BAYAR'} active={active[0]} onPress={() => {
              let newActive = [...active];
              newActive[0] = true;
              newActive[1] = false;
              setActive(newActive)
            }} />
            <HeaderTabs title={'PASCA-BAYAR'} active={active[1]} onPress={() => {
              // let newActive = [...active];
              // newActive[0] = false;
              // newActive[1] = true;
              // setActive(newActive)
            }} />
          </View>}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="always" style={Styles.scrollView}
      >
        <View>
          <InputIcon
            onBlur={() => {
              previxPhone()
            }}
            title={'Input Phone Number'}
            placeholder={'Cth: 081333333333'}
            onChangeText={(value) => {
              setHp(value)
            }}
            onClick={() => {
              try {
                Contacts.selectContact((error, contact) => {
                  if (error) {
                    snackBarError(JSON.stringify(error))
                  }
                  else {
                    console.log(contact)
                    if (contact.phoneNumbers[0].digits) {
                      newPhone = '0' + contact.phoneNumbers[0].digits.substring(3, contact.length);
                      setHp(newPhone);
                      previxPhone(newPhone)
                    }
                  }
                });
              } catch (error) {
                alert(JSON.stringify(error))
              }
            }}
            value={hp}
            keyboardType={'phone-pad'}
          />
          <InputSellected
            title={'Pilih Nominal'}
            value={pulsa ? IDR(pulsa.sell_price) : 0}
            onPress={() => {
              setModal(true)
            }} />
        </View>
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
                title: 'Pulsa Prabayar',
                price: pulsa ? pulsa.sell_price : 0,
                child: <MyChild />,
                payload: pulsa,
                param: hp,
                flag: 'pulsa'
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

DetailPulsa.propTypes = {
  navigator: PropTypes.object,
  componentId: PropTypes.string
}

export default DetailPulsa;