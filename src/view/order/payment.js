import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Text, Icon, Button, CheckBox } from 'react-native-elements';
import ImagePicker from 'react-native-image-picker';
import Dialog, { DialogFooter, DialogButton, DialogContent, DialogTitle } from 'react-native-popup-dialog';
import {
  SafeAreaView,
  ScrollView,
  View,
  StatusBar,
  Image,
  Picker,
  TouchableOpacity,
  Modal,
  Alert,
  TextInput
} from 'react-native';
import { IDR } from '../../helper/numberFormat';
import { Styles, deviceHeight, deviceWidth } from '../../styles';
import { containerStyles } from '../../styles/container';
import { Colors } from '../../styles/colors';
import { InputLogin, InputImage, InputIcon } from '../../components/textInput';
import { Buttons, CustomButton } from '../../components/button';
import { Space } from '../../components/container';
import logo from '../../assets/images/initial-profile.png'
import { arkFormPost, arkPost, arkApi } from '../../config/api';
import { Nav } from '../../router/navigator';
import { LoadingOverlay } from '../../components/loading';
import { snackBarSuccessOK, snackBarWarning, snackBarError } from '../../components/snackBar';
import { resValid, reqOtpValid } from '../../config/validator';
import img from '../../assets/images/chuwi.jpg';
import { getStorage } from '../../config/storage';
import { inputStyles } from '../../styles/input';

