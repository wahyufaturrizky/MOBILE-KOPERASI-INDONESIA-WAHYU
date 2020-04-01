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


export const Loan1 = (props) => {

  const row = props.row;
  const listContent = [
    {
      title: 'Tanggal Pembayaran',
      value: row.created_at.substring(0, 10)
    },
    {
      title: 'Nominal Pinjaman',
      value: IDR(row.loan_amount_requested)
    },
    {
      title: 'Tenor Pinjaman',
      value: row.tenor_month
    },
    {
      title: 'Jasa Pinjaman',
      value: row.interest + ' %'
    },
    {
      title: 'Biaya Administrasi',
      value: IDR(0)
    },
    {
      title: 'Biaya Provisi',
      value: IDR(row.biaya_provisi)
    },
    {
      title: 'Biaya Asuransi',
      value: IDR(row.biaya_asuransi)
    },
    // {
    //   title: 'Total Pinjaman',
    //   value: IDR(row.installment)
    // }
  ]

  useEffect(() => {
    console.log('===========================================')
    console.log(row)
  }, [])

  const LoanContent = (props) => {
    return (
      <View style={{
        flex: 1,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
        backgroundColor: props.index % 2 === 0 ? Colors.light : Colors.lightGrey
      }}>
        <Text style={textStyles.loanLeft}>{props.title}</Text>
        <Text style={textStyles.h3}>{props.content}</Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="always" style={Styles.scrollView}>
      <Space size={5} />
      <TouchableOpacity style={{
        flex: 1,
        backgroundColor: Colors.primary,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
        paddingLeft: 20,
        paddingRight: 20,
        height: 150,
        borderRadius: 10
      }} onPress={() => {
        // Nav({ title: 'Balance', page: 'ark.Balance', param: null, ID: props.componentId })
      }}>
        {row.id_workflow_status == 'LON-001' ? (
          <View>
            <Text style={{
              color: Colors.light,
              fontSize: 16,
              textAlign: 'center'
            }}>Status Pinjaman</Text>
            <Space size={10} />
            <Text style={{
              color: Colors.light,
              fontSize: 18,
              textAlign: 'center'
            }}>Pinjaman Disetujui</Text>
            <Space size={10} />
            <Rtext h3 style={{
              color: Colors.light,
              textAlign: 'center'
            }}>Dengan Nominal {IDR(row.loan_amount_approved)}</Rtext>
            <Space size={5} />
            <Text style={{
              color: Colors.light,
              textAlign: 'center'
            }}>Segera proses pencairan pinjaman apabila anda setuju dengan nominal pinjaman yang diberikan</Text>
          </View>
        ) : (
            <View>
              <Text style={{
                color: Colors.light,
                fontSize: 16
              }}>Status Pinjaman</Text>
              <Space size={20} />
              <Rtext h3 style={{
                color: Colors.light,
                textAlign: 'center'
              }}>Menunggu Persetujuan Pinjaman</Rtext>
            </View>
          )}
      </TouchableOpacity>
      <Space size={20} />
      <View style={{
        marginHorizontal: 10,
      }}>
        <View style={[{
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
          backgroundColor: Colors.lightGrey,
          padding: 20,
          borderWidth: 1
        }, containerStyles.betweenRow]}>
          <View style={[containerStyles.centerRow, {
            justifyContent: 'flex-start'
          }]}>
            <View style={{
              width: 30,
              height: 30,
              backgroundColor: Colors.dark,
              borderRadius: 5,
              marginRight: 10
            }} />
            <Text style={
              textStyles.h2
            }>{row.nama_produk_pinjaman}</Text>
          </View>
          <TouchableOpacity>
            <Icon
              name={'ios-arrow-dropdown'}
              type='ionicon'
              size={30}
              color={Colors.grey}
            />
          </TouchableOpacity>
        </View>
        <View style={[{
          borderBottomLeftRadius: 15,
          borderBottomRightRadius: 15,
          backgroundColor: Colors.lightGrey,
          borderTopWidth: 0,
          borderWidth: 1
        }, containerStyles.betweenColumn]}>
          {listContent.map((row, index) => (
            <LoanContent title={row.title} content={row.value} index={index} />
          ))}
        </View>
      </View>
      <Space size={60} />
    </ScrollView>
  );
};