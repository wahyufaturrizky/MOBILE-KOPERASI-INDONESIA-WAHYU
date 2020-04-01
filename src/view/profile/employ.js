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
  Picker,
  TextInput,
  DatePickerAndroid,
  TouchableOpacity
} from 'react-native';

import moment from 'moment'

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
import { snackBarSuccessOK, snackBarError, snackBarSuccess } from '../../components/snackBar';
import { resValid, reqOtpValid } from '../../config/validator';
import { getStorage, setStorage } from '../../config/storage';
import { inputStyles } from '../../styles/input';
import { refreshToken } from '../../config/refreshToken';
import { Navigation } from 'react-native-navigation';
import { IDR } from '../../helper/numberFormat';

function Employe(props) {

  const [employID, setEmployID] = useState('');
  const [companyID, setCompanyID] = useState('');
  const [gradeID, setGradeID] = useState('');
  const [date, setDate] = useState('');
  const [division, setDivision] = useState('');
  const [position, setPosition] = useState('');
  const [sallary, setSallary] = useState('');
  const [fileSallary, setFileSallary] = useState('');
  const [oldSallary, setOldSallary] = useState(false);

  const [listCompany, setListCompany] = useState([]);
  const [listGrade, setListGrade] = useState([]);
  const [load, setLoad] = useState(false);

  const options = {
    title: 'Select Image',
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
  };

  const getCompany = async () => {
    try {
      setLoad(true);
      let res = await arkApi({ metod: 'get', svc: 'master', url: 'company', param: null, body: null });
      if (res) {
        setLoad(false);
        setListCompany(res);
        getGrade()
      } else {
        setLoad(false);
      }
    } catch (error) {
      console.log(error)
    }
  }

  const getGrade = async () => {
    try {
      let res = await arkApi({ metod: 'get', svc: 'master', url: 'grade', param: null, body: null });
      if (res) {
        setListGrade(res.data);
        getData();
      }
    } catch (error) {
      console.log(error)
    }
  }

  const formatMoney = (money) => {
    let format = money.substr(4, money.length)
    let str = format.split(',');
    
    return str.join("")
  }

  const doUpdate = async () => {
    try {
      setLoad(true);
      let data = await getStorage('user');
      let param = '';
      if (data) {
        param = data.user_company.id_user_company
      }
      const formatSallary = formatMoney(sallary)

      let formData = new FormData();
      formData.append('id_user_company', param);
      formData.append('id_employee', employID);
      formData.append('id_company', companyID);
      formData.append('id_grade', gradeID);
      formData.append('date_of_work', date);
      formData.append('division', division);
      formData.append('position', position);
      formData.append('salary_amount', formatSallary);
      formData.append('salary_photo', fileSallary);

      let res = await arkApi({ metod: 'post', svc: 'member', url: 'updateEmploy', param: null, body: formData });
      console.log(res, 'ress, sss')
      if (res) {
        setLoad(false);
        refresh();
      } else {
        setLoad(false)
      }
    } catch (error) {
      console.log(error)
      setLoad(false);
      alert(JSON.stringify(error));
    }
  }

  const refresh = async () => {
    try {
      setLoad(true);
      const data = await refreshToken();
      const payload = data.user.profile;
      if (payload) {
        setLoad(false);
        snackBarSuccessOK('Update Berhasil, Menunggu Konfirmasi HRD')
        // setTimeout(function () {
        //   Navigation.popTo('Component12')
        // }, 3000);
        checkAll()
      }
    } catch (error) {
      setLoad(false)
      console.log(error)
      snackBarError(JSON.stringify(error))
    }
  }

  const getData = async () => {
    try {
      let data = await getStorage('user');
      if (data.user_company) {
        setEmployID(data.user_company.id_employee);
        setCompanyID(data.user_company.id_company ? Number(data.user_company.id_company) : '0');
        setGradeID(data.user_company.id_grade ? Number(data.user_company.id_grade) : '0');
        setDate(data.user_company.employee_starting_date ? data.user_company.employee_starting_date : moment().format('YYYY-MM-DD'));
        setDivision(data.user_company.division);
        setPosition(data.user_company.position);
        setSallary(IDR(data.user_company.user_salary.salary_amount));
        setOldSallary(data.user_company.user_salary.salary_photo)
      }
    } catch (error) {
      console.log(error)
      snackBarError(JSON.stringify(error))
    }
  }

  const checkAll = async (num) => {
    try {
      let employ = await arkApi({ metod: 'get', svc: 'loan', url: 'checkEmploy', param: null, body: null });

      let newEmploy = [];
      let employKey = Object.keys(employ);
      for (let i in employKey) {
        if (employ[employKey[i]].length === 0) {
          newEmploy.push(employ[i])
        }
      }
      setStorage('requireEmploye', newEmploy)
    } catch (err) {
      console.log(err)
      alert(JSON.stringify(err));
      setLoad(false);
    }
  }

  useEffect(() => {
    getCompany()
  }, [])

  const openCalendar = async () => {
    try {
      const { action, year, month, day } = await DatePickerAndroid.open({
        // Use `new Date()` for current date.
        // May 25 2020. Month 0 is January.
        date: new Date(),
      });
      if (action !== DatePickerAndroid.dismissedAction) {
        setDate(moment(new Date(year, month, day)).format('YYYY-MM-DD'))
      }
    } catch ({ code, message }) {
      console.warn('Cannot open date picker', message);
    }
  }

  function imagePicker() {
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

        setFileSallary(source);
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
          <View style={{
            margin: 20
          }}>
            <InputLogin
              placeholder={'Employe ID'}
              onChangeText={val => setEmployID(val)}
              value={employID}
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
            <View style={{
              paddingLeft: 5,
              paddingRight: 5,
              borderWidth: 1,
              borderColor: Colors.grey,
              margin: 10,
              borderRadius: 10
            }}>
              <Picker
                selectedValue={gradeID}
                onValueChange={(itemValue, itemIndex) => {
                  if (itemValue !== "0") {
                    setGradeID(itemValue)
                  }
                }
                }>
                <Picker.Item label="Select Grade" value="0" />
                {listGrade.map((row, index) => (
                  <Picker.Item label={row.name_grade} value={row.id_grade} key={index.toString()} />
                ))}
              </Picker>
            </View>
            <TouchableOpacity onPress={() => {
              openCalendar()
            }}>
              <Text
                style={[
                  inputStyles.textInputLogin,
                  inputStyles.nonActive
                ]}
              >{date}</Text>
            </TouchableOpacity>
            <InputLogin
              placeholder={'Division'}
              onChangeText={val => setDivision(val)}
              value={division}
            />
            <InputLogin
              placeholder={'Position'}
              onChangeText={val => setPosition(val)}
              value={position}
            />
            <InputLogin
              placeholder={'Salary'}
              onChangeText={val => setSallary(val)}
              value={sallary}
            />
            {oldSallary !== null || oldSallary !== '' ? (
              <View style={{
                margin: 20
              }}>
                <Image source={{ uri: oldSallary }} style={{
                  width: '100%',
                  height: 100,
                  resizeMode: 'cover',
                  backgroundColor: Colors.lightGrey,
                  borderRadius: 15
                }} />
              </View>

            ) : (
                <View />
              )}
            <InputImage
              placeholder={'Salary Slip'}
              onClick={() => {
                imagePicker();
              }}
              value={fileSallary}
            />
          </View>
          <Space size={20} />
          <Buttons text={'Save'} onClick={() => {
            if (fileSallary === '') {
              snackBarError('Update Data Karyawan Harus Disertai Dengan Selip Gaji')
            } else {
              doUpdate();
            }
          }} />
          <Space size={20} />
        </ScrollView>
      </SafeAreaView>
    </Fragment>
  );
};

Employe.propTypes = {
  navigator: PropTypes.object,
  componentId: PropTypes.string
}

export default Employe;
