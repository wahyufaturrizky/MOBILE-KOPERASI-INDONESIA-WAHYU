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
  RefreshControl
} from 'react-native';
import { Styles, deviceWidth } from '../../styles';
import { containerStyles } from '../../styles/container';
import { Colors } from '../../styles/colors'
import { Space } from '../../components/container';
import { LoadingOverlay } from '../../components/loading';
import { resValid } from '../../config/validator';
import { Buttons, HeaderIcon } from '../../components/button';
import { Nav } from '../../router/navigator';
import { Navigation } from 'react-native-navigation';
import { arkApi } from '../../config/api';
import { getStorage } from '../../config/storage';
import config from '../../config/device.json';
import { CustomHeader, HomeHeader } from '../../components/header';
import { IDR } from '../../helper/numberFormat';
import { snackBarSuccessOK } from '../../components/snackBar';
import Swiper from 'react-native-swiper';

const category = [
  {
    page: 1, detail: [
      { name: 'Pulsa', id: 'CAT10001' },
      { name: 'Paket Data', id: 'CAT10002' },
      { name: 'Listrik Pre Paid', id: 'CAT10003' },
      { name: 'Listrik Post Paid', id: 'CAT10004' }
    ]
  },
  {
    page: 2, detail: [
      { name: 'BPJS', id: 'CAT10005' },
      { name: 'Tiket Pesawat', id: 'CAT90001' },
      { name: 'Internet Telkom', id: 'CAT10006' },
      { name: 'Top Up Link Aja', id: 'CAT10007' }
    ]
  },
  {
    page: 3, detail: [
      { name: 'Top Up GO PAY', id: 'CAT10008' },
      { name: 'Top Up OVO', id: 'CAT10009' },
      { name: 'Insurance', id: 'CAT100010' },
    ]
  }
]

const banner = [
  {
    image: require('../../assets/images/banner1.jpg')
  },
  {
    image: require('../../assets/images/banner2.jpg')
  },
  {
    image: require('../../assets/images/banner3.webp')
  }
]

