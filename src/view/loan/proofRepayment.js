import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { CheckBox, Text as Rtext, Button } from 'react-native-elements';
import ImagePicker from 'react-native-image-picker';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StatusBar,
  TextInput,
  Image
} from 'react-native';
import { Styles, deviceHeight, deviceWidth } from '../../styles';
import { Colors } from '../../styles/colors';
import { Buttons, CustomButton } from '../../components/button';
import { Space } from '../../components/container';
import { setRoot, setRootTabs } from '../../router/navigator';
import { containerStyles } from '../../styles/container';
import logo from '../../assets/images/initial.png'
import { arkApi } from '../../config/api';
import { LoadingOverlay } from '../../components/loading';

function ProofRepayment(props) {

  const [photo, setPhoto] = useState(false);
  const [load, setLoad] = useState(false);
  const [loan, setLoan] = useState(false);

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

  const doUpload = async (data) => {
    setLoad(true)

    let body = {
      id_loan_repayment: loan.loan_credit[0].id_loan_repayment,
      evidence: data
    };

    try {
      let res = await arkApi({ metod: 'post', svc: 'loan', url: 'UploadRepayment', param: null, body });
      if (res) {
        setLoad(false)
        Nav({ title: 'Berhasil', page: 'ark.LoanInformation', param: { message: 'Selamat Upload Bukti Pembayaran Berhasil' }, ID: props.componentId })
      } else {
        setLoad(false)
      }
    } catch (err) {
      console.log(err)
      alert(JSON.stringify(err));
      setLoad(false);
    }
  }

  const options = {
    title: 'Select Image',
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
  };

  function photoPicker() {
    ImagePicker.launchCamera(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        // const source = { uri: response.uri, name: response.fileName, type: response.type };

        // You can also display the image using data:
        const image = 'data:' + response.type + ';base64,' + response.data;
        const source = { uri: image };
        setPhoto(source);
        doUpload(image)
      }
    });
  }


  return (
    <View style={{
      flex: 1
    }}>
      <SafeAreaView style={{
        flex: 1
      }}>
        <LoadingOverlay loading={load} />
        <View style={[{
          padding: 20,
        }, containerStyles.centerRow]}>
          <Image style={{
            width: 200,
            height: 200,
            backgroundColor: Colors.light,
            borderRadius: 20,
            borderColor: Colors.grey,
            borderWidth: 2
          }}
            source={photo.uri ? { uri: photo.uri } : logo}
          />
        </View>
        <View style={{
          width: '100%',
          position: 'absolute',
          bottom: 0
        }}>
          <CustomButton
            color={Colors.danger}
            title={'Upload Bukti Pembayaran'}
            onPress={() => {
              photoPicker()
            }}
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

ProofRepayment.propTypes = {
  navigator: PropTypes.object,
  componentId: PropTypes.string
}

export default ProofRepayment;