import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { CheckBox, Text as Rtext, Button, Icon } from 'react-native-elements'
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
import { Buttons } from '../../components/button';
import { Space } from '../../components/container';
import { setRoot, Nav } from '../../router/navigator';
import { InputLogin } from '../../components/textInput';
import { containerStyles } from '../../styles/container';
import { Colors } from '../../styles/colors';
import { textStyles } from '../../styles/text';
import { LoadingOverlay } from '../../components/loading';
import { arkApi } from '../../config/api';
import { setStorage } from '../../config/storage';
import { snackBarError, snackBarSuccess } from '../../components/snackBar';
import { documentChecker } from '../../helper/checkDocument';
import { IDR } from '../../helper/numberFormat';
import { inputStyles } from '../../styles/input';

function LoanType(props) {

  const [tenor, setTenor] = useState(3)
  const [nominal, setNominal] = useState(0)
  const [estimasi, setEstimasi] = useState('0')
  const [load, setLoad] = useState(false)
  const [periode, setPeriode] = useState([])
  const [index, setIndex] = useState(0)
  const [doLoan, setDoLoan] = useState(false)

  function thisDate(tenor) {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!

    var yyyy = today.getFullYear();
    if (dd < 10) {
      dd = '0' + dd;
    }
    if (mm < 10) {
      mm = '0' + (tenor ? mm + tenor : mm).toString();
    } else {
      mm = tenor ? mm + tenor : mm
    }
    var today = dd + '-' + mm + '-' + yyyy;
    return today;
  }

  const saveLoan = async () => {
    let adminCost = Number(props.payload.cost_administration);
    let provisi = Number(props.payload.provisi)
    let asuransi = Number(props.payload.asuransi)
    let total = Number(nominal) + Number(provisi) + Number(adminCost)
    try {
      let data = {
        date: thisDate(0),
        nominal: nominal,
        tenor: tenor,
        jasa: props.bunga,
        adminCost,
        provisi,
        asuransi,
        total,
        estimasi: estimasi,
        endDate: thisDate(tenor),
        loanProduct: {
          id: props.id,
          is_microloan: props.payload.is_microloan
        }
      }
      setStorage('myLoan', data)
    } catch (error) {
      alert(JSON.stringify(error))
    }
  }

  const checkEligible = async (num) => {
    setLoad(true)
    try {
      let body = {
        loan_amount: nominal,
        id_configuration_loan_product: props.id,
        tenor_month: periode[index].code
      }
      let res = await arkApi({ metod: 'post', svc: 'loan', url: 'checkEligible', param: null, body });
      if (res) {
        snackBarSuccess('Eligibilitas Terkonfirmasi')
        saveLoan()
        Nav({ title: 'Syarat & Ketentuan Pinjaman', page: 'ark.LoanTNC', param: null, ID: props.componentId })
        setLoad(false)
      } else {
        snackBarError('Eligibilitas Ditolak')
        setLoad(false)
      }
    } catch (err) {
      snackBarError('Eligibilitas Ditolak')
      console.log(err)
      setLoad(false);
    }
  }

  const getEstimasi = async (num) => {
    setLoad(true)
    try {
      let body = {
        loan_amount: nominal,
        id_configuration_loan_product: props.id,
        tenor_month: num
      }
      let res = await arkApi({ metod: 'post', svc: 'loan', url: 'loanSimulation', param: null, body });
      if (res) {
        setEstimasi(res.monthly_installment)
        setDoLoan(true)
        setLoad(false)
      } else {
        setLoad(false)
      }
    } catch (err) {
      alert(JSON.stringify(err));
      setLoad(false);
    }
  }

  const getPeriode = async () => {
    setLoad(true)
    try {
      let res = await arkApi({ metod: 'get', svc: 'configuration', url: 'periodeLoan', param: null, body: null });
      if (res) {
        setPeriode(res)
        setLoad(false)
      } else {
        setLoad(false)
      }
    } catch (err) {
      console.log(err)
      setLoad(false);
    }
  }

  const getNominal = (val) => {
    let newNominal = '';
    if (val.substring(0, 3) === 'Rp.') {
      newNominal = IDR(val.substring(4, val.length))
    } else {
      newNominal = IDR(val)
    }
    setNominal(newNominal);
  }

  useEffect(() => {
    getPeriode()
  }, [])

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
            <Text style={textStyles.subtitle}>Nominal Pinjaman</Text>
            <TextInput
              onChangeText={val => {
                if(val.toString().substring(0,1) !== '0'){
                  if (Number(val) <= Number(props.upTo)) {
                    setNominal(val);
                  }
                }                
              }}
              onBlur={() => {
                getEstimasi(Number(periode[index].code))
              }}
              keyboardType={'number-pad'}
              value={nominal}
              style={[
                inputStyles.textInputLogin,
                inputStyles.active,
                {
                  color: Colors.light,
                  paddingLeft: nominal.length === 0 ? 40 : 36
                }
              ]}
              // placeholder={'Nominal Pinjaman'}
              blurOnSubmit={true}
            />
            {nominal !== 0 || nominal.length !== 0 ? (
              <Text style={{
                position: 'absolute',
                top: 40,
                left: 20,
                fontSize: 18
              }}>{IDR(nominal)}</Text>
            ) : (
                <View />
              )}
            <View style={{
              flex: 1,
              marginHorizontal: 20
            }}>
              <Space size={10} />
              <Text>Pinjaman s/d Rp. {props.upTo} Dengan jasa mulai dari {props.bunga}%</Text>
            </View>
          </View>
          <Space size={20} />
          <View
            style={[containerStyles.betweenRow, {
              height: 100,
              marginHorizontal: 30
            }]}>
            <View style={[{
              flex: 1,
              backgroundColor: Colors.tightGrey,
              height: '100%',
              borderTopLeftRadius: 15,
              borderBottomLeftRadius: 15,
              alignItems: 'center',
              justifyContent: 'center'
            }
            ]}>
              <TouchableOpacity
                onPress={() => {
                  let newIndex = index - 1;
                  if (newIndex >= 0) {
                    setIndex(newIndex);
                    setDoLoan(false)
                    setTenor(Number(periode[index].code))
                  }
                }}>
                <Icon
                  type={'ionicon'}
                  size={40}
                  name={'ios-arrow-dropleft'}
                />
              </TouchableOpacity>
            </View>
            <View style={{
              flex: 3,
              backgroundColor: Colors.lightGrey,
              height: '100%',
              alignItems: 'center',
              flexDirection: 'column',
              justifyContent: 'center'
            }}>
              <Text style={textStyles.h3}>Tenor Pinjaman</Text>
              <Space size={10} />
              {periode.length > 0 ? (
                <Rtext h3>{periode[index].code}</Rtext>
              ) : (
                  <Rtext h3>{'Loading ...'}</Rtext>
                )}
            </View>
            <View style={[{
              flex: 1,
              backgroundColor: Colors.tightGrey,
              height: '100%',
              borderTopRightRadius: 15,
              borderBottomRightRadius: 15,
              alignItems: 'center',
              justifyContent: 'center'
            }
            ]}>
              <TouchableOpacity
                onPress={() => {
                  let newIndex = index + 1;
                  if (newIndex < periode.length) {
                    setIndex(newIndex)
                    setDoLoan(false)
                    setTenor(Number(periode[index].code))
                    // getEstimasi(newTenor)
                  }
                }}>
                <Icon
                  type={'ionicon'}
                  size={40}
                  name={'ios-arrow-dropright'}
                />
              </TouchableOpacity>
            </View>
          </View>
          <Space size={20} />
          <View style={[containerStyles.centerColumn, {
            backgroundColor: Colors.tightGrey,
            padding: 10
          }]}>
            <Rtext h4>Estimasi Cicilan Bulanan</Rtext>
            <Text>Angka ini hanya simulasi, hasil akhir bisa berbeda</Text>
            <Rtext h3 style={{
              fontWeight: 'bold'
            }}>{estimasi}</Rtext>
          </View>
          <Space size={20} />
          <Button
            containerStyle={{
              margin: 10,
            }}
            buttonStyle={{
              borderRadius: 12,
              padding: 15,
              backgroundColor: Colors.danger
            }}
            titleStyle={{
              fontSize: 22
            }}
            onPress={() => {
              if (nominal === 0) {
                snackBarError('Masukan Semua Data Dengan Benar')
              } else {
                if (doLoan) {
                  checkEligible()
                } else {
                  getEstimasi(Number(periode[index].code))
                }
              }
            }}
            title={doLoan ? "Ajukan Pinjaman" : "Estimasi Pinjaman"}
          />
        </ScrollView>
      </SafeAreaView>
    </Fragment>
  );
};

LoanType.propTypes = {
  navigator: PropTypes.object,
  componentId: PropTypes.string
}

export default LoanType;