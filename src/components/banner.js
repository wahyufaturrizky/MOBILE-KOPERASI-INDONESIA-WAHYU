import React, { useState } from 'react';
import Spinner from 'react-native-loading-spinner-overlay';
import {
    View, Image
} from 'react-native';
import { Colors } from '../styles/colors';
import Swiper from 'react-native-swiper';
import { deviceWidth } from '../styles';

export const Banner = (props) => {

    const banner = props.data

    return (
      <Swiper
        height={props.height}
        autoplay={true}
        autoplayTimeout={10}
        dot={
          <View
            style={{
              backgroundColor: Colors.light,
              width: 8,
              height: 8,
              borderRadius: 4,
              marginLeft: 3,
              marginRight: 3,
              marginTop: 3,
              marginBottom: 3,
              left: 0,
            }}
          />
        }
        activeDot={
          <View
            style={{
              backgroundColor: Colors.primary,
              width: 10,
              height: 10,
              borderRadius: 4,
            }}
          />
        }
        paginationStyle={{
          bottom: 20,
          left: -1 * (deviceWidth / 1.3)
        }}
        loop
      >
        {banner.map((item, i) => {
          return (
            <View style={{
              margin: 10
            }}>
              <Image
                resizeMode={'cover'}
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: 15
                }}
                source={item.image}
              />
              </View>
          );
        })}
      </Swiper>
    )
  }

  export const BannerFull = (props) => {

    const banner = props.data

    return (
      <Swiper
        height={props.height}
        autoplay={true}
        autoplayTimeout={10}
        dot={
          <View
            style={{
              backgroundColor: Colors.light,
              width: 8,
              height: 8,
              borderRadius: 4,
              marginLeft: 3,
              marginRight: 3,
              marginTop: 3,
              marginBottom: 3,
              left: 0,
            }}
          />
        }
        activeDot={
          <View
            style={{
              backgroundColor: Colors.primary,
              width: 10,
              height: 10,
              borderRadius: 4,
            }}
          />
        }
        paginationStyle={{
          bottom: 2,
        }}
        loop
      >
        {banner.map((item, i) => {
          return (
            <View style={{
              // margin: 10
            }}>
              <Image
                resizeMode={'cover'}
                style={{
                  width: '100%',
                  height: '100%',
                }}
                source={item.image}
              />
              </View>
          );
        })}
      </Swiper>
    )
  }