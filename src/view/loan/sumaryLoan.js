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
  TouchableOpacity,
  Modal
} from 'react-native';
import { containerStyles } from '../../styles/container';
import { Styles, deviceHeight } from '../../styles';
import { Buttons, CustomButton } from '../../components/button';
import { Space } from '../../components/container';
import { setRoot, Nav } from '../../router/navigator';
import { Colors } from '../../styles/colors';
import { LoadingOverlay } from '../../components/loading';
import { arkApi, arkPost } from '../../config/api';
import { textStyles } from '../../styles/text';
import { getStorage } from '../../config/storage';
import { DialogPassword } from '../../components/dialog';
import { snackBarError, snackBarWarning, snackBarSuccess } from '../../components/snackBar';
import { IDR } from '../../helper/numberFormat';


const initialContent = [
  {
    title: 'Tanggal Pembayaran',
    value: '01/12/2019'
  },
  {
    title: 'Nominal Pinjaman',
    value: 'Rp. 25.000.000'
  },
  {
    title: 'Tenor Pinjaman',
    value: '6 Bulan'
  },
  {
    title: 'Jasa Pinjaman',
    value: '100%'
  },
  {
    title: 'Biaya Administrasi',
    value: 'Rp. 50.000'
  },
  {
    title: 'Biaya Provisi',
    value: 'Rp. 500.000'
  },
  {
    title: 'Total Pinjaman',
    value: 'Rp. 25.500.000'
  },
  {
    title: 'Asuransi',
    value: 'Rp. 25.500.000'
  }
]

function SumaryLoan(props) {

  const [load, setLoad] = useState(false)
  const [listContent, setListContent] = useState(initialContent);
  const [end, setEnd] = useState('loading ...')
  const [estimasi, setEstimasi] = useState('loading ...')

  const [pass, setPass] = useState('');
  const [modal, setModal] = useState(false);

  const getData = async () => {
    try {
      let data = await getStorage('myLoan');
      console.log(data)
      let newContent = [...listContent];
      newContent[0].value = data.date;
      newContent[1].value = data.nominal;
      newContent[2].value = data.tenor;
      newContent[3].value = data.jasa + ' %';
      newContent[4].value = IDR(data.adminCost);
      newContent[5].value = IDR(data.provisi);
      newContent[6].value = IDR(data.total);
      newContent[7].value = IDR(data.asuransi);
      setListContent(newContent);
      setEnd(data.endDate)
      setEstimasi(data.estimasi)
    } catch (error) {
      console.log(error)
      alert(JSON.stringify(error))
    }
  }

  useEffect(() => {
    getData()
  }, [])

  const doLoan = async () => {
    setLoad(true)
    try {
      let data = await getStorage('myLoan');
      let bodyNonMicro = {
        loan_amount: listContent[1].value,
        id_configuration_loan_product: data.loanProduct.id,
        tenor_month: listContent[2].value.toString()
      }
      let bodyMicro = {
        loan_amount: listContent[1].value,
      }
      let body;
      if (data.loanProduct.is_microloan) {
        body = bodyMicro
      } else {
        body = bodyNonMicro
      }
      let res = await arkApi({ metod: 'post', svc: 'loan', url: data.loanProduct.is_microloan ? 'createMicroLoan' : 'createLoan', param: null, body });
      if (res) {
        snackBarSuccess('Pengajuan Pinjaman Sukse')
        Nav({ title: 'Selamat', page: 'ark.LoanInformation', param: null, ID: props.componentId })
        setLoad(false)
      } else {
        snackBarError('Pengajuan ' + data.loanProduct.is_microloan ? 'micro loan' : 'non micro loan' + ' Gagal')
        setLoad(false)
      }
    } catch (err) {
      console.log(err)
      alert(JSON.stringify(err));
      setLoad(false);
    }
  }

  const checkEligible = async (num) => {
    setLoad(true)
    try {
      let res = await arkApi({ metod: 'get', svc: 'loan', url: 'checkEligible', param: null, body: null });
      if (res) {
        snackBarSuccess('Eligibilitas Terkonfirmasi')
        doLoan()
        setLoad(false)
      } else {
        snackBarError('Eligibilitas Ditolak')
        setLoad(false)
      }
    } catch (err) {
      snackBarError('Eligibilitas Ditolak')
      setLoad(false);
    }
  }

  const auth = async () => {
    try {
      setLoad(true)
      let body = await getStorage('auth');
      body.password = pass;
      let login = await arkPost('login', body, 'member');
      if (login) {
        setLoad(false)
        if (login.Status === 200) {
          if (login.Data !== null) {
            // snackBarWarning('Mohon Tunggu Kami Sedang Melakukan Pengecekan Eligibilitas Anda')
            doLoan();
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

  const LoanContent = (props) => {
    return (
      <View style={{
        flex: 1,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
        borderBottomLeftRadius: props.index === (listContent.length - 1) ? 15 : 0,
        borderBottomRightRadius: props.index === (listContent.length - 1) ? 15 : 0,
        backgroundColor: props.index % 2 === 0 ? Colors.light : Colors.lightGrey
      }}>
        <Text style={textStyles.loanLeft}>{props.title}</Text>
        <Text style={textStyles.h3}>{props.content}</Text>
      </View>
    );
  }

  return (
    <Fragment>
      <DialogPassword
        show={modal}
        close={() => {
          setModal(false)
        }}
        pass={pass}
        setPass={(pass) => {
          setPass(pass)
        }}
        action={() => {
          auth()
        }}
        componentId={props.componentId}
      />
      <LoadingOverlay loading={load} />
      <StatusBar barStyle="light-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="always" style={Styles.scrollView}>
          <Space size={5} />
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
                }>Pinjaman Multiguna</Text>
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
                }>Info Cicilan Pinjaman</Text>
              </View>
            </View>
            <View style={{
              borderBottomLeftRadius: 15,
              borderBottomRightRadius: 15,
              backgroundColor: Colors.light,
              padding: 20,
              borderTopWidth: 0,
              borderWidth: 1
            }}>
              <View style={[containerStyles.betweenRow]}>
                <Text>Cicilan Perbulan</Text>
                <Text style={
                  textStyles.h3
                }>{estimasi}</Text>
              </View>
              <View style={[containerStyles.betweenRow]}>
                <Text>Tanggal Cicilan Bulanan Selesai</Text>
                <Text style={
                  textStyles.h3
                }>{end}</Text>
              </View>
            </View>
          </View>
          <Space size={20} />
          <CustomButton onPress={async() => {
            let profile = await getStorage('requireProfile');
            let employe = await getStorage('requireEmploye');
            let doc = await getStorage('requireDoc');
            if (doc.length !== 0) {
              snackBarWarning('Document Kamu Belum Lengkap');
              Nav({ title: 'Document Kurang', page: 'ark.Documents', param: null, ID: props.componentId })
            } else if(profile.length !== 0) {
              Nav({ title: 'Profile Kurang', page: 'ark.DetailProfile', param: null, ID: props.componentId })              
            } else if(employe.length !== 0) {
              Nav({ title: 'Sallary Data Kurang', page: 'ark.Employe', param: null, ID: props.componentId })              
            } else {
              setModal(true)
            }
          }}
            color={Colors.danger}
            title={'Proses Pinjaman'} />
        </ScrollView>
      </SafeAreaView>
    </Fragment>
  );
};

SumaryLoan.propTypes = {
  navigator: PropTypes.object,
  componentId: PropTypes.string
}

export default SumaryLoan;