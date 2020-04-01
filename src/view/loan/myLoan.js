import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { CheckBox, Text as Rtext, Button } from 'react-native-elements'
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StatusBar,
  TextInput,
  TouchableOpacity
} from 'react-native';
import { containerStyles } from '../../styles/container';
import { Styles, deviceHeight } from '../../styles';
import { Buttons } from '../../components/button';
import { Space } from '../../components/container';
import { setRoot, Nav } from '../../router/navigator';
import { Colors } from '../../styles/colors';
import { LoadingOverlay } from '../../components/loading';
import { arkApi } from '../../config/api';
import { textStyles } from '../../styles/text';
import { getStorage } from '../../config/storage';
import { IDR } from '../../helper/numberFormat';
import SplashScreen from 'react-native-splash-screen';

// LON-000	Waiting Approval	Loan
// LON-001	Waiting Disbursement Confirmation	Loan
// LON-002	Open	Loan
// LON-003	Close	Loan
// LON-999	Reject	Loan

const lon02 = {
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

function MyLoan(props) {

  const [load, setLoad] = useState(false)
  const [loan, setLoan] = useState([])
  const [show, setShow] = useState([])
  const [type, setType] = useState('all')
  const [installment, setInstallment] = useState([])

  const getLoan = async () => {
    setLoad(true)
    let data = await getStorage('user');
    let param = data.id_user;
    try {
      let res = await arkApi({ metod: 'get', svc: 'loan', url: 'getAllLoan', param, body: null });
      if (res && res !== true) {
        let newRes = [];
        newRes = res;
        // newRes.push(lon02);
        setLoad(false)
        getInstallment()
        setLoan(newRes)
        setShow(newRes)
      } else {
        setLoad(false)
      }
    } catch (err) {
      alert(JSON.stringify(err));
      setLoad(false);
    }
  }

  const getStatus = (status) => {
    try {
      // LON-000	Waiting Approval	Loan
      // LON-001	Waiting Disbursement Confirmation	Loan
      // LON-002	Open	Loan
      // LON-003	Close	Loan
      // LON-999	Reject	Loan
    } catch (error) {
      console.log(error)
    }
  }

  const getInstallment = async () => {
    setLoad(true)
    let data = await getStorage('user');
    let param = data.id_user;
    try {
      let res = await arkApi({ metod: 'get', svc: 'loan', url: 'totalInstallment', param, body: null });
      if (res) {
        setLoad(false)
        setInstallment(IDR(Number(res.total_installment)))
      } else {
        setLoad(false)
      }
    } catch (err) {
      alert(JSON.stringify(err));
      setLoad(false);
    }
  }

  useEffect(() => {
    getLoan();
    SplashScreen.hide()
  }, [])

  function doFillter(tag) {
    if (tag === 'all') {
      setShow(loan)
    } else if (tag === 'micro') {
      let newData = []
      for (let i in loan) {
        if (loan[i].is_microloan === '1') {
          newData.push(loan[i])
        }
      }
      setShow(newData)
    } else {
      let newData = []
      for (let i in loan) {
        if (loan[i].is_microloan === '0') {
          newData.push(loan[i])
        }
      }
      setShow(newData)
    }
  }

  const Status = (props) => {
    return (
      props.loan === 'LON-000' ? (
        <View>
          <Text style={{
            fontWeight: 'bold',
          }}>Menunggu
        </Text>
          <Text style={{
            fontWeight: 'bold',
          }}>Persetujuan Pinjaman
        </Text>
        </View>
      ) : (
          props.loan === 'LON-001' ? (
            <View>
              <Text style={{
                fontWeight: 'bold',
              }}>Menunggu
          </Text>
              <Text style={{
                fontWeight: 'bold',
              }}>Pencairan Peminjam
          </Text>
            </View>
          ) : (
              props.loan === 'LON-002' ? (
                <View>
                  <Text style={{
                    fontWeight: 'bold',
                  }}>Pinjaman
            </Text>
                  <Text style={{
                    fontWeight: 'bold',
                  }}>Aktif
            </Text>
                </View>
              ) : (
                  props.loan === 'LON-003' ? (
                    <View>
                      <Text style={{
                        fontWeight: 'bold',
                      }}>Pinjaman
                  </Text>
                      <Text style={{
                        fontWeight: 'bold',
                      }}>Selesai
                  </Text>
                    </View>
                  ) : (
                      props.loan === 'LON-004' ? (
                        <View>
                          <Text style={{
                            fontWeight: 'bold',
                          }}>Menunggu
                    </Text>
                          <Text style={{
                            fontWeight: 'bold',
                          }}>Konfirmasi Pelunasan
                    </Text>
                        </View>
                      ) : (
                          <View>
                            <Text style={{
                              fontWeight: 'bold',
                            }}>Upload
                  </Text>
                            <Text style={{
                              fontWeight: 'bold',
                            }}>Bukti Pembayaran
                  </Text>
                          </View>
                        )
                    )
                )
            )
        )
    )
  }

  const TopButton = (props) => {
    return (
      <TouchableOpacity style={{
        flex: 1,
        paddingVertical: 10,
        borderRadius: 100,
        backgroundColor: props.active ? Colors.danger : Colors.light,
        borderWidth: props.active ? 0 : 2,
        borderColor: Colors.danger,
        margin: 2,
        alignItems: 'center',
        justifyContent: 'center'
      }} onPress={() => {
        doFillter(props.value)
        setType(props.value)
      }}>
        <Text style={{
          color: props.active ? Colors.light : Colors.danger,
        }}>{props.title}</Text>
      </TouchableOpacity>
    )
  }

  const ListLoan = (props) => {
    const row = props.row;
    return (
      <TouchableOpacity key={props.index.toString()}
      style={
        [containerStyles.betweenRow, {
          margin: 10,
          borderBottomWidth: 1,
          borderBottomColor: Colors.grey,
          paddingBottom: 20
        }]
      } onPress={() => {
        Nav({ title: row.loan_number, page: 'ark.DetailLoan', param: { row }, ID: props.componentId })
      }}>
        <View style={{
          flex: 1
        }}>
          <Text style={textStyles.h1}>{row.nama_produk_pinjaman}</Text>
          <Text>Cicilan {row.tenor_month} x</Text>
          <Space size={10} />
          <Text>{row.id_workflow_status === 'LON-000' ? 'Tanggal pengajuan' : 'Tanggal Diterima'} {row.created_at.substring(0, 10)}</Text>
        </View>
        <View style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'flex-end'
        }}>
          <View>
            <Text style={{
            }}>{row.loan_number}
            </Text>
            <Space size={10} />
            <Status loan={row.id_workflow_status} />
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <Fragment>
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
            }}>Pembayaran Bulan Ini</Text>
            <Rtext h3 style={{
              color: Colors.light
            }}>Rp. 0</Rtext>
          </TouchableOpacity>
          <View style={{
            margin: 20
          }}>
            <View style={[containerStyles.centerRow]}>
              <TopButton title={'Semua'} active={type === 'all'} value='all' />
              <TopButton title={'Micro Loan'} active={type === 'micro'} value='micro' />
              <TopButton title={'Loan'} active={type === 'non'} value='non' />
            </View>
            {/* {loan.map((row, index) => (
              <View style={[containerStyles.betweenRow, { margin: 10 }]}>
                <View>
                  <Rtext h4>{row.name_loan_product}</Rtext>
                  <Text>Last Transaction On {row.updated_at.substring(0, 9)}</Text>
                  <Text>Time Approval Limit {row.time_approval_limit}</Text>
                </View>
                <View>
                  <Text>{row.id_master_cash}</Text>
                  <Rtext h4>{'Rp. ' + row.cost_administration}</Rtext>
                </View>
              </View>
            ))} */}
          </View>

          {show.map((row, index) => (
            <ListLoan componentId={props.componentId} row={row} index={index} />
          ))}

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
              Nav({ title: 'Ajukan Pinjaman', page: 'ark.ListLoan', param: null, ID: props.componentId })
            }}
            title="Tambah Pinjaman"
          />
        </ScrollView>
      </SafeAreaView>
    </Fragment>
  );
};

MyLoan.propTypes = {
  navigator: PropTypes.object,
  componentId: PropTypes.string
}

export default MyLoan;