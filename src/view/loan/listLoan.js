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
import { Styles, deviceHeight } from '../../styles';
import { textStyles } from '../../styles/text';
import { Buttons } from '../../components/button';
import { Space } from '../../components/container';
import { setRoot, Nav } from '../../router/navigator';
import { containerStyles } from '../../styles/container';
import { Colors } from '../../styles/colors';
import { TouchableOpacity } from 'react-native';
import { arkApi } from '../../config/api';
import { getStorage, setStorage } from '../../config/storage';
import { LoadingOverlay } from '../../components/loading';
import { documentChecker } from '../../helper/checkDocument';
import { snackBarError } from '../../components/snackBar';

function ListLoan(props) {

  const [loan, setLoan] = useState([]);
  const [load, setLoad] = useState(false);
  const [doc, setDoc] = useState([])
  const [docCheck, setDocCheck] = useState(true);
  const [full, setFull] = useState([]);
  const [employ, setEmploy] = useState([]);

  const getLoan = async () => {
    setLoad(true)
    let data = await getStorage('user');
    let param = data.user_company.id_grade;
    try {
      let res = await arkApi({ metod: 'get', svc: 'configuration', url: 'configLoan', param, body: null });
      if (res) {
        let data = [];
        for (let i in res) {
          data.push({
            id_configuration_loan_product: res[i].id_configuration_loan_product,
            id_configuration_loan: res[i].id_configuration_loan,
            name_loan_product: res[i].name_loan_product,
            created_at: res[i].created_at,
            ceiling: res[i].ceiling,
            interest: res[i].interest,
            cost_administration: res[i].cost_administration,
            is_microloan: res[i].is_microloan === '0' ? false : true,
            provisi: res[i].biaya_provisi,
            asuransi: res[i].biaya_asuransi
          })
        }
        setLoan(data)
        setLoad(false)
      } else {
        setLoad(false)
      }
    } catch (err) {
      alert(JSON.stringify(err));
      setLoad(false);
    }
  }

  const checkAll = async (num) => {
    try {
      let full = await arkApi({ metod: 'get', svc: 'loan', url: 'checkFulFillment', param: null, body: null });
      let employ = await arkApi({ metod: 'get', svc: 'loan', url: 'checkEmploy', param: null, body: null });

      let newFull = [];
      let newEmploy = [];
      let fullKey = Object.keys(full);
      for (let i in fullKey) {
        if (full[fullKey[i]].length === 0) {
          newFull.push(fullKey[i])
        }
      }
      let employKey = Object.keys(employ);
      for (let i in employKey) {
        if (employ[employKey[i]].length === 0) {
          newEmploy.push(employ[i])
        }
      }
      setStorage('requireProfile', newFull)
      setStorage('requireEmploye', newEmploy)
      setDocCheck(false)      
      setFull(newFull)
      setEmploy(newEmploy)
    } catch (err) {
      alert(JSON.stringify(err));
      setLoad(false);
    }
  }

  const getDocuments = async () => {
    try {
      let doc = await documentChecker();
      if (doc) {
        setDoc(doc)
        setStorage('requireDoc', doc)
        checkAll()
      }
    } catch (error) {
      console.log(error)
      snackBarError('Checking Document Failed')
    }
  }

  useEffect(() => {
    getLoan();
    getDocuments()
  }, [])

  const List = (props) => {
    return (
      <TouchableOpacity style={[{
        marginHorizontal: 20,
        marginVertical: 5,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: Colors.dark,
        padding: 20
      }, containerStyles.centerRow]}
        onPress={props.onPress}
      >
        <View style={{
          flex: 1,
          height: 70,
          width: 70,
          backgroundColor: Colors.dark,
          borderRadius: 15
        }} />
        <View style={[
          containerStyles.betweenColumn,
          {
            flex: 3,
            paddingLeft: 20,
          }
        ]}>
          <Rtext h4 style={{
            textAlign: 'left',
            alignSelf: 'flex-start'
          }}>{props.title}</Rtext>
          <View>
            <Text>Pinjaman s/d Rp. {props.upTo}</Text>
            <Text>Dengan jasa mulai dari {props.bunga}%</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <Fragment>
      <LoadingOverlay loading={load} />
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={{
        flex: 1
      }}>
        <ScrollView
          contentInsetAdjustmentBehavior="always" style={[Styles.body]}>
          {loan.map((row, index) => (
            <List
              title={row.name_loan_product}
              upTo={row.ceiling}
              bunga={row.interest}
              onPress={() => {
                Nav({
                  title: row.name_loan_product, page: 'ark.LoanType', param: {
                    id: row.id_configuration_loan_product,
                    upTo: row.ceiling,
                    bunga: row.interest,
                    payload: row
                  }, ID: props.componentId
                })
              }} />
          ))}
        </ScrollView>
        <View style={{
          position: 'absolute',
          bottom: 10,
          width: '100%',
        }}>
          <View style={[{
            borderColor: Colors.warning,
            borderStyle: 'dotted',
            borderWidth: 4,
            borderRadius: 15,
            width: '70%',
            alignSelf: 'center',
            padding: 20,
            marginHorizontal: 20,
          }, containerStyles.centerColumn]}>
            <Text style={[textStyles.h3, {
              textAlign: 'center'
            }]}>{docCheck ? 'Pengecekan Document ...' : !docCheck && doc.length === 0 && employ.length === 0 && full.length === 0 ? 'Data Lengkap' : 'Segera Lengkapi Data Anda Agar Dapat Melakukan Pengajuan Pinjaman'}</Text>
            <Space size={10} />
            {doc.map((row, index) => (
              <Text style={{
                fontWeight: 'bold',
                color: Colors.danger
              }}>{row.name_document_type}</Text>
            ))}
            {full.map((row, index) => (
              <Text style={{
                fontWeight: 'bold',
                color: Colors.danger
              }}>{row}</Text>
            ))}
            {employ.map((row, index) => (
              <Text style={{
                fontWeight: 'bold',
                color: Colors.danger
              }}>{row}</Text>
            ))}
          </View>
        </View>
      </SafeAreaView>
    </Fragment>
  );
};

ListLoan.propTypes = {
  navigator: PropTypes.object,
  componentId: PropTypes.string
}

export default ListLoan;