import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ImagePicker from 'react-native-image-picker';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StatusBar,
  Image,
  Picker
} from 'react-native';

import { Styles } from '../../styles';
import { textStyles } from '../../styles/text';
import { Colors } from '../../styles/colors';
import { InputLogin, InputImage } from '../../components/textInput';
import { Buttons } from '../../components/button';
import { Space } from '../../components/container';
import logo from '../../assets/images/initial-profile.png'
import { arkFormPost, arkApi } from '../../config/api';
import { Nav } from '../../router/navigator';
import { LoadingOverlay } from '../../components/loading';
import { snackBarSuccessOK, snackBarError } from '../../components/snackBar';
import { resValid, reqOtpValid, nullChecker, reqOTP } from '../../config/validator';
import { setStorage, getStorage } from '../../config/storage';

const master = [
  {
    "id_document_type": "DOC-001",
    "name_document_type": "KTP"
  },
  {
    "id_document_type": "DOC-002",
    "name_document_type": "NPWP"
  },
  {
    "id_document_type": "DOC-003",
    "name_document_type": "Buku Tabungan"
  },
  {
    "id_document_type": "DOC-004",
    "name_document_type": "KK"
  },
  {
    "id_document_type": "DOC-005",
    "name_document_type": "Id Card"
  },
  {
    "id_document_type": "DOC-006",
    "name_document_type": "Buku Pernikahan"
  }
]

