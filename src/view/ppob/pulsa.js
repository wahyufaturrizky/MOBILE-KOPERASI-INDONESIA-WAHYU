import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { CheckBox, Text as Rtext, Button, Icon, Header } from 'react-native-elements'
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
import { Colors } from '../../styles/colors';
import { containerStyles } from '../../styles/container';
import { Buttons, HeaderTabs } from '../../components/button';
import { Space } from '../../components/container';
import { setRoot, setRootTabs, Nav } from '../../router/navigator';
import { snackBarSuccessOK } from '../../components/snackBar';
import { Navigation } from 'react-native-navigation';
import { InputIcon, InputSellected } from '../../components/textInput';

function Product(props) {

  const [active, setActive] = useState([true, false])
  const [hp, setHp] = useState('')
  const [nominal, setNominal] = useState('')

  return (
      <SafeAreaView>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primaryDark} />
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
              title={'Input Phone Number'}
              placeholder={'Cth: 628999064808'}
              onChangeText={(value) => {
                setHp(value)
              }}
              value={hp}
              keyboardType={'phone-pad'}
            />
            <InputSellected title={'Pilih Nominal'} value={nominal} onPress={() => {
              Nav({ title: 'Pilih Nominal', page: 'ark.ListPulsa', param: null, ID: props.componentId })
              setTimeout(() => {
                setNominal('SIMPATI/AS 5RB')
              }, 2000);
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
            }}>Rp. {nominal.length === 0 ? '0' : '5000'}</Text>
          </View>
          <Space size={deviceHeight / 6} />
          <Button
            containerStyle={{
              margin: 10,
            }}
            buttonStyle={{
              borderRadius: 12,
              padding: 10,
            }}
            titleStyle={{
              fontSize: 22
            }}
            title="Beli"
          />
          <Space size={100} />
        </ScrollView>        
      </SafeAreaView>
  );
};

Product.propTypes = {
  navigator: PropTypes.object,
  componentId: PropTypes.string
}

export default Product;