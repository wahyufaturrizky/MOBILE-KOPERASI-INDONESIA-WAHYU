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
import { containerStyles } from '../../../styles/container';
import { Styles, deviceHeight } from '../../../styles';
import { Space } from '../../../components/container';
import { setRoot, Nav } from '../../../router/navigator';
import { Colors } from '../../../styles/colors';
import { arkApi } from '../../../config/api';
import { textStyles } from '../../../styles/text';
import { getStorage } from '../../../config/storage';
import { IDR } from '../../../helper/numberFormat';
import { LoanTenor } from '../../../components/card';
import { CustomButton } from '../../../components/button';


export const Loan2 = (props) => {

  const row = props.row;
  const [load, setLoad] = useState(false)
  const [loan, setLoan] = useState(false)
  const [togle, setTogle] = useState([false, false])

  useEffect(() => {
    getDetail()
  }, [])

  const getDetail = async () => {
    setLoad(true)
    let param = row.id_loan;
    try {
      let res = await arkApi({ metod: 'get', svc: 'loan', url: 'detailLoan', param, body: null });
      if (res) {
        setLoad(false)
        setLoan(res)
      } else {
        setLoad(false)
      }
    } catch (err) {
      alert(JSON.stringify(err));
      setLoad(false);
    }
  }

  const listContent = [
    {
      title: 'Tanggal Pengajuan',
      value: row.created_at.substring(0, 10)
    },
    {
      title: 'Tanggal Persetujuan',
      value: row.created_at.substring(0, 10)
    },
    {
      title: 'Pencairan Pinjaman',
      value: row.id_master_cash_installment
    },
    {
      title: 'Tanggal Pencairan',
      value: row.created_at.substring(0, 10)
    },
    {
      title: 'Total Pinjaman',
      value: IDR(row.installment)
    },
    {
      title: 'Jasa Pinjaman',
      value: row.interest + ' %'
    },
    {
      title: 'Cicilan Berikutnya',
      value: !loan ? 'Loading ...' : loan.loan_credit[0].term_payment_date
    },
  ]

  const HeaderLoanCard = (props) => {
    const active = props.active;
    return (
      <View style={[{
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        backgroundColor: Colors.danger,
        padding: 20,
        borderWidth: 1,
        borderColor: Colors.danger
      }, {
        borderBottomLeftRadius: active ? 0 : 15,
        borderBottomRightRadius: active ? 0 : 15
      }, containerStyles.betweenRow]}>
        <View style={[containerStyles.centerRow, {
          justifyContent: 'flex-start'
        }]}>
          <View style={{
            width: 30,
            height: 30,
            backgroundColor: Colors.light,
            borderRadius: 5,
            marginRight: 10
          }} />
          <Text style={[
            textStyles.h2,
            {
              color: Colors.light
            }
          ]}>{props.title}</Text>
        </View>
        <TouchableOpacity onPress={props.onPress}>
          <Icon
            name={active ? 'ios-arrow-dropdown' : 'ios-arrow-dropup'}
            type='ionicon'
            size={30}
            color={Colors.light}
          />
        </TouchableOpacity>
      </View>
    )
  }

  const LoanContent = (props) => {
    return (
      <View style={{
        flex: 1,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
        borderBottomLeftRadius: props.length - 1 === props.index ? 15 : 0,
        borderBottomRightRadius: props.length - 1 === props.index ? 15 : 0,
        backgroundColor: props.index % 2 === 0 ? Colors.light : Colors.lightGrey
      }} key={props.index.toString()}>
        <Text style={textStyles.loanLeft}>{props.row.title}</Text>
        <Text style={textStyles.h3}>{props.row.value}</Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="always" style={Styles.scrollView}>
      <Space size={5} />
      <View style={[containerStyles.centerRow, {
        padding: 20
      }]}>
        <LoanTenor title={'Tenor'} content={row.tenor_month} />
        <LoanTenor title={'Cicilan Ke-'} content={!loan ? '..' : loan.loan_credit.length} />
        <LoanTenor title={'Sisa'} content={!loan ? '..' : row.tenor_month - loan.loan_credit.length} />
      </View>
      <Space size={20} />
      <View style={{
        marginHorizontal: 10,
      }}>
        <HeaderLoanCard
          title={row.nama_produk_pinjaman}
          active={togle[0]}
          onPress={() => {
            newTogle = [...togle];
            newTogle[0] = !newTogle[0];
            setTogle(newTogle);
          }} />
        {togle[0] ? (
          <View style={[{
            borderBottomLeftRadius: 15,
            borderBottomRightRadius: 15,
            backgroundColor: Colors.lightGrey,
            borderTopWidth: 0,
            borderColor: Colors.danger,
            borderWidth: 1
          }, containerStyles.betweenColumn]}>
            {listContent.map((row, index) => (
              <LoanContent row={row} index={index} length={listContent.length} />
            ))}
          </View>
        ) : (
            <View />
          )}
      </View>
      <Space size={20} />
      <View style={{
        marginHorizontal: 10,
      }}>
        <HeaderLoanCard
          title={'Riwayat Pembayaran Cicilan'}
          active={togle[1]}
          onPress={() => {
            newTogle = [...togle];
            newTogle[1] = !newTogle[1];
            setTogle(newTogle);
          }} />
        {togle[1] ? (
          <View style={[{
            borderBottomLeftRadius: 15,
            borderBottomRightRadius: 15,
            backgroundColor: Colors.lightGrey,
            borderTopWidth: 0,
            borderColor: Colors.danger,
            borderWidth: 1
          }, containerStyles.betweenColumn]}>
            <View>
              {!loan ? (
                <Rtext>Loading ...</Rtext>
              ) : loan.loan_approval.length === 0 ? (
                <View>
                  <View style={[containerStyles.betweenRow, {
                    width: '96%',
                    alignSelf: 'center'
                  }]}>
                    {/* <Rtext h4>Belum Ada Pembayaran Cicilan</Rtext> */}
                    <View style={{
                      padding: 5
                    }}>
                      <Text style={textStyles.h3}>Tenor</Text>
                    </View>
                    <View style={{
                      padding: 5
                    }}>
                      <Text style={textStyles.h3}>Jatuh Tempo</Text>
                    </View>
                    <View style={{
                      padding: 5
                    }}>
                      <Text style={textStyles.h3}>Pembayaran</Text>
                    </View>
                    <View style={{
                      padding: 5
                    }}>
                      <Text style={textStyles.h3}>Nominal</Text>
                    </View>
                  </View>
                  <View style={[containerStyles.betweenRow, {
                    padding: 20,
                    justifyContent: 'center'
                  }]}>
                    <Rtext h4>Belum Ada Pembayaran Cicilan</Rtext>
                  </View>
                </View>
              ) : (
                    <View style={[containerStyles.betweenRow, {
                      width: '96%',
                      alignSelf: 'center',
                      paddingVertical: 8,
                      borderBottomWidth: 1,
                      borderColor: Colors.grey
                    }]}>
                      {/* <Rtext h4>Belum Ada Pembayaran Cicilan</Rtext> */}
                      <View style={{
                        padding: 5
                      }}>
                        <Text style={[textStyles.h3, {
                          fontWeight: 'normal'
                        }]}>Tenor</Text>
                      </View>
                      <View style={{
                        padding: 5
                      }}>
                        <Text style={[textStyles.h3, {
                          fontWeight: 'normal'
                        }]}>Jatuh Tempo</Text>
                      </View>
                      <View style={{
                        padding: 5
                      }}>
                        <Text style={[textStyles.h3, {
                          fontWeight: 'normal'
                        }]}>Pembayaran</Text>
                      </View>
                      <View style={{
                        padding: 5
                      }}>
                        <Text style={[textStyles.h3, {
                          fontWeight: 'normal'
                        }]}>Nominals</Text>
                      </View>
                    </View>
                  )}
            </View>
          </View>
        ) : (
            <View />
          )}
      </View>
      <Space size={60} />
    </ScrollView>    
  );
};