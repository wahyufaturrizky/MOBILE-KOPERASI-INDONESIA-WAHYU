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
import { containerStyles } from '../../styles/container';
import { Styles, deviceHeight } from '../../styles';
import { Buttons, CustomButton } from '../../components/button';
import { Space } from '../../components/container';
import { setRoot, Nav } from '../../router/navigator';
import { Colors } from '../../styles/colors';
import { LoadingOverlay } from '../../components/loading';
import { arkApi } from '../../config/api';
import { textStyles } from '../../styles/text';
import { getStorage } from '../../config/storage';
import { IDR } from '../../helper/numberFormat';
import { Loan1 } from './loan/loan1';
import { Loan2 } from './loan/loan2';
import SplashScreen from 'react-native-splash-screen';

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


function DetailLoan(props) {

  const [load, setLoad] = useState(false);
  const flag = props.row.id_workflow_status;
  const row = props.row;
  // const flag = row.id_workflow_status;

  useEffect(() => {
    SplashScreen.hide()
  }, [])

  return (
    <Fragment>
      <LoadingOverlay loading={load} />
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={{
        flex: 1
      }}>
        {flag === 'LON-001' ? (
          <Loan1 row={row} componentId={props.componentId} />
        ) : flag === 'LON-002' ? (
          <Loan2 row={row} componentId={props.componentId} />
        ) : flag === 'LON-003' ? (
          <View style={{
            width: '100%',
            height: '100%',
            backgroundColor: 'black'
          }} />
        ) : flag === 'LON-004' ? (
          <Loan2 row={row} componentId={props.componentId} />
        ) : flag === 'LON-005' ? (
          <Loan2 row={row} componentId={props.componentId} />
        ) : (
                    <Loan1 row={row} componentId={props.componentId} />
                  )}
        <View style={{
          width: '100%',
          position: 'absolute',
          bottom: 0
        }}>
          {flag === 'LON-000' ? (
            <View />
          ) : (
              flag === 'LON-001' ? (
                <CustomButton
                  color={Colors.danger}
                  title={'Cairkan Pinjaman'}
                  onPress={() => {
                    Nav({ title: 'Pencairan Pinjaman', page: 'ark.Disbursement', param: { row }, ID: props.componentId })
                  }}
                />
              ) : (
                  <CustomButton
                    color={Colors.danger}
                    title={'Info Pinjaman'}
                    onPress={() => {
                      Nav({ title: 'Info ' + row.nama_produk_pinjaman, page: 'ark.MenuRepayment', param: { row }, ID: props.componentId })                    
                    }}
                  />
                )
            )}
        </View>
      </SafeAreaView>
    </Fragment>
  );
};

DetailLoan.propTypes = {
  navigator: PropTypes.object,
  componentId: PropTypes.string
}

export default DetailLoan;