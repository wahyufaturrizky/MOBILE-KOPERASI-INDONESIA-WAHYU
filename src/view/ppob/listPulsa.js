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
  TouchableOpacity
} from 'react-native';
import { Styles, deviceHeight } from '../../styles';
import { containerStyles } from '../../styles/container';
import { Colors } from '../../styles/colors';
import { Buttons } from '../../components/button';
import { Space } from '../../components/container';
import { setRoot, setRootTabs } from '../../router/navigator';
import { arkApi } from '../../config/api';
import { LoadingOverlay } from '../../components/loading';
import { Navigation } from 'react-native-navigation';

function ListPulsa(props) {

  const [load, setLoad] = useState(false);
  const [list, setList] = useState([]);

  useEffect(() => {
    getListPulsa();
  }, [])

  const getListPulsa = async () => {
    let id = props.idCategory ? props.idCategory : 'CAT10001';
    try {
      setLoad(true);
      let res = await arkApi({ metod: 'get', svc: 'product', url: 'detailProduct', param: id, body: null });
      if (res) {
        setLoad(false)
        if (res.data) {
          setList(res.data)
        }
      } else {
        setLoad(false)
      }
    } catch (err) {
      console.log(err);
      setLoad(false);
    }
  }

  return (
    <Fragment>
      <LoadingOverlay loading={load} />
      <StatusBar barStyle="light-content" backgroundColor={Colors.primaryDark} />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="always" style={Styles.scrollView}>
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
                Navigation.pop(props.componentId)
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
                }}>Rp. {row.price.base_price}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    </Fragment>
  );
};

ListPulsa.propTypes = {
  navigator: PropTypes.object,
  componentId: PropTypes.string
}

export default ListPulsa;