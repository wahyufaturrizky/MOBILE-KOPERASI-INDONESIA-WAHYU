import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Dialog, { DialogFooter, DialogButton, DialogContent, DialogTitle } from 'react-native-popup-dialog';
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
import { Styles, deviceHeight, deviceWidth } from '../../styles';
import { Colors } from '../../styles/colors';
import { Buttons, CustomButton } from '../../components/button';
import { Space } from '../../components/container';
import { setRoot, setRootTabs, Nav } from '../../router/navigator';
import { containerStyles } from '../../styles/container';
import { textStyles } from '../../styles/text';
import { getStorage } from '../../config/storage';
import { arkApi, arkPost } from '../../config/api';
import { IDR } from '../../helper/numberFormat';
import { snackBarWarning, snackBarError } from '../../components/snackBar';
import { LoadingOverlay } from '../../components/loading';

const row = {
  "id_loan": "5D9080D0-3A85-11EA-9385-035CDD85967F",
  "id_user": "1CE86F60-2B7B-11EA-A2B5-B7974A4CF7CA",
  "id_user_company": "807938D0-2F7D-11EA-AF83-CD9FDABA8A9F",
  "id_configuration_loan_product": "DB9CEDA0-3A84-11EA-829F-51193EFBED5F",
  "id_master_cash": "MC-0003",
  "plan_repayment_date": null,
  "loan_amount_requested": "450000.0000",
  "loan_amount_approved": null,
  "tenor_month": "3",
  "installment": "450000.0000",
  "is_flat": "0",
  "count_approval_stage": null,
  "id_workflow_status": "LON-002",
  "interest": "0",
  "interest_penalty": "0",
  "is_microloan": "0",
  "created_at": "2020-01-19 13:31:46",
  "created_by": "7E500E00-2F7D-11EA-AA0C-E9E7DBA35AF5",
  "updated_at": "2020-01-21 17:26:26",
  "updated_by": null,
  "deleted_at": null,
  "deleted_by": null,
  "id_master_cash_installment": "MC-0003",
  "id_interest_type": "MIT-0001",
  "plan_disbursement_date": null,
  "loan_number": "LN/26/20200119/00002",
  "id_member_anggota": "00011",
  "name_member": "jasmine",
  "biaya_provisi": "3000.0000",
  "biaya_asuransi": "3000",
  "nama_produk_pinjaman": "Pinjaman Multiguna",
  "nama_perusahaan": "PT. BIBIT UNGGUL BUAYA",
  "nama_koperasi": "KOPERASI SYARIAH",
  "nama_interest": "FLAT",
  "deskripsi_pinjaman": "multiguna property",
  "total_pelunasan": null,
  "tanggal_valid_pelunasan": null,
  "upload_bukti_pelunasan": "https://arkamaiadevstorage.blob.core.windows.net/arkamaia-26/evidence-zO6lsJOy2C.jpeg",
  "alasan_pelunasan": null,
  "total_loan_disburse": null,
  "id_holding": null
}

const initialCalc = {
  "tenor_month": "1",
  "tenor_remaining": 1,
  "total_loan": "17000.0000",
  "interest": "0",
  "interest_penalty": "10",
  "interest_penalty_type": "percentage",
  "total_repayment": 0
}

const Detail = (props) => {
  return (
    <View style={[containerStyles.betweenRow, {
      paddingVertical: 5,
      width: '94%'
    }]}>
      <View>
        <Text style={{
          fontSize: 16,
          fontWeight: 'bold',
          color: Colors.grey
        }}>{props.title}</Text>
      </View>
      <View>
        <Text style={{
          fontSize: 17,
          fontWeight: 'bold',
        }}>{props.content}</Text>
      </View>
    </View>
  )
}


