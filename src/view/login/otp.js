import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Text as Rtext } from 'react-native-elements'
import {
  SafeAreaView,
  ScrollView,
  View,
  StatusBar,
  TextInput,
  TouchableHighlight,
  TouchableOpacity
} from 'react-native';
import { Styles, deviceHeight } from '../../styles';
import { inputStyles } from '../../styles/input';
import { Space } from '../../components/container';
import { Buttons } from '../../components/button';
import { LoadingOverlay } from '../../components/loading';
import { arkPost, arkApi } from '../../config/api';
import { Nav, setRoot, setRootTabs, popToSettings } from '../../router/navigator';
import { snackBarWarning, snackBarError, snackBarSuccess } from '../../components/snackBar';
import { resValid, reqOTP } from '../../config/validator';
import { Colors } from '../../styles/colors';
import { clearStorage, getStorage } from '../../config/storage';

function OtpPage(props) {

  const [step1, setStep1] = useState(null);
  const [step2, setStep2] = useState(null);
  const [step3, setStep3] = useState(null);
  const [step4, setStep4] = useState(null);
  const [step5, setStep5] = useState(null);
  const [minute, setMinute] = useState(0);
  const [second, setsecond] = useState(0);

  const [load, setLoad] = useState(false);

  const [flagResend, setFlagResend] = useState(false);
  const [duration, setDuration] = useState(60 * 2);

  // let timer;
  function countDown() {
    timer = duration;
    var minutes, seconds;
    setInterval(function () {
      minutes = parseInt(timer / 60, 10)
      seconds = parseInt(timer % 60, 10);

      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;

      setMinute(minutes);
      setsecond(seconds)

      if (--timer < 0) {
        setFlagResend(true)
        timer = 0;
      }
    }, 1000);
  }

  function resetTimer() {
    setFlagResend(false)
    if (duration === 60 * 2) {
      setDuration(60 * 5);
      timer = 60 * 5
    } else if (duration >= 60 * 10) {
      timer = 0
      setFlagResend(false);
      snackBarError('OTP Tidak Bisa Dikirim Lagi Tunggu Beberapa Saat Lagi')
    } else {
      timer = duration * 2
      setDuration(duration * 2)
    }
  }

  function confirmPage() {
    clearStorage();
    Nav({ title: 'Success Change Password', page: 'ark.Information', param: { information: 'Thank You, Password has been changed ' }, ID: props.componentId })
  }

  const doRegister = async () => {
    console.log('jalannnnnnnn ')
    try {
      setLoad(true)
      const { name, email, phone, companyID, EmployID, photo, doc, listDoc } = await getStorage('register');
      let formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('phone_number', phone);
      formData.append('id_company', companyID);
      formData.append('id_employee', EmployID);
      formData.append('photo', photo);
      for (let i in listDoc) {
        formData.append('documents[' + i + '][document]', doc[i]);
        formData.append('documents[' + i + '][id_document_type]', listDoc[i].id_master_doc_type);
      }

      let res = await arkApi({ metod: 'post', svc: 'member', url: 'register', param: null, body: formData });
      if (res) {
        setLoad(false);
        clearStorage();
        Nav({ title: 'Registrasi Dikonfirmasi', page: 'ark.Information', param: { information: 'Terimakasih Telah Melakukan Registrasi. Kami akan mengirimkan data informasi registrasi anda melalui email dan sms' }, ID: props.componentId })
      } else {
        setLoad(false);
        Nav({ title: 'Sign Up Failed', page: 'ark.Register', param: null, ID: props.componentId })
      }
    } catch (error) {
      console.log(error)
      setLoad(false);
      Nav({ title: 'Sign Up Failed', page: 'ark.Register', param: null, ID: props.componentId })
      snackBarError(JSON.stringify(error))
    }
  }

  const doChangePass = async () => {
    try {
      let body = await getStorage('changePassword')
      setLoad(true);
      let token = await getStorage('token');
      let res = await arkApi({ metod: 'post', svc: 'member', url: 'changePassword', param: token, body });
      if (res) {
        setLoad(false);
        confirmPage();
      }
    } catch (error) {
      setLoad(false);
      console.log(error)
      // alert(JSON.stringify(error));
    }
  }

  function registerConfirm() {
    // clearStorage();
    // Nav({ title: 'Registrasi Dikonfirmasi', page: 'ark.Information', param: { information: 'Terimakasih Telah Melakukan Registrasi. Kami akan mengirimkan data informasi registrasi anda melalui email dan sms' }, ID: props.componentId })
    doRegister();
  }

  function userValidation(data) {
    if (data.id_workflow_status == 'MBR-003') {
      setRoot({ title: 'Change Password', page: 'ark.ChangePass', param: null, ID: props.componentId })
    } else {
      setRootTabs({ ID: props.componentId })
    }
  }

  const doChangePhone = async () => {
    try {
      setLoad(true);
      const data = await getStorage('user');
      let body = {
        phone_number: props.phone,
      }
      let res = await arkApi({ metod: 'put', svc: 'member', url: 'changePhone', param: data.id_user_profile, body });
      if (res) {
        snackBarSuccess('Phone Number Has Ben Changed')
        setTimeout(function () {
          popToSettings();
        }, 1000);
        setLoad(false);
      }
    } catch (error) {
      alert(JSON.stringify(error))
      setLoad(false);
    }
  }


  function checkLogin(login) {
    if (login.Status === 200) {
      if (login.Data !== null) {
        setStorage('auth', body);
        setStorage('user', login.Data.user_profile);
        setStorage('token', login.Data.token);
        setStorage('subscriptionID', login.Data.id_subscription);
        userValidation(login.Data.user_profile.user);
      }
    } else {
      snackBarError('Login Failed')
      setRoot({ title: 'Login', page: 'ark.Login', param: null, ID: props.componentId })
    }
  }

  const resendOtp = async () => {
    try {
      setLoad(true);
      let body = {
        phone: props.phone
      }
      let res = await arkApi({ metod: 'post', svc: 'member', url: 'generateOtpRegister', param: null, body });
      if (res) {
        setLoad(false)
        snackBarWarning('Mengirim Ulang OTP Ke Nomor ' + props.phone + ' Sukses');
        resetTimer();
      } else {
        setLoad(false)
        // snackBarError('Mengirim Ulang OTP Ke Nomor ' + props.phone + ' Gagal');
        resetTimer();
      }
    } catch (err) {
      console.log(err);
      setLoad(false);
    }
  }

  const otpValidation = async (otpValue) => {
    try {
      const flagOTP = props.flag ? props.flag : 'default';
      setLoad(true);
      let body = {};
      if (flagOTP === 'login') {
        body = {
          phone_number: props.phone,
          otp: otpValue
        }
      } else {
        body = {
          phone: props.phone,
          value: otpValue
        }
      }
      let res = await arkApi({ metod: 'post', svc: 'member', url: flagOTP === 'login' ? 'validationOtpLogin' : 'validationOtpRegister', param: null, body });
      if (res) {
        setLoad(false);
        if (flagOTP === 'login') {
          checkLogin(res);
        } else if (flagOTP === 'register') {
          registerConfirm();
        } else if (flagOTP === 'changePassword') {
          doChangePass();
        } else if (flagOTP === 'changePhone') {
          doChangePhone();
        } else {
          confirmPage();
        }
      } else {
        snackBarError('OTP Yang Anda Masukan Tidak Sesuai');
        setLoad(false);
      }
    } catch (error) {
      console.log(error)
      setLoad(false);
    }
  }

  useEffect(() => {
    snackBarWarning('Masukan OTP yang telah kami kirim ke nomor HP anda')
    countDown();
  }, [])

  return (
    <Fragment>
      <LoadingOverlay loading={load} />
      <StatusBar barStyle="light-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="always" style={Styles.scrollView}>
          <Space size={100} />
          <View style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
            marginLeft: 20,
            marginRight: 20
          }}>
            <View style={inputStyles.otpContainer}>
              <TextInput
                onFocus={() => {
                  setStep1(null)
                }}
                keyboardType={'number-pad'}
                style={inputStyles.otpInput}
                onChangeText={text => {
                  if (text.length <= 1) {
                    setStep1(text);
                    if (text.length > 0) {
                      this.step2.focus();
                      setStep2(null)
                    }
                  }
                }}
                value={step1}
              />
            </View>
            <View style={inputStyles.otpContainer}>
              <TextInput
                ref={x => this.step2 = x}
                keyboardType={'number-pad'}
                style={inputStyles.otpInput}
                onChangeText={item => {
                  if (item.length <= 1) {
                    setStep2(item);
                    if (item.length > 0) {
                      this.step3.focus();
                      setStep3(null)
                    }
                  }
                }}
                value={step2}
              />
            </View>
            <View style={inputStyles.otpContainer}>
              <TextInput
                ref={x => this.step3 = x}
                keyboardType={'number-pad'}
                style={inputStyles.otpInput}
                onChangeText={item => {
                  if (item.length <= 1) {
                    setStep3(item);
                    if (item.length > 0) {
                      this.step4.focus();
                      setStep4(null)
                    }
                  }
                }}
                value={step3}
              />
            </View>
            <View style={inputStyles.otpContainer}>
              <TextInput
                ref={x => this.step4 = x}
                keyboardType={'number-pad'}
                style={inputStyles.otpInput}
                onChangeText={item => {
                  if (item.length <= 1) {
                    setStep4(item);
                    if (item.length > 0) {
                      this.step5.focus();
                      setStep5(null)
                    }
                  }
                }}
                value={step4}
              />
            </View>
            <View style={inputStyles.otpContainer}>
              <TextInput
                ref={x => this.step5 = x}
                keyboardType={'number-pad'}
                style={inputStyles.otpInput}
                onChangeText={item => {
                  if (item.length <= 1) {
                    setStep5(item);
                    if (item.length > 0) {
                      this.step5.blur();
                    }
                  }
                }}
                value={step5}
              />
            </View>
          </View>
          <Space size={20} />
          <View style={{
            flex: 1,
            alignItems: 'center'
          }}>
            <Rtext h4 style={{
              color: flagResend ? Colors.danger : Colors.dark
            }}>
              {minute} : {second}
            </Rtext>
            {flagResend ? (
              <TouchableOpacity
                style={{
                  marginTop: 30
                }}
                onPress={() => {
                  resendOtp()
                }}>
                <Rtext h4>Resend OTP</Rtext>
              </TouchableOpacity>
            ) : (
                <View />
              )}
          </View>
          <View style={{
            height: (deviceHeight / 2.2)
          }}>
            <View style={{
              position: 'absolute',
              bottom: 0
            }}>
              <Buttons
                text={'Next'}
                onClick={() => {
                  let otpValue = '0';
                  try {
                    otpValue = step1.toString() + step2.toString() + step3.toString() + step4.toString() + step5.toString();
                  } catch (error) {
                    console.log(error)
                    snackBarError('Masukan OTP Terlebih Dahulu')
                  }
                  if (otpValue !== '0') {
                    otpValidation(otpValue);
                  }
                }}
              />
              <Space size={20} />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Fragment>
  );
};

OtpPage.propTypes = {
  navigator: PropTypes.object,
  componentId: PropTypes.string
}

export default OtpPage;