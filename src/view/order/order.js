import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { CheckBox, Text as Rtext, Button, Header, Icon } from 'react-native-elements'
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StatusBar,
  TextInput,
  Image,
  TouchableOpacity,
  RefreshControl
} from 'react-native';
import { Buttons, HeaderTabs, CustomButton } from '../../components/button';
import { containerStyles } from '../../styles/container';
import { Styles, deviceHeight } from '../../styles';
import { Space } from '../../components/container';
import { setRoot, Nav } from '../../router/navigator';
import { Colors } from '../../styles/colors';
import { LoadingOverlay } from '../../components/loading';
import { arkApi } from '../../config/api';
import { IDR } from '../../helper/numberFormat';

function Order(props) {

  const [load, setLoad] = useState(false);
  const [order, setOrder] = useState([]);
  const [masterStatus, setMasterStatus] = useState([]);
  const [master, setMaster] = useState([]);
  const [active, setActive] = useState([true, false])
  const [status, setStatus] = useState([true, false, false, false])
  const [refreshing, setRefreshing] = useState(false);

  const getOrder = async () => {
    try {
      // setLoad(true);
      let res = await arkApi({ metod: 'get', svc: 'order', url: 'listOrder', param: null, body: null });
      if (res) {
        setRefreshing(false)
        setLoad(false);
        console.log('======//==============//================//==============')
        console.log(res)
        if (res.data.length !== 0) {
          setMaster(res.data)
          doFillter(true, res.data)
        }
      } else {
        setLoad(false)
      }
    } catch (err) {
      console.log(err)
      setLoad(false);
    }
  }

  function doFillter(tag, data) {
    let master = data;
    setStatus([true, false, false, false])
    if (tag) {
      let newData = []
      for (let i in master) {
        if (master[i].order_type === 'product') {
          newData.push(master[i])
        }
      }
      setOrder(newData)
      setMasterStatus(newData)
    } else {
      let newData = []
      for (let i in master) {
        if (master[i].order_type !== 'product') {
          newData.push(master[i])
        }
      }
      setOrder(newData)
      setMasterStatus(newData)
    }
  }

  function doStatus(index) {    
    let data = masterStatus;
    console.log(data)
    if (index === 0) {      
      setOrder(masterStatus)
    } else if(index === 1) {
      let newData = []
      for (let i in data) {
        if (data[i].id_workflow_status === 'ODST-002') {
          newData.push(data[i])
        }
      }
      setOrder(newData)
    } else if(index === 2) {
      let newData = []
      for (let i in data) {
        if (data[i].id_workflow_status === 'ODST-003') {
          newData.push(data[i])
        }
      }
      setOrder(newData)
    } else {
      let newData = []
      for (let i in data) {
        if (data[i].id_workflow_status === 'ODST-004' || data[i].id_workflow_status === 'ODST-005') {
          newData.push(data[i])
        }
      }
      setOrder(newData)
    }
  }

  useEffect(() => {
    getOrder();
  }, [])

  const TopButton = (props) => {
    return (
      <TouchableOpacity style={{
        flex: 1,
        borderRadius: 100,
        backgroundColor: props.active ? Colors.danger : Colors.light,
        borderWidth: 2,
        borderColor: Colors.danger,
        margin: 2,
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center'
      }} onPress={()=> {
        newStatus = [...status];
        for(let i in newStatus){
          if(i === props.index.toString()){
            newStatus[i] = true 
          } else {
            newStatus[i] = false 
          }
        }
        setStatus(newStatus);
        doStatus(props.index)
      }}>
        <Text style={{
          color: props.active ? Colors.light : Colors.danger
        }}>{props.title}</Text>
      </TouchableOpacity>
    )
  }

  const ListOrder = (props) => {
    return (
      <TouchableOpacity style={{
        flex: 1,
        marginBottom: 15,
        shadowColor: Colors.dark,
        shadowOffset: {
          width: 0,
          height: 6,
        },
        shadowOpacity: 1,
        shadowRadius: 7.49,
        elevation: 12,
        margin: 10,
        borderWidth: 1,
        borderColor: Colors.lightGrey,
        backgroundColor: Colors.light,
        borderRadius: 15
      }}>
        <View style={{
          flex: 1,
          backgroundColor: '#E5FCE7',
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
          padding: 10
        }}>
          <View style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Text style={{
              fontSize: 16,
              textAlign: 'center'
            }}>{props.status}</Text>
          </View>
        </View>
        <View style={{
          flex: 1,
          borderBottomWidth: 1,
          borderColor: Colors.grey,
          padding: 10
        }}>
          <View style={{
            flex: 1,
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}>
            <Text style={{
              fontSize: 16
            }}>
              Order Date: {props.date}
            </Text>
            <Text style={{
              fontSize: 16
            }}>
              Invoice Number: {props.no}
            </Text>
          </View>
        </View>
        <View style={{
          flex: 1,
          borderBottomWidth: 1,
          flexDirection: 'row',
          padding: 10,
          borderColor: Colors.grey
        }}>
          <View style={{
            flex: 1,
            padding: 5
          }}>
            <Image style={{
              width: '100%',
              height: 120,
              backgroundColor: Colors.light,
              borderRadius: 20,
              borderColor: Colors.grey,
              borderWidth: 2
            }}
              source={{ uri: props.image }}
            />
          </View>
          <View style={{
            flex: 2,
            height: '100%',
          }}>
            <View style={{
              flex: 1,
              flexDirection: 'column',
              alignItems: 'flex-start',
              paddingLeft: 20,
              paddingTop: 20
            }}>
              <Text style={{
                fontSize: 18,
                fontWeight: 'bold'
              }}>
                Product Name:
              </Text>
              <Text style={{
                fontSize: 16,
                marginTop: 5,
                marginBottom: 5
              }}>
                {props.name}
              </Text>
              <Text style={{
                fontSize: 18,
                fontWeight: 'bold'
              }}>
                Price In IDR:
            </Text>
              <Text style={{
                fontSize: 16,
                marginTop: 5,
                marginBottom: 5
              }}>
                {IDR(props.price)}
              </Text>
            </View>
          </View>
        </View>
        <View style={{
          flex: 1,
          flexDirection: 'row',
          borderBottomLeftRadius: 15,
          borderBottomRightRadius: 15,
          padding: 10
        }}>
          <View style={containerStyles.centerColumn}>
            <Text style={{
              color: Colors.grey
            }}>Total Pembayaran</Text>
            <Text style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: Colors.danger
            }}>{IDR(props.price)}</Text>
          </View>
          <CustomButton onPress={() => {
            Nav({ title: props.name, page: 'ark.DetailOrder', param: props, ID: props.componentId })
          }} color={Colors.danger} title={'Beli Lagi'} />
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <Fragment>
      <LoadingOverlay loading={load} />
      <StatusBar barStyle="light-content" />
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
            marginTop: -26,
            width: 200
          }}>
            <Text style={{
              fontSize: 22,
              marginLeft: 20,
              color: Colors.light
            }}>
              {'Transaksi'}
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
            <HeaderTabs title={'Pembelian Barang'} active={active[0]} onPress={() => {
              let newActive = [...active];
              newActive[0] = true;
              newActive[1] = false;
              setActive(newActive)
              doFillter(true, master)
            }} />
            <HeaderTabs title={'Biller'} active={active[1]} onPress={() => {
              let newActive = [...active];
              newActive[0] = false;
              newActive[1] = true;
              setActive(newActive)
              doFillter(false, master)
            }} />
          </View>}
      />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="always" style={Styles.scrollView}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={getOrder} />
          }>
          <View style={{
            margin: 20
          }}>
            <View style={[containerStyles.centerRow]}>
              <TopButton title={'Semua'} active={status[0]} index={0} />
              <TopButton title={'Dibayar'} active={status[1]} index={1} />
              <TopButton title={'Diproses'} active={status[2]} index={2} />
              <TopButton title={'Selesai'} active={status[3]} index={3} />
            </View>
            <Space size={30} />

            {order.map((row, index) => (
              row.items[0] ? (
                <View key={index.toString()}>
                  <ListOrder
                    status={row.payments[0].status}
                    date={row.billing_date}
                    no={row.invoice_number}
                    name={row.items[0].product_name}
                    price={row.total_billing}
                    componentId={props.componentId}
                  />
                </View>
              ) : (
                  <View key={index.toString()} />
                )
            ))}
          </View>
          <Space size={100} />
        </ScrollView>
      </SafeAreaView>
    </Fragment>
  );
};

Order.propTypes = {
  navigator: PropTypes.object,
  componentId: PropTypes.string
}

export default Order;