function LoanInformation(props) {

  const [load, setLoad] = useState(false);
  const [togle, setTogle] = useState([false, false])

  const flag = props.row.id_workflow_status;
  const row = props.row;
  // const flag = row.id_workflow_status;

  const [repay, setRepay] = useState(false);

  const [pass, setPass] = useState('');
  const [hidePass, setHidePass] = useState(true);
  const [modal, setModal] = useState(false);

  const getCalculation = async () => {
    setLoad(true)
    let data = await getStorage('user');
    let body = {
      id_loan: row.id_loan,
      id_user: data.id_user,
      id_grade: data.user_company.id_grade
    };
    try {
      let res = await arkApi({ metod: 'post', svc: 'loan', url: 'calcRepayment', param: null, body });
      if (res) {
        setRepay(res)
        setLoad(false)
      } else {
        setLoad(false)
      }
    } catch (err) {
      alert(JSON.stringify(err));
      setLoad(false);
    }
  }

  const doRepayment = async () => {
    setLoad(true)
    let body = {
      id_loan: row.id_loan,
      is_full: 1
    };
    try {
      let res = await arkApi({ metod: 'post', svc: 'loan', url: 'reqRepayment', param: null, body });
      if (res) {
        setLoad(false)
        Nav({ title: 'Pengajuan Berhasil', page: 'ark.LoanInformation', param: {message: 'Pengajuan Pelunasan Pinjaman Dipercepat'}, ID: props.componentId })        
      } else {
        setLoad(false)
      }
    } catch (err) {
      console.log(err)
      alert(JSON.stringify(err));
      setLoad(false);
    }
  }

  const Content = () => {
    return (
      <View style={{
        borderRadius: 15,
        borderWidth: 1,
        borderColor: Colors.danger,
        padding: 10,
        alignItems: 'center'
      }}>
        <Text style={[textStyles.subtitle, {
          color: Colors.danger,
          fontWeight: 'bold',
          textAlign: 'center'
        }]}>
          Total Pembayaran Pelunasan Pinjaman
        </Text>
        <Rtext h3 style={{
          margin: 10
        }}>{!repay ? 'Rp. Tidak Diketahui' : IDR(repay.total_repayment)}</Rtext>
        <Text style={[textStyles.subtitle, {
          fontWeight: 'bold',
          textAlign: 'center'
        }]}>
          Sudah termasuk denda penalti
        </Text>
        <Space size={20} />
        <View style={{
          alignSelf: 'flex-start',
          padding: 10
        }}>
          <Text style={[textStyles.subtitle, {
            color: Colors.danger,
            fontWeight: 'bold',
            textAlign: 'center'
          }]}>
            Info Pinjaman
        </Text>
        </View>
        <Detail title={'Nominal Pinjaman'} content={row.installment} />
        <Detail title={'Tenor Pinjaman'} content={row.tenor_month} />
        <Detail title={'Jasa Pinjaman'} content={row.interest} />
        <Detail title={'Cicilan Berikutnya Ke -'} content={!repay ? 'undefined' : (Number(row.tenor_month) - repay.tenor_remaining)} />
        <Detail title={'Sisa Cicilan'} content={!repay ? 'undefined' : repay.tenor_remaining} />
        <Detail title={'Penalty Pelunasan Dipercepat'} content={!repay ? 'undefined' : repay.interest_penalty + '%'} />
      </View>
    )
  }

  const checkUser = async () => {
    try {
      setLoad(true)
      let body = await getStorage('auth');
      body.password = pass;
      let login = await arkPost('login', body, 'member');
      if (login) {
        setLoad(false)
        if (login.Status === 200) {
          if (login.Data !== null) {
            doRepayment();
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

  useEffect(() => {
    getCalculation()
  }, [])


  return (
    <View style={{
      flex: 1
    }}>
      <SafeAreaView style={{
        flex: 1
      }}>
      <LoadingOverlay loading={load} />
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
                    checkUser()
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
        <ScrollView
          contentInsetAdjustmentBehavior="always" style={[Styles.body]}>
          <View style={{
            margin: 20
          }}>
            <Rtext h3 style={{
              color: Colors.danger
            }}>Pilih Metode Pelunasan</Rtext>
            <Space size={20} />
            <TouchableOpacity style={[{
              padding: 10,
              borderRadius: 15,
              borderWidth: 1,
              borderColor: Colors.danger
            }, containerStyles.leftRow]} onPress={() => {
              let newTogle = [...togle];
              newTogle[0] = !newTogle[0]
              setTogle(newTogle)
            }}>
              <Icon
                name={togle[0] ? 'md-radio-button-on' : 'md-radio-button-off'}
                type={'ionicon'}
                color={Colors.danger}
                size={30}
              />
              <View style={{
                marginLeft: 10
              }}>
                <Text style={textStyles.subtitle}>Seluruhnya</Text>
              </View>
              <Space size={20} />
            </TouchableOpacity>
            <Space size={10} />
            {togle[0] ? (
              <Content />
            ) : (
                <View />
              )}
            <TouchableOpacity style={[{
              padding: 10,
              borderRadius: 15,
              borderWidth: 1,
              borderColor: Colors.danger
            }, containerStyles.leftRow]} onPress={() => {
              snackBarWarning('Under Construction')
              // let newTogle = [...togle];
              // newTogle[0] = !newTogle[0]
              // setTogle(newTogle)
            }}>
              <Icon
                name={togle[1] ? 'md-radio-button-on' : 'md-radio-button-off'}
                type={'ionicon'}
                color={Colors.danger}
                size={30}
              />
              <View style={{
                marginLeft: 10
              }}>
                <Text style={textStyles.subtitle}>Sebagian</Text>
              </View>
            </TouchableOpacity>
            <Space size={10} />
          </View>
        </ScrollView>
        <View style={{
          width: '100%',
          position: 'absolute',
          bottom: 0
        }}>
          <CustomButton
            color={Colors.danger}
            title={'Ajukan'}
            onPress={() => {              
              if(!togle[0] && !togle[1]){
                snackBarError('Metode Pelunasan Tidak Boleh Kosong')
              } else {
                setModal(true)
              }
            }}
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

LoanInformation.propTypes = {
  navigator: PropTypes.object,
  componentId: PropTypes.string
}

export default LoanInformation;