function Home(props) {

  const [load, setLoad] = useState(false);
  const [search, setSearch] = useState('');
  const [categoryProduct, setCategoryProduct] = useState([]);
  const [recomen, setRecomen] = useState([]);
  const [top, setTop] = useState([]);
  const [balance, setBalance] = useState({ total: 'Loading ...' });
  const [user, setUser] = useState({ name: 'Loading ...' });
  const [topAds, setTopAds] = useState([]);
  const [bottomAds, setBottomAds] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    getAll()
  }, [])

  const getAll = () => {
    getBalance();
    // getRecomendation();
    // getTopRated();
    getUserData();
    getAds();    
  }

  const getAds = async () => {
    const topAds = await getStorage('topAds')
    const bottomAds = await getStorage('bottomAds')
    setTopAds(topAds);
    setBottomAds(bottomAds);
    setRefreshing(false)
  }

  const getUserData = async () => {
    let data = await getStorage('user');
    setUser(data)
  }  

  const getBalance = async () => {
    try {
      setLoad(true);
      let res = await arkApi({ metod: 'get', svc: 'member', url: 'balance', param: null, body: null });
      if (res) {
        setLoad(false);
        setBalance(res)
      }
    } catch (err) {
      console.log(err)
      setLoad(false);
    }
  }

  const getProduct = async () => {
    try {
      setLoad(true);
      let res = await arkApi({ metod: 'get', svc: 'product', url: 'categoryProduct', param: null, body: null });
      if (res) {
        setLoad(false);
        setCategoryProduct(res)
      }
    } catch (err) {
      console.log(err)
      setLoad(false);
    }
  }

  const getRecomendation = async () => {
    try {
      let user = await getStorage('user')
      setLoad(true);
      let res = await arkApi({ metod: 'get', svc: 'product', url: 'recomendation', param: user.id_user, body: null });
      if (res) {
        setLoad(false);
        setRecomen(res)
      }
    } catch (err) {
      console.log(err)
      setLoad(false);
    }
  }

  const getTopRated = async () => {
    try {
      setLoad(true);
      let res = await arkApi({ metod: 'get', svc: 'order', url: 'topRated', param: config.id_holding, body: null });
      if (res) {
        setLoad(false);
        setTop(res)
      }
    } catch (err) {
      console.log(err)
      setLoad(false);
    }
  }


  const SearchComponent = (props) => {
    return (
      <View />
    )
  }

  const Product = (props) => {
    return (
      <TouchableOpacity style={containerStyles.centerColumn}
        onPress={() => {
          if (props.id === 'CAT10001') {
            Nav({ title: props.title, page: 'ark.DetailPulsa', param: null, ID: props.root.componentId, header: false })
          } else if (props.id === 'CAT10002') {
            Nav({ title: props.fullName, page: 'ark.PaketData', param: null, ID: props.root.componentId })
          } else if (props.id === 'CAT10003') {
            Nav({ title: props.fullName, page: 'ark.ListrikPost', param: null, ID: props.root.componentId })
          } else {
            snackBarSuccessOK('Menu Billers ' + props.id + ' under construction')
          }
        }}
      >
        <View style={{
          height: 60,
          width: 60,
          backgroundColor: Colors.primary,
          borderRadius: 15,
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 10,
          margin: 4
        }}>
          <Icon
            name='md-albums'
            type='ionicon'
            iconStyle={{
              color: Colors.light,
              fontSize: 20,
              padding: 5
            }}
          />
        </View>
        <Text style={{
          color: Colors.dark,
          textAlign: 'center'
        }}>{props.title}</Text>
        <Text style={{
          color: Colors.dark,
          textAlign: 'center'
        }}>{props.subTitle}</Text>
      </TouchableOpacity>
    )
  }

  const Banner = (props) => {
    const content = props.content;
    return (
      content.length > 0 ? (
        <Swiper
          height={120}
          autoplay={true}
          autoplayTimeout={10}
          dot={
            <View
              style={{
                backgroundColor: Colors.light,
                width: 8,
                height: 8,
                borderRadius: 4,
                marginLeft: 3,
                marginRight: 3,
                marginTop: 3,
                marginBottom: 3,
                left: 0,
              }}
            />
          }
          activeDot={
            <View
              style={{
                backgroundColor: Colors.primary,
                width: 10,
                height: 10,
                borderRadius: 4,
              }}
            />
          }
          paginationStyle={{
            bottom: 20,
            left: -1 * (deviceWidth / 1.3)
          }}
          loop
        >
          {content.map((item, i) => {
            return (
              <TouchableOpacity
                style={{
                  margin: 10
                }}
                key={i}
                title={<Text numberOfLines={1}></Text>}
                onPress={() => {
                  Nav({ title: item.title, page: 'ark.DetailAds', param: {image: item.image}, ID: props.componentId })
                }}
              >
                <Image
                  resizeMode={'cover'}
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: 15,
                    borderColor: Colors.grey
                  }}
                  source={item.image}
                />
              </TouchableOpacity>
            );
          })}
        </Swiper>
      ) : (
          <View style={[containerStyles.centerRow, {
            height: 120,
            margin: 20
          }]}>
            <Text style={{
              fontWeight: 'bold'
            }}>No Ads Available</Text>
          </View>
        )
    )
  }

  const RightContent = () => {
    return (
      <View style={{
        flex: 1,
        flexDirection: 'row',
      }}>
        <Icon
          raised
          name='ios-print'
          type={'ionicon'}
          color={Colors.dark}
          iconStyle={{
            fontSize: 30
          }}
          size={15}
          onPress={() => alert('hello')} />
        <Icon
          raised
          name='ios-notifications'
          type={'ionicon'}
          color={Colors.dark}
          iconStyle={{
            fontSize: 30
          }}
          size={15}
          onPress={() => alert('hello')} />
      </View>
    )
  }

  return (
    <Fragment>
      {/* <LoadingOverlay loading={load} /> */}
      <StatusBar barStyle="light-content" />
      <SafeAreaView>
        <HomeHeader
          getNotif
          ID={props.componentId}
          onPress={() => {
            Nav({ title: 'Search', page: 'ark.SearchPage', param: null, ID: props.componentId, header: false })
          }} />
        <ScrollView
          contentInsetAdjustmentBehavior="always" style={Styles.scrollView} 
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={getAll} />
          }>
          <Space size={10} />
          <Banner content={topAds} componentId={props.componentId} />
          <TouchableOpacity style={{
            flex: 1,
            backgroundColor: Colors.danger,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            margin: 10,
            padding: 15,
            borderRadius: 10
          }} onPress={() => {
            if (balance.total !== 'Loading ...') {
              Nav({ title: 'Balance', page: 'ark.Balance', param: balance, ID: props.componentId })
            }
          }}>
            <Text style={{
              fontWeight: 'bold',
              color: Colors.light,
            }}>Hi, {user.name}</Text>
            <View style={[containerStyles.centerRow, {
              justifyContent: 'flex-end'
            }]}>
              <Text style={{
                color: Colors.light,
                marginRight: 5
              }}>Saldo Total</Text>
              <Text style={{
                fontWeight: 'bold',
                color: Colors.light,
              }}>{balance.total !== 'Loading ...' ? IDR(balance.total) : balance.total}</Text>
            </View>
          </TouchableOpacity>
          <View style={{
            flex: 1,
            backgroundColor: Colors.danger,
            margin: 10,
            marginTop: 0,
            padding: 15,
            borderRadius: 10
          }}>
            <TouchableOpacity style={[containerStyles.betweenRow, {
              marginBottom: 10
            }]} onPress={() => {
              // if (balance.total !== 'Loading ...') {
              Nav({ title: 'Daftar Pinjaman', page: 'ark.Loan', param: balance, ID: props.componentId })
              // }
            }}>
              <Text style={{
                color: Colors.light,
              }}>Pinjamanku</Text>
              <View style={[containerStyles.centerRow, {
                justifyContent: 'flex-end'
              }]}>
                <Text style={{
                  fontWeight: 'bold',
                  color: Colors.light,
                }}>Rp. 0</Text>
                <Text style={{
                  color: Colors.light,
                  marginLeft: 5
                }}>Lihat Detail ></Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={containerStyles.betweenRow} onPress={() => {
              // if (balance.total !== 'Loading ...') {
              Nav({ title: 'Simpanan Ku', page: 'ark.Saving', param: balance, ID: props.componentId })
              // }
            }}>
              <Text style={{
                color: Colors.light,
              }}>Simpananku</Text>
              <View style={[containerStyles.centerRow, {
                justifyContent: 'flex-end'
              }]}>
                <Text style={{
                  fontWeight: 'bold',
                  color: Colors.light,
                }}>Rp. 0</Text>
                <Text style={{
                  color: Colors.light,
                  marginLeft: 5
                }}>Lihat Detail ></Text>
              </View>
            </TouchableOpacity>
          </View>
          <Space size={20} />
          {category.map((data, dataIndex) => (
            <View style={[{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-around',
              paddingLeft: 20,
              paddingRight: 20,
              marginBottom: 10
            }]}
              key={dataIndex.toString()}>
              {data.detail.map((row, index) => (
                <View key={index.toString()}>
                  <Product
                    title={
                      row.name.split(' ').length >= 4 ?
                        row.name.split(' ')[0] + ' ' + row.name.split(' ')[1] :
                        row.name.split(' ')[0]}
                    subTitle={
                      row.name.split(' ').length == 3 ?
                        row.name.split(' ')[1] + ' ' + row.name.split(' ')[2] :
                        row.name.split(' ').length == 4 ? row.name.split(' ')[2] + ' ' + row.name.split(' ')[3] :
                          row.name.split(' ')[1]
                    }
                    fullName={row.name}
                    id={row.id}
                    root={props}
                  />
                </View>
              ))}
            </View>
          ))}
          <Space size={20} />
          <Banner content={bottomAds} componentId={props.componentId} />
          <Space size={20} />
          <View style={{
            margin: 10
          }}>
            <Text h4 style={{
              marginLeft: 10,
              marginBottom: 10
            }}>Recomendation Product</Text>
            <View style={
              {
                flex: 1,
                flexDirection: 'row',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                margin: 10
              }
            }>
              {recomen.map((row, index) => (
                <ImageBackground
                  source={{ uri: row.brand.img.src }}
                  style={{
                    flex: 1,
                    maxWidth: '50%',
                    minHeight: 100,
                    borderRadius: 10,
                    backgroundColor: colors.primary,
                    alignItems: 'flex-start',
                    justifyContent: 'flex-end'
                  }}
                >
                  <View style={{
                    margin: 10
                  }}>
                    <Text style={{
                      color: Colors.dark,
                      fontWeight: 'bold',
                      fontSize: 18
                    }}>{row.name}</Text>
                    <Text style={{
                      color: Colors.light
                    }}>{row.desc[0].val}</Text>
                  </View>
                </ImageBackground>
              ))}
            </View>
          </View>
          <View style={{
            margin: 10
          }}>
            <Text h4 style={{
              marginLeft: 10,
              marginBottom: 10
            }}>Top Rated Product</Text>
            <View style={
              {
                flex: 1,
                flexDirection: 'row',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                margin: 10
              }
            }>
              {top.map((row, index) => (
                <ImageBackground
                  source={{ uri: row.product_image_path }}
                  style={{
                    flex: 1,
                    maxWidth: '50%',
                    minHeight: 100,
                    borderRadius: 10,
                    backgroundColor: colors.primary,
                    alignItems: 'flex-start',
                    justifyContent: 'flex-end'
                  }}
                >
                  <View style={{
                    margin: 10
                  }}>
                    <Text style={{
                      color: Colors.dark,
                      fontWeight: 'bold',
                      fontSize: 18
                    }}>{row.product_name}</Text>
                    <Text style={{
                      color: Colors.light
                    }}>{row.product_id}</Text>
                  </View>
                </ImageBackground>
              ))}
            </View>
          </View>
          <Space size={100} />
        </ScrollView>
      </SafeAreaView>
    </Fragment>
  );
};

Home.propTypes = {
  navigator: PropTypes.object,
  componentId: PropTypes.string
}

export default Home;