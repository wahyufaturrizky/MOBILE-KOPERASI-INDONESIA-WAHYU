import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { CheckBox, Text as Rtext, Button } from 'react-native-elements'
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StatusBar,
  TextInput,
  Image
} from 'react-native';
import { containerStyles } from '../../styles/container';
import { Styles, deviceHeight } from '../../styles';
import { Space } from '../../components/container';
import { setRoot } from '../../router/navigator';
import { Colors } from '../../styles/colors';
import { LoadingOverlay } from '../../components/loading';
import { arkApi } from '../../config/api';

function DetailOrder(props) {

  const [load, setLoad] = useState(false);
  const [order, setOrder] = useState([]);

  // const getOrder = async () => {
  //   try {
  //     setOrder(dummy.data)
  //     // setLoad(true);
  //     // let res = await arkApi({ metod: 'get', svc: 'configuration', url: 'configBySub', param: null, body: null });
  //     // if (res) {
  //     //   setLoad(false);
  //     //   console.log(res.config_saving)
  //     //   setSaving(res.config_saving)
  //     // } else {
  //     //   setLoad(false)
  //     // }
  //   } catch (err) {
  //     console.log(err)
  //     setLoad(false);
  //   }
  // }

  // useEffect(() => {
  //   getOrder();
  // }, [])

  return (
    <Fragment>
      <LoadingOverlay loading={load} />
      <StatusBar barStyle="light-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="always" style={Styles.scrollView}>
          <View style={{
            margin: 20
          }}>
            <View style={{
              flex: 1,
              marginBottom: 15,
            }}>
              <View style={{
                flex: 1,
                borderWidth: 1,
                borderBottomWidth: 0,
                borderTopLeftRadius: 15,
                borderTopRightRadius: 15,
                padding: 10
              }}>
                <View style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-start'
                }}>
                  <Text style={{
                    fontWeight: 'bold',
                    fontSize: 18
                  }}>Order Status</Text>
                  <Text style={{
                    fontSize: 16,
                    marginLeft: 10
                  }}>{props.status}</Text>
                </View>
              </View>
              <View style={{
                flex: 1,
                borderWidth: 1,
                borderBottomWidth: 0,
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
                borderWidth: 1,
                flexDirection: 'row',
                borderBottomLeftRadius: 15,
                borderBottomRightRadius: 15,
                padding: 10
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
                      {props.price}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Fragment>
  );
};

DetailOrder.propTypes = {
  navigator: PropTypes.object,
  componentId: PropTypes.string
}

export default DetailOrder;