function Register(props) {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [photo, setPhoto] = useState({});
  const [doc, setDoc] = useState([]);
  const [EmployID, setEmployID] = useState('');
  const [companyID, setCompanyID] = useState('');

  const [load, setLoad] = useState(false);

  const [listCompany, setListCompany] = useState([]);
  const [listDoc, setListDoc] = useState([]);

  const options = {
    title: 'Select Image',
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
  };

  const getCompany = async () => {

    let res = await arkApi({ metod: 'get', svc: 'master', url: 'company', param: null, body: null });

    if (res) {
      setListCompany(res)
    }
  }

  const getDocType = async () => {

    let res = await arkApi({ metod: 'get', svc: 'configuration', url: 'configDoc', param: null, body: null });

    if (res) {
      let data = res.config_registration[0].regist_document;
      for (let i in data) {
        let filter = master.filter(function (row) {
          return row.id_document_type == data[i].id_master_doc_type
        });
        if (filter.length >= 1) {
          data[i].name_document_type = filter[0].name_document_type
        } else {
          data[i].name_document_type = 'Undefined'
        }
      }
      setListDoc(data)
    }
  }

  useEffect(() => {
    getData();
    // getCompany();
    //   getDocType();
  }, [])

  const getData = async () => {
    const data = await getStorage('register');
    if (data) {
      if (data.name) {
        setName(data.name);
        setEmail(data.email);
        setPhone(data.phone);
        setCompanyID(data.companyID);
        setEmployID(data.EmployID);
        setPhoto(data.photo);
        setDoc(data.doc);
        setListDoc(data.listDoc);
        setListCompany(data.listCompany);
      }
    } else {
      getCompany();
      getDocType();
    }
  }

  function goTNC(value) {
    Nav({ title: 'Term And Condition', page: 'ark.TermAndCondition', param: { payload: value }, ID: props.componentId })
  }

  function doByPass() {
    goTNC({ phone: '628999064808', flag: 'register' });
  }

  const doRegister = async () => {
    try {
      setLoad(true);

      // let formData = new FormData();
      // formData.append('name', name);
      // formData.append('email', email);
      // formData.append('phone_number', phone);
      // formData.append('id_company', companyID);
      // formData.append('id_employee', EmployID);
      // formData.append('photo', photo);
      // for (let i in listDoc) {
      //   formData.append('documents[' + i + '][document]', doc[i]);
      //   formData.append('documents[' + i + '][id_document_type]', listDoc[i].id_master_doc_type);
      // }

      // let res = await arkApi({ metod: 'post', svc: 'member', url: 'register', param: null, body: formData });
      // if (res) {
      // setLoad(false);
      //   goTNC({ phone: phone, flag: 'register' });
      // } else {
      //   setLoad(false);
      // }

      let payload = {
        name,
        email,
        phone,
        companyID,
        EmployID,
        photo,
        doc,
        listDoc,
        listCompany
      }

      setStorage('register', payload)
      goTNC({ phone: phone, flag: 'register' });
      setLoad(false);
    } catch (error) {
      console.log(error)
      setLoad(false);
      alert(JSON.stringify(error));
    }
  }

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
        const source = { uri: response.uri, name: response.fileName, type: response.type };

        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };
        setPhoto(source);
      }
    });
  }

  //   @jsina use this for ios
  // (Platform.OS==='android') ? response.uri : response.uri.replace('file://', '')
  // and in options
  // storageOptions: { skipBackup: true, path: 'images', cameraRoll: true, waitUntilSaved: true }

  function imagePicker(flag) {
    ImagePicker.launchImageLibrary(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = { uri: response.uri, name: response.fileName, type: response.type };

        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };

        let data = [...doc];
        data[flag] = source
        setDoc(data);

      }
    });
  }

  return (
    <Fragment>
      <LoadingOverlay loading={load} />
      <StatusBar barStyle="light-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="always" style={Styles.scrollView}>
          <Space size={40} />
          <View style={{
            flex: 1,
            alignItems: 'center'
          }} onTouchStart={() => {
            photoPicker();
          }}>
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
            <Space size={10} />
            <Text style={textStyles.h1}> Selfie </Text>
          </View>
          <View style={{
            margin: 20
          }}>
            <InputLogin
              placeholder={'Name'}
              onChangeText={val => setName(val)}
              value={name}
            />
            <InputLogin
              placeholder={'Email'}
              onChangeText={val => setEmail(val)}
              value={email}
              keyboardType={'email-address'}
            />
            <InputLogin
              placeholder={'No Hp'}
              onChangeText={val => setPhone(val)}
              value={phone}
              keyboardType={'number-pad'}
            />

            {listDoc.map((row, index) => (
              <View key={index.toString()}>
                <InputImage
                  placeholder={row.name_document_type}
                  onClick={() => {
                    imagePicker(index);
                  }}
                  value={doc[index] ? doc[index] : row.name_document_type}
                />
              </View>
            ))}

            <InputLogin
              placeholder={'ID Employee'}
              onChangeText={val => setEmployID(val)}
              value={EmployID}
            />
            <View style={{
              paddingLeft: 5,
              paddingRight: 5,
              borderWidth: 1,
              borderColor: Colors.grey,
              margin: 10,
              borderRadius: 10
            }}>
              <Picker
                mode={'dropdown'}
                selectedValue={companyID}
                onValueChange={(itemValue, itemIndex) => {
                  if (itemValue !== "0") {
                    setCompanyID(itemValue)
                  }
                }
                }>
                <Picker.Item label="Select Company" value="0" />
                {listCompany.map((row, index) => (
                  <Picker.Item label={row.name_company} value={row.id_company} key={index.toString()} />
                ))}
              </Picker>
            </View>
          </View>
          <Space size={20} />
          <Buttons text={'Register'} onClick={() => {

            let body = {
              name,
              email,
              phone,
              EmployID,
              companyID
            }

            if (photo.uri) {
              if (nullChecker(body)) {
                doRegister();
              } else {
                snackBarError('Masukan Semua Data Dengan Benar')
              }
            } else {
              snackBarError('Masukan Photo')
              // doByPass()
            }
          }} />
          <Space size={20} />
        </ScrollView>
      </SafeAreaView>
    </Fragment>
  );
};

Register.propTypes = {
  navigator: PropTypes.object,
  componentId: PropTypes.string
}

export default Register;
