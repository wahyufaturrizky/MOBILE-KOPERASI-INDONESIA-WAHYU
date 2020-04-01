import React, { useState } from 'react';
import { Icon, Text as Rtext } from 'react-native-elements';
import {
  TouchableOpacity,
  Text,
  View,
  Image
} from 'react-native';
import { buttonStyles as styles } from '../styles/button';
import { textStyles } from '../styles/text';
import { Colors } from '../styles/colors';
import { Header } from 'react-native-elements';
import { Navigation } from 'react-native-navigation';
import { deviceWidth, deviceHeight } from '../styles';
import { Space } from './container';
import { IDR } from '../helper/numberFormat';

export const CustomCard = (props) => {

  return (

    <TouchableOpacity style={{
      width: '47%',
      borderWidth: 1,
      borderRadius: 15,
      shadowColor: Colors.dark,
      shadowOffset: {
        width: 0,
        height: 6,
      },
      shadowOpacity: 0.37,
      shadowRadius: 7.49,
      elevation: 12,
      backgroundColor: Colors.light,
      margin: 5
    }}
      key={props.key}
      onPress={props.onPress}
    >
      <View style={{
        width: '100%',
        // backgroundColor: Colors.grey
      }}>
        <Image style={{
          height: 120,
          width: '100%',
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15
        }} source={{ uri: props.image }} />
        {props.discount ? (
          <View style={{
            position: 'absolute',
            top: 5,
            right: 5,
            borderRadius: 10,
            padding: 5,
            backgroundColor: Colors.lightGrey
          }}>
            <Text style={{
              fontWeight: 'bold'
            }}>{props.discount}</Text>
          </View>
        ) : (
            <View />
          )}
      </View>
      <View style={{
        padding: 10
      }}>
        <Text style={{
          fontSize: 16,
          textTransform: 'capitalize',
        }}>{props.name}</Text>
        {props.row.promotions.length < 1 ? (
          <Text style={{
            fontSize: 14,
            fontWeight: 'bold',
          }}>{IDR(props.price)}</Text>
        ) : (
            <Text style={{
              fontSize: 16,
              fontWeight: 'bold',
              color: Colors.danger,
              textDecorationLine: 'line-through'
            }}>{IDR(props.price)}</Text>
          )}
        <Space size={10} />
        <Text style={{
          fontWeight: 'bold',
        }}>{props.store}</Text>
      </View>
    </TouchableOpacity>
  );
};

export const LoanTenor = (props) => {

  return (

    <View style={{
      margin: 10,
      alignItems: 'center'
    }}>
      <Text style={textStyles.h2}>{props.title}</Text>
      <View style={{
        padding: 20,
        width: 70,
        marginVertical: 5,
        borderRadius: 15,
        borderWidth: 2,
        alignItems: 'center',
        borderColor: Colors.danger
      }}>
        <Rtext h1>{props.content}</Rtext>
      </View>
      <Text style={textStyles.h2}>Bulan</Text>
    </View>
  );
};