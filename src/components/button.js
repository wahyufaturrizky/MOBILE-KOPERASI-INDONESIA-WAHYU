import React, { useState } from 'react';
import { Icon, Button } from 'react-native-elements';
import {
  TouchableHighlight,
  TouchableOpacity,
  Text,
  View
} from 'react-native';
import { buttonStyles as styles } from '../styles/button';
import { Colors } from '../styles/colors';
import { textStyles } from '../styles/text';
import { containerStyles } from '../styles/container';


export const MenuAccount = (props) => {

  const title = props.title;
  const text = props.text;
  const subText = props.subText;
  const icon = props.icon;
  const action = props.onClick;
  const rightText = props.rightText;

  return (
    <View style={[
      styles.container
    ]}>
      <TouchableOpacity
        style={{
          width: '90%',
        }}
        onPress={() => {
          if (action != undefined) {
            action();
          }
        }}
      >
        <View>
          <Text style={textStyles.title}>{title}</Text>
        </View>
        {rightText ? (
          <View style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <View style={containerStyles.leftRow}>
              <View style={{
                padding: 10,
                backgroundColor: Colors.danger,
                borderRadius: 10,
                margin: 10,
                height: 50,
                width: 50
              }}>
                <Icon
                  name={icon}
                  type='ionicon'
                  size={30}
                  color={Colors.light}
                />
              </View>
              <View>
              {text !== null ? (
                  <Text style={{
                    fontSize: 18,
                    fontWeight: 'bold'
                  }}>{text}</Text>
                ) : (
                  <View />
                )}
                <Text
                  style={{
                    textAlign: 'left'
                  }}
                >
                  {subText}
                </Text>
              </View>
            </View>
            <Text
              style={{
                fontSize: 14,
                fontWeight: 'bold',
                color: Colors.danger,
                margin: 15,
              }}
            >
              {rightText}
            </Text>
          </View>
        ) : (
            <View style={containerStyles.leftRow}>
              <View style={{
                padding: 10,
                backgroundColor: Colors.danger,
                borderRadius: 10,
                margin: 10,
                height: 50,
                width: 50
              }}>
                <Icon
                  name={icon}
                  type='ionicon'
                  size={30}
                  color={Colors.light}
                />
              </View>
              <View>
                {text !== null ? (
                  <Text style={{
                    fontSize: 18,
                    fontWeight: 'bold'
                  }}>{text}</Text>
                ) : (
                  <View />
                )}
                <Text
                  style={{
                    textAlign: 'left'
                  }}
                >
                  {subText}
                </Text>
              </View>
            </View>
          )}
      </TouchableOpacity>
    </View>
  );
};

export const Buttons = (props) => {

  const text = props.text;
  const action = props.onClick;
  const menu = props.menu;
  const subText = props.subText;
  const danger = props.danger;

  const [active, setActive] = useState(false)

  function _onHideUnderlay() {
    setActive(false)
  }
  function _onShowUnderlay() {
    setActive(true)
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={1}
        style={[
          active
            ? styles.buttonPress
            : styles.button,
          danger ? {
            backgroundColor: Colors.danger
          } : {}
        ]}
        onPressIn={() => {
          _onShowUnderlay();
        }}
        onPress={() => {
          if (action != undefined) {
            action();
          }
        }}
        onPressOut={() => {
          _onHideUnderlay();
        }}
      >
        {subText ? (
          <View style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between'
          }}>
            <Text
              style={[
                active
                  ? styles.welcomePress
                  : styles.welcome,
                {
                  textAlign: menu ? 'left' : 'center'
                }
              ]}
            >
              {text}
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontWeight: 'bold',
                color: Colors.light,
                margin: 15
              }}
            >
              {subText}
            </Text>
          </View>
        ) : (
            <Text
              style={[
                active
                  ? styles.welcomePress
                  : styles.welcome,
                {
                  textAlign: menu ? 'left' : 'center'
                }
              ]}
            >
              {text}
            </Text>
          )}
      </TouchableOpacity>
    </View>
  );
};

export const HeaderIcon = (props) => {

  const icon = props.icon;
  const color = props.color;
  const background = props.background;
  const action = props.onClick;

  return (
    <TouchableOpacity
      style={[
        styles.containerHeaderIcon,
        {
          backgroundColor: background
        }
      ]}
      onPress={action}
    >
      <Icon
        name={icon}
        type='ionicon'
        size={50}
        color={color}
      />
    </TouchableOpacity>
  );
};

export const IconHeader = (props) => {

  const icon = props.icon;
  const color = props.color;
  const action = props.onClick;
  const text = props.text

  return (
    <TouchableOpacity
      style={[
        styles.containerHeaderIcon,
        {
          backgroundColor: Colors.light
        }
      ]}
      onPress={action}
    >
      <Icon
        name={icon}
        type='ionicon'
        size={70}
        color={color}
      />
      {text ? (
        <Text style={{
          padding: 10,
          color: color,
          fontWeight: 'bold'
        }}>{text}</Text>
      ) : (
          <View />
        )}
    </TouchableOpacity>
  );
};

export const HeaderTabs = (props) => {

  const action = props.onPress;
  const title = props.title;
  const active = props.active;

  return (
    <TouchableOpacity style={{
      height: 50,
    }} onPress={action}>
      <View style={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end',
        paddingBottom: 2
      }}>
        <Text style={{
          textAlign: 'center',
          fontSize: 18,
          color: Colors.light
        }}>
          {title}
        </Text>
        <View style={{
          width: (title.length * 10) + 5,
          height: 5,
          marginTop: 10,
          alignSelf: 'center',
          backgroundColor: active ? Colors.light : 'transparent'
        }} />
      </View>
    </TouchableOpacity>
  );
};

export const CustomButton = (props) => {

  return (
    <Button
      containerStyle={{
        margin: 10,
        borderWidth: props.outline || props.lineColor ? 1 : 0,
        borderColor: props.lineColor ? props.lineColor : null,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
      }}
      buttonStyle={{
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 10,
        backgroundColor: props.outline ? Colors.light : props.color
      }}
      titleStyle={{
        fontSize: 16,
        paddingHorizontal: 5,
        color: props.outline ? Colors.grey : Colors.light
      }}
      onPress={
        props.onPress
      }
      disabled={props.disabled}
      title={props.title}
    />
  );
};