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
  ImageBackground,
  TextInput
} from 'react-native';
import { Styles, deviceWidth, deviceHeight } from '../../styles';
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
import { textStyles } from '../../styles/text';
import { getStorage } from '../../config/storage';

function SearchPage(props) {

  const [load, setLoad] = useState(false);
  const [search, setSearch] = useState('');
  const [sug, setSug] = useState(false);

  useEffect(() => {
    getSugestion()
  }, [])

  const getSugestion = async () => {
    const sugetion = await getStorage('sugestion');
    setSug(sugetion);
  }

  const doSearch = async (data) => {
    try {
      setLoad(true);
      let res = await arkApi({ metod: 'get', svc: 'product', url: 'searchProduct', param: data ? data : search, body: null });
      if (res) {
        // Navigation.pop(props.componentId)
        Nav({ title: 'Search', page: 'ark.SearchProduct', param: { search: data ? data : search, payload: res }, ID: props.componentId, header: false })
        setSearch('');
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
        <Header
          backgroundColor={Colors.primary}
          containerStyle={{
            height: deviceHeight / 6.75,
            marginBottom: -5,
            borderBottomWidth: 5,
            flexDirection: 'row',
            marginTop: -25
          }}
          leftComponent={
            <View style={[containerStyles.leftRow, {
              width: deviceWidth - 120,
            }]}>
              <Icon
                containerStyle={{
                  marginLeft: 5,
                  marginRight: 20
                }}
                name='md-arrow-back'
                type='ionicon'
                onPress={() => {
                  Navigation.pop(props.componentId)
                }}
                color={Colors.light}
              />
              <View style={{
                borderRadius: 10,
                width: deviceWidth - 130,
                borderColor: Colors.grey,
                backgroundColor: Colors.light,
                flexDirection: 'row',
                alignItems: 'center'
              }}>
                <Icon
                  name='ios-search'
                  type={'ionicon'}
                  color={Colors.primary}
                  iconStyle={{
                    padding: 10
                  }}
                  size={20} />
                <TextInput style={{
                  width: '100%',
                  height: '100%',
                  padding: 5
                }} value={search} autoFocus onChangeText={(e) => {
                  setSearch(e)
                }}
                  onBlur={() => {
                    if (search.length > 3) {
                      doSearch();
                    }
                  }}
                />
              </View>
            </View>
          }
          rightComponent={
            <TouchableOpacity style={containerStyles.centerRow} onPress={() => {
              setSearch('')
            }}>
              <Text style={[textStyles.h3, {
                color: Colors.light
              }]}>Batalkan</Text>
            </TouchableOpacity>
          }
        />
        <ScrollView
          contentInsetAdjustmentBehavior="always"
          style={[Styles.body, {
            // backgroundColor: 'red'
          }]}>
          <View style={{
            padding: 20,
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderColor: Colors.grey
          }}>
            {sug ? (
              sug.map((row, index) => (
                <TouchableOpacity style={[containerStyles.betweenRow, {
                  paddingVertical: 10
                }]} onPress={() => {
                  doSearch(row.name)
                }}>
                  <Text style={{
                    color: Colors.greyDark
                  }}>{row.name}</Text>
                  <Icon
                    containerStyle={{
                      marginLeft: 5,
                      marginRight: 20
                    }}
                    name='md-pricetag'
                    type='ionicon'
                    color={Colors.primary}
                  />
                </TouchableOpacity>
              ))
            ) : (
                <Text style={{
                  color: Colors.greyDark
                }}>Loading ...</Text>
              )}
          </View>
          <View style={{
            padding: 20,
            borderBottomWidth: 1,
            borderColor: Colors.grey
          }}>
            <Text style={textStyles.title}>Produk Populer</Text>
            <View style={{
              padding: 40
            }}>
              <Text style={{
                textAlign: 'center'
              }}>
                Belum Ada Data
            </Text>
            </View>
          </View>
          <View style={{
            padding: 20,
            borderBottomWidth: 1,
            borderColor: Colors.grey
          }}>
            <Text style={textStyles.title}>Toko Terpuler</Text>
            <View style={{
              padding: 40
            }}>
              <Text style={{
                textAlign: 'center'
              }}>
                Belum Ada Data
            </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Fragment>
  );
};

SearchPage.propTypes = {
  navigator: PropTypes.object,
  componentId: PropTypes.string
}

export default SearchPage;