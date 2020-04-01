import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { CheckBox, Text as Rtext, Button } from 'react-native-elements'
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StatusBar,
  TextInput
} from 'react-native';
import { Styles, deviceHeight, deviceWidth } from '../../styles';
import { Colors } from '../../styles/colors';
import { Buttons, CustomButton } from '../../components/button';
import { Space } from '../../components/container';
import { setRoot, setRootTabs, Nav } from '../../router/navigator';
import { containerStyles } from '../../styles/container';
import { textStyles } from '../../styles/text';

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


function Repayment(props) {

  const [load, setLoad] = useState(false);
  const flag = props.row.id_workflow_status;
  const row = props.row;
  // const flag = row.id_workflow_status;


  return (
    <View style={{
      flex: 1
    }}>
      <SafeAreaView style={{
        flex: 1
      }}>
        <ScrollView>
          <View style={{
            alignItems: 'center',
            paddingVertical: 40
          }}>
            <Rtext h3 style={{
              color: Colors.danger
            }}>Nomor Pinjaman</Rtext>
            <Space size={5} />
            <Rtext h3 style={{
            }}>{row.loan_number}</Rtext>
          </View>
          <View style={{
            marginHorizontal: 10,
          }}>
            <View style={[{
              borderTopLeftRadius: 15,
              borderTopRightRadius: 15,
              backgroundColor: Colors.danger,
              padding: 20,
              borderWidth: 1,
              borderColor: Colors.danger
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
                ]}>Status Pelunasan Pinjaman Dipercepat</Text>
              </View>
            </View>
            <View style={[{
              borderBottomLeftRadius: 15,
              borderBottomRightRadius: 15,
              backgroundColor: Colors.light,
              borderTopWidth: 0,
              borderColor: Colors.danger,
              borderWidth: 1,
              padding: 15
            }]}>
              {flag === 'LON-002' ? (
                <Text style={{
                  fontWeight: 'bold',
                  color: Colors.greyDark
                }}>Belum Ada Pengajuan</Text>
              ) : (
                  <View>
                    <Text style={{
                      fontWeight: 'bold',
                      color: Colors.dark
                    }}>Menunggu Konfirmasi</Text>
                    <View style={containerStyles.betweenRow}>
                      <Text style={{
                        fontWeight: 'bold',
                        color: Colors.greyDark
                      }}>Diajukan (undefined)</Text>
                      <Text style={{
                        fontWeight: 'bold',
                        color: Colors.greyDark
                      }}>Pembayaran undefined</Text>
                    </View>
                  </View>
                )}
            </View>
          </View>
          <View style={{
            margin: 20
          }}>
            <Text style={{
              color: Colors.greyDark
            }}>Pelunasan sebelum masa pinjaman habis akan dikenakan biaya penalty sesuai dengan syarat & ketentuan yang berlaku</Text>
          </View>
        </ScrollView>
        <View style={{
          width: '100%',
          position: 'absolute',
          bottom: 0
        }}>
          {flag === 'LON-002' ? (
            <CustomButton
              color={Colors.danger}
              title={'Ajukan Pelunasan Pinjaman'}
              onPress={() => {
                Nav({ title: 'Pelunasan Dipercepat', page: 'ark.TypeRepayment', param: { row }, ID: props.componentId })                                      
              }}
            />
          ) : (
              flag === 'LON-005' ? (
                <CustomButton
                  color={Colors.danger}
                  title={'Upload Bukti Pembayaran'}
                  onPress={() => {
                    Nav({ title: 'Upload Bukti Pembayaran', page: 'ark.ProofRepayment', param: { row }, ID: props.componentId })                                                          
                  }}
                />
              ) : (
                  <View />
                )
            )}
        </View>
      </SafeAreaView>
    </View>
  );
};

Repayment.propTypes = {
  navigator: PropTypes.object,
  componentId: PropTypes.string
}

export default Repayment;