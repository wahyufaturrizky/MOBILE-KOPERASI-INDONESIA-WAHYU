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
import { InputLogin } from '../../components/textInput';

function Disbursement(props) {

  const [load, setLoad] = useState(false)
  const [pass, setPass] = useState('');
  const [modal, setModal] = useState(false);
  const [nominal, setNominal] = useState(0);
  const [user, setUser] = useState('');
  const row = props.row

  const getData = async () => {
    const data = await getStorage('user');
    setUser(data);
  }

  useEffect(() => {
    getData()
  }, [])

  const doLoan = async () => {
    setLoad(true)
    try {
      let body = {
        id_loan: row.id_loan,
        disbursement: [
          {
            account_number: user.account_bank,
            account_type: "String",
            account_name: user.name_bank,
            total_disburse: nominal.toString(),
            id_disbursement_type: "DSRB-001"
          }
        ]
      }
      let res = await arkApi({ metod: 'post', svc: 'loan', url: 'disbursement', param: null, body });
      if (res) {
        snackBarSuccess('Pengajuan Pinjaman Sukses')
        Nav({ title: 'Selamat', page: 'ark.LoanInformation', param: { message: 'Selamat Pencairan Pinjaman Berhasil' }, ID: props.componentId })
        setLoad(false)
      } else {
        snackBarError('Pencairan Pinjaman Gagal')
        setLoad(false)
      }
    } catch (err) {
      console.log(err)
      alert(JSON.stringify(err));
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
            <Text style={{
              color: Colors.light,
              fontSize: 16
            }}>Nominal Persetujuan Pinjaman</Text>
            <Space size={20} />
            <Rtext h3 style={{
              color: Colors.light,
              textAlign: 'center'
            }}>{row.loan_amount_approved}</Rtext>
          </TouchableOpacity>
          <Space size={20} />
          <View style={{
            margin: 20
          }}>
          <Text style={textStyles.title}>Chanel Pencairan Pinjaman</Text>
          <Space size={5} />
          <Text style={textStyles.subtitle}>Rekening Bank</Text>
          <Text style={{
            color: Colors.grey
          }}>Rekening {user.name_bank} - {user.account_bank}</Text>
          </View>
          <InputLogin
            placeholder={'Masukan Nominal'}
            onChangeText={val => setNominal(val)}
            value={nominal}
            keyboardType={'number-pad'}            
          />
          <Space size={40} />

          <CustomButton onPress={async () => {
            setModal(true)
          }}
            color={Colors.danger}
            title={'Proses Pencairan'} />
        </ScrollView>
      </SafeAreaView>
    </Fragment>
  );
};

Disbursement.propTypes = {
  navigator: PropTypes.object,
  componentId: PropTypes.string
}

export default Disbursement;