import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Text, Icon } from 'react-native-elements';
import ImagePicker from 'react-native-image-picker';
import {
  SafeAreaView,
  ScrollView,
  View,
  StatusBar,
  Image,
  Picker,
  TouchableOpacity
} from 'react-native';

import { Styles } from '../../styles';
import { containerStyles } from '../../styles/container';
import { textStyles } from '../../styles/text';
import { Colors } from '../../styles/colors';
import { InputLogin, InputImage } from '../../components/textInput';
import { Buttons } from '../../components/button';
import { Space } from '../../components/container';
import logo from '../../assets/images/initial-profile.png'
import { arkFormPost, arkPostAuth, arkDelete, arkPutAuth, arkApi } from '../../config/api';
import { Nav } from '../../router/navigator';
import { LoadingOverlay } from '../../components/loading';
import { snackBarSuccessOK, snackBarError } from '../../components/snackBar';
import { resValid, reqOtpValid } from '../../config/validator';
import initialDc from '../../assets/images/initial-document.png'
import { getDocuments, setStorage } from '../../config/storage';
import { refreshToken } from '../../config/refreshToken';

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

function Documents(props) {

  const [load, setLoad] = useState(false);
  const [photo, setPhoto] = useState(false);
  const [doc, setDoc] = useState([]);
  const [newDoc, setNewDoc] = useState([]);
  const [listDoc, setListDoc] = useState([]);

  const options = {
    title: 'Select Avatar',
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
  };

  const finallDoc = async (list, data) => {
    let zeroList = [];
    for (let i in list) {
      let filter = data.filter(function (row) {
        return row.id_document_type == list[i].id_master_doc_type
      });
      if (filter.length === 0) {
        zeroList.push(list[i])
      }
    }
    setStorage('requireDoc', zeroList);
    setListDoc(zeroList);
    for (let i in data) {
      let filter = master.filter(function (row) {
        return row.id_document_type == data[i].id_document_type
      });
      if (filter.length >= 1) {
        data[i].name_document_type = filter[0].name_document_type
      } else {
        data[i].name_document_type = 'Undefined'
      }
    }
    setDoc(data);
  }

  const getDocType = async (doc) => {

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
      finallDoc(data, doc);
    }
  }

  const getData = async () => {
    try {
      setLoad(true);
      const payload = await getDocuments();
      if (payload) {
        let newDoc = [];
        for (let i in payload) {
          if (payload[i].id_document_type !== null) {
            newDoc.push(payload[i]);
          }
        }
        setLoad(false)
        getDocType(newDoc);
      }
    } catch (error) {
      setLoad(false)
      console.log(error)
      snackBarError(JSON.stringify(error))
    }
  }

  const refresh = async () => {
    try {
      setLoad(true);
      const data = await refreshToken();
      const payload = data.user.documents;
      if (payload) {
        getData();
        setLoad(false)
      }
    } catch (error) {
      setLoad(false)
      console.log(error)
      snackBarError(JSON.stringify(error))
    }
  }

  useEffect(() => {
    getData();
  }, [])

  function pushPage(title, page) {
    Nav({ title: title, page, param: null, ID: props.componentId })
  }

  function photoPicker(flag, data) {
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
        // setPhoto(source);
        if (flag === 'addDoc') {
          addDoc(source, data);
        } else if (flag === 'updateDoc') {
          updateDoc(source, data)
        }
      }
    });
  }

  const addDoc = async (source, id) => {
    try {
      setLoad(true)
      let formData = new FormData();
      formData.append('file', source);
      formData.append('id_document_type', id);
      let res = await arkApi({ metod: 'post', svc: 'member', url: 'createDoc', param: null, body: formData });
      if (res) {
        setLoad(false);
        refresh();
      } else {
        setLoad(false)
      }
    } catch (error) {
      setLoad(false)
      snackBarError(JSON.stringify(error))
    }
  }

  const deleteDoc = async (id) => {
    try {
      setLoad(true)
      let res = await arkDelete('document/' + id, 'member');
      if (res) {
        setLoad(false);
        refresh();
      }
    } catch (error) {
      setLoad(false)
      snackBarError(JSON.stringify(error))
    }
  }

  const updateDoc = async (source, id) => {
    try {
      setLoad(true)
      let formData = new FormData();
      formData.append('file', source);
      let res = await arkApi({ metod: 'post', svc: 'member', url: 'updateDoc', param: id, body: formData });
      if (res) {
        setLoad(false);
        refresh();
      } else {
        setLoad(false)
      }
    } catch (error) {
      setLoad(false)
      snackBarError(JSON.stringify(error))
    }
  }

  const ListEdit = (props) => {
    return (
      <View style={{
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20
      }}>
        <View style={{
          flex: 1,
          alignContent: 'center',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: Colors.light,
          padding: 20,
          borderRadius: 10,
          borderWidth: 2,
          borderColor: Colors.grey
        }}>
          <Image
            style={{
              width: 100,
              height: 100,
            }}
            source={{ uri: props.url }}
          />
        </View>
        <View style={[
          containerStyles.centerColumn,
          {}
        ]}>
          <View>
            <Text h4>{props.title}</Text>
            <Text style={{
              fontWeight: 'bold'
            }}>Upload Date</Text>
            <Text>{props.date}</Text>
          </View>
          <View style={containerStyles.centerRow}>
            {/* <TouchableOpacity style={{
              margin: 10
            }}
              onPress={() => {
                deleteDoc(props.id)
              }}>
              <Icon
                name='ios-trash'
                type='ionicon'
                iconStyle={{
                  fontSize: 50,
                  color: Colors.primary
                }}
              />
              <Text style={{
                fontWeight: 'bold',
                textAlign: 'center',
                color: Colors.primary
              }}>Delete</Text>
            </TouchableOpacity> */}
            <TouchableOpacity style={{
              margin: 10
            }}
              onPress={() => {
                photoPicker('updateDoc', props.id)
              }}>
              <Icon
                name='ios-camera'
                type='ionicon'
                iconStyle={{
                  fontSize: 50,
                  color: Colors.primary
                }}
              />
              <Text style={{
                fontWeight: 'bold',
                textAlign: 'center',
                color: Colors.primary
              }}>Edit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }

  return (
    <Fragment>
      <LoadingOverlay loading={load} />
      <StatusBar barStyle="light-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="always" style={Styles.scrollView}>
          <View style={{
            marginLeft: 20,
            marginRight: 20
          }}>
            {doc.map((row, index) => (
              <View key={index.toString()}>
                <ListEdit title={row.name_document_type} id={row.id_user_document} date={row.created_at} url={row.document_path} />
              </View>
            ))}
          </View>
          <Space size={20} />
          <View style={{
            margin: 20
          }}>
            {listDoc.length === 0 ? (
              <View />
            ) : (
                <Text style={{
                  color: Colors.danger,
                  fontSize: 16,
                  textAlign: 'center'
                }}>Lengkapi Data Anda Berikut ini</Text>
              )}
            {listDoc.map((row, index) => (
              <View key={index.toString()}>
                <InputImage
                  placeholder={row.name_document_type}
                  onClick={() => {
                    photoPicker('addDoc', row.id_master_doc_type)
                  }}
                  value={newDoc[index] ? newDoc[index] : row.name_document_type}
                />
              </View>
            ))}
          </View>
          {/* <TouchableOpacity style={{
            borderWidth: 4,
            borderColor: Colors.primary,
            borderRadius: 10,
            margin: 20
          }}
            onPress={() => {
              photoPicker('addDoc')
            }}>
            <Icon
              name={'ios-add'}
              type='ionicon'
              size={50}
              color={Colors.primary}
            />
          </TouchableOpacity> */}
        </ScrollView>
      </SafeAreaView>
    </Fragment>
  );
};

Documents.propTypes = {
  navigator: PropTypes.object,
  componentId: PropTypes.string
}

export default Documents;