function Payment(props) {

  const [user, setUser] = useState(false);
  const [company, setCompany] = useState(false);
  const [load, setLoad] = useState(false);
  const [pass, setPass] = useState('');
  const [hidePass, setHidePass] = useState(true);
  const [modal, setModal] = useState(false);
  const [check, setCheck] = useState(false);
  const [pay, setPay] = useState(0);
  const [total, setTotal] = useState(props.total ? Number(props.total) : 0);
  const [ID, setID] = useState('');
  const [micro, setMicro] = useState({
    title: 'Micro Balance',
    value: 0,
    amount: 0,
    check: false
  });
  const [loan, setLoan] = useState({
    title: 'Loan Balance',
    value: 0,
    amount: 0,
    check: false
  });
  const [saving, setSaving] = useState({
    title: 'Saving Balance',
    value: 0,
    amount: 0,
    check: false
  });

  const options = {
    title: 'Select Avatar',
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
  };

  const getIdConfigLoan = async () => {
    setLoad(true)
    try {
      const data = await getStorage('user');
      const grade = data.user_company.id_grade;
      let res = await arkApi({ metod: 'get', svc: 'configuration', url: 'getIDMicroLoan', param: grade, body: null });
      if (res) {
        setLoad(false)
        if (res.length > 0) {
          setID(res[0].id_configuration_loan_product)
        } else {
          setID('noIDfound')
        }
      } else {
        setLoad(false)
      }
    } catch (err) {
      alert(JSON.stringify(err));
      setLoad(false);
    }
  }

  const deleteCart = async () => {
    try {
      setLoad(true)
      async function deleter(id) {
        try {
          let res = await arkApi({ metod: 'delete', svc: 'product', url: 'delCart', param: id, body: null });
          console.log(res)
          setLoad(false)
        } catch (error) {
          console.log(error)
        }
      }
      setLoad(false)

      const cart = await getStorage('cart');
      for (let i in cart) {
        for (let j in cart[i].product) {
          if (cart[i].product[j].check) {
            deleter(cart[i].product[j]._id)
          }
        }
      }
      setLoad(false)
    } catch (err) {
      setLoad(false)
      console.log(err)
      alert(JSON.stringify(err))
    }
  }

  const getBalance = async () => {
    try {
      setLoad(true);
      let res = await arkApi({ metod: 'get', svc: 'member', url: 'balance', param: null, body: null });
      if (res) {
        setLoad(false);
        let total = props.total ? Number(props.total) : 0;
        let newMicro = { ...micro };
        newMicro.amount = res.microloan_balance;
        newMicro.value = total;
        setPay(Number(total));
        setMicro(newMicro);


        let newLoan = { ...loan };
        newLoan.amount = res.loan_balance
        setLoan(newLoan)

        let newSaving = { ...saving };
        newSaving.amount = res.saving_balance
        setSaving(newSaving)
      }
    } catch (err) {
      console.log(err)
      setLoad(false);
    }
  }

  const letsPayment = async () => {
    try {
      setLoad(true);
      let payments = {
        "PAY-001": micro.value,
        "PAY-002": loan.value,
        "PAY-003": saving.value
      }
      let url = '';
      let body = {};
      if (props.flag === 'pulsa') {
        body = {
          id_product: props.payload.id_product,
          payments,
          phone: props.param,
          id_configuration_loan_product: ID,
          id_company: user.user_company.id_company,
          id_koperasi: user.id_koperasi,
          company_name: company.name_company
        }
        url = 'pulsaPay'
      } else if (props.flag === 'listrik') {
        body = {
          id_product: props.payload.id_product,
          payments,
          no_listrik: props.param,
          id_configuration_loan_product: ID,
          id_company: user.user_company.id_company,
          id_koperasi: user.id_koperasi,
          company_name: company.name_company
        }
        url = 'listrikPay'
      } else {
        setLoad(false)
        console.log(props)
        body = {
          payments,
          id_configuration_loan_product: ID,
          deliveries: props.products.deliveries,
          products: props.products.products,
          id_company: user.user_company.id_company,
          id_koperasi: user.id_koperasi,
          company_name: company.name_company
        }
        url = 'productPay'
      }
      let res = await arkApi({ metod: 'post', svc: 'order', url, param: null, body });
      if (res) {
        if (props.flag === 'product') {
          deleteCart();
        }
        Nav({ title: 'Payment Information', page: 'ark.PaymentInformation', param: null, ID: props.componentId })
        setLoad(false)
      } else {
        snackBarError('Uhh Ohhh... Pembayaran Gagal')
        setLoad(false);
      }
    } catch (error) {
      console.log(error)
      alert(JSON.stringify(error))
      setLoad(false);
    }
  }

  const doPayment = async () => {
    try {
      setLoad(true)
      let body = await getStorage('auth');
      body.password = pass;
      let login = await arkPost('login', body, 'member');
      if (login) {
        setLoad(false)
        if (login.Status === 200) {
          if (login.Data !== null) {
            letsPayment();
            setModal(false)
          } else {
            snackBarError('Password Salah')
          }
        } else {
          snackBarError('Internal Server Error')
        }
      }
    } catch (err) {
      setLoad(false)
      console.log(err)
      alert(JSON.stringify(err))
    }
  }

  const getCompany = async (data) => {
    try {
      let res = await arkApi({ metod: 'get', svc: 'master', url: 'detailCompany', param: data.user_company.id_company, body: null });
      if (res) {
        setCompany(res)
      }
    } catch (err) {
      console.log(err)
      setLoad(false);
    }
  }

  const getUserData = async () => {
    const data = await getStorage('user');
    getCompany(data)
    setUser(data)
  }

  useEffect(() => {
    getBalance()
    getIdConfigLoan()
    getUserData()
  }, [])

  function pushPage(title, page) {
    Nav({ title: title, page, param: null, ID: props.componentId })
  }

  return (
    <Fragment>
      <Dialog
        width={deviceWidth - 30}
        visible={modal}
        onTouchOutside={() => {
          setModal(false)
        }}
        dialogTitle={
          <View style={{
            padding: 20
          }}>
            <Text h3>Password</Text>
          </View>
        }
        footer={
          <DialogFooter>
            <View style={{
              flex: 1,
            }}>
              <CustomButton
                color={Colors.danger}
                title={'KONFIRMASI'}
                onPress={() => {
                  doPayment()
                }}
              />
            </View>
          </DialogFooter>
        }
      >
        <DialogContent>
          <View style={{
            marginTop: 20,
            marginBottom: 10,
          }}>
            <View style={[{
              borderRadius: 15,
              borderWidth: 1,
              borderColor: Colors.grey,
              padding: 5,
              flexDirection: 'row',
              justifyContent: 'space-between'
            }]}>
              <TextInput
                value={pass}
                secureTextEntry={hidePass}
                style={{
                  padding: 5,
                  width: deviceWidth - 130,
                }}
                onChangeText={e => setPass(e)} />
              <TouchableOpacity onPress={() => {
                setHidePass(!hidePass)
              }}>
                <Icon
                  name={hidePass ? 'ios-eye-off' : 'ios-eye'}
                  type='ionicon'
                  containerStyle={{
                    paddingVertical: 10,
                    paddingRight: 20
                  }}
                  color={Colors.grey}
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={() => {
                Nav({ title: 'Forgot Password', page: 'ark.Forgot', param: null, ID: props.componentId })
              }}>
              <Text style={{
                fontSize: 18,
                textAlign: 'right',
                marginTop: 10
              }}>Lupa Password ?</Text>
            </TouchableOpacity>
          </View>
        </DialogContent>
      </Dialog>
      <LoadingOverlay loading={load} />
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={{
        flex: 1
      }}>
        <ScrollView
          contentInsetAdjustmentBehavior="always" style={Styles.scrollView}>
          <Space size={10} />
          <View style={{
            margin: 20
          }}>
            <View style={{
              padding: 20,
              borderBottomWidth: 1,
              borderBottomColor: Colors.tightGrey,
            }}>
              <Text style={{
                color: Colors.greyDark,
                fontWeight: 'bold',
                textAlign: 'center'
              }}>
                Total Tagihan
              </Text>
              <Text h2 style={{
                color: Colors.greyDark,
                textAlign: 'center'
              }}>
                {IDR(props.total)}
              </Text>
            </View>

            {/* gak dibikin dinamis karna ada eror react native text input ada bug auto gak fokus */}

            <View style={[containerStyles.centerRow, {
              marginTop: 20,
            }]}>
              <View style={{
                flex: 1,
                marginLeft: -10
              }}>
                <CheckBox
                  containerStyle={{
                    width: 100,
                  }}
                  checked={micro.check}
                  onPress={() => {
                    setMicro({ ...micro, check: !micro.check })
                  }}
                />
              </View>
              <View style={Styles.paymentContainer}>
                <View style={{
                  flex: 3,
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  justifyContent: 'center',
                }}>
                  <Text style={{
                    color: Colors.light
                  }}>{micro.title}</Text>
                  <Text style={{
                    marginTop: 2,
                    fontWeight: 'bold',
                    color: Colors.light
                  }}>Saldo</Text>
                  <Text style={{
                    marginTop: 2,
                    fontWeight: 'bold',
                    color: Colors.light
                  }}>{IDR(micro.amount)}</Text>
                </View>
                <View style={{
                  flex: 4,
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <View style={{
                    width: '100%'
                  }}>
                    {micro.check ? (
                      <InputLogin
                        autoFocus
                        onChangeText={value => {
                          if (Number(value) <= micro.amount) {
                            setMicro({ ...micro, value: value });
                            setPay(Number(loan.value) + Number(saving.value) + Number(value))
                          } else {
                            snackBarWarning('Saldo Kamu Tidak Mencukupi')
                          }
                        }}
                        value={micro.value}
                        disable={!micro.check}
                        keyboardType={'number-pad'} />
                    ) : (
                        <Text style={inputStyles.textInputLogin}>{micro.value}</Text>
                      )}
                  </View>
                </View>
              </View>
            </View>

            <View style={[containerStyles.centerRow, {
              marginTop: 20,
            }]}>
              <View style={{
                flex: 1,
                marginLeft: -10
              }}>
                <CheckBox
                  containerStyle={{
                    width: 100,
                  }}
                  checked={loan.check}
                  onPress={() => {
                    setLoan({ ...loan, check: !loan.check })
                  }}
                />
              </View>
              <View style={Styles.paymentContainer}>
                <View style={{
                  flex: 3,
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  justifyContent: 'center',
                }}>
                  <Text style={{
                    color: Colors.light
                  }}>{loan.title}</Text>
                  <Text style={{
                    marginTop: 2,
                    fontWeight: 'bold',
                    color: Colors.light
                  }}>Saldo</Text>
                  <Text style={{
                    marginTop: 2,
                    fontWeight: 'bold',
                    color: Colors.light
                  }}>{IDR(loan.amount)}</Text>
                </View>
                <View style={{
                  flex: 4,
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <View style={{
                    width: '100%'
                  }}>
                    {loan.check ? (
                      <InputLogin
                        onChangeText={value => {
                          if (Number(value) <= loan.amount) {
                            setLoan({ ...loan, value: value });
                            setPay(Number(loan.value) + Number(saving.value) + Number(value))
                          } else {
                            snackBarWarning('Saldo Kamu Tidak Mencukupi')
                          }
                        }}
                        value={loan.value}
                        disable={!loan.check}
                        keyboardType={'number-pad'} />
                    ) : (
                        <Text style={inputStyles.textInputLogin}>{loan.value}</Text>
                      )}
                  </View>
                </View>
              </View>
            </View>            

            <View style={[containerStyles.centerRow, {
              marginTop: 20,
            }]}>
              <View style={{
                flex: 1,
                marginLeft: -10
              }}>
                <CheckBox
                  containerStyle={{
                    width: 100,
                  }}
                  checked={saving.check}
                  onPress={() => {
                    setSaving({ ...saving, check: !saving.check })
                  }}
                />
              </View>
              <View style={Styles.paymentContainer}>
                <View style={{
                  flex: 3,
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  justifyContent: 'center',
                }}>
                  <Text style={{
                    color: Colors.light
                  }}>{saving.title}</Text>
                  <Text style={{
                    marginTop: 2,
                    fontWeight: 'bold',
                    color: Colors.light
                  }}>Saldo</Text>
                  <Text style={{
                    marginTop: 2,
                    fontWeight: 'bold',
                    color: Colors.light
                  }}>{IDR(saving.amount)}</Text>
                </View>
                <View style={{
                  flex: 4,
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <View style={{
                    width: '100%'
                  }}>
                    {saving.check ? (
                      <InputLogin
                        onChangeText={value => {
                          if (Number(value) <= saving.amount) {
                            setSaving({ ...saving, value: value });
                            setPay(Number(micro.value) + Number(loan.value) + Number(value))
                          } else {
                            snackBarWarning('Saldo Kamu Tidak Mencukupi')
                          }
                        }}
                        value={saving.value}
                        disable={!saving.check}
                        keyboardType={'number-pad'} />
                    ) : (
                        <Text style={inputStyles.textInputLogin}>{saving.value}</Text>
                      )}
                  </View>
                </View>
              </View>
            </View>      

          </View>
          <View style={[containerStyles.betweenRow, {
            padding: 20,
            borderBottomWidth: 1,
            borderTopWidth: 1,
            borderColor: Colors.tightGrey
          }]}>
            <View>
              <Text>Total Pembayaran</Text>
              <Text>Total Tagihan</Text>
            </View>
            <View>
              <Text>{IDR(pay)}</Text>
              <Text>{IDR(total - pay)}</Text>
            </View>
          </View>
          <Space size={20} />
          <TouchableOpacity
            onPress={() => {
              Nav({ title: 'Top Up Balance', page: 'ark.Loan', param: null, ID: props.componentId })
            }}>
            <Text h4 style={{
              color: Colors.greyDark,
              textAlign: 'center'
            }}>Top-Up Balance ?</Text>
          </TouchableOpacity>
          <Space size={20} />
          <CustomButton
            color={Colors.danger}
            title={'Payment'}
            onPress={() => {
              if (total - pay < 0) {
                snackBarWarning('Pembayaran mu melebihi total tagihan')
              } else if (total - pay > 0) {
                snackBarWarning('Pembayaran mu kurang dari total tagihan')
              } else {
                setModal(true)
              }
            }}
          />
        </ScrollView>
      </SafeAreaView>
    </Fragment >
  );
};

Payment.propTypes = {
  navigator: PropTypes.object,
  componentId: PropTypes.string
}

export default Payment;
