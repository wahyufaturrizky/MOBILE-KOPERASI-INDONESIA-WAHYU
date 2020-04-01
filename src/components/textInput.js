import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {
    TextInput,
    View,
    Text,
    TouchableOpacity
} from 'react-native';
import { containerStyles } from '../styles/container';

import { inputStyles } from '../styles/input';
import { Colors } from '../styles/colors';

export const InputLogin = (props) => {

    const [active, setActive] = useState(false)
    const [error, setError] = useState(false)
    const placeholder = props.placeholder;
    const action = props.onChangeText;
    const value = props.value;
    const password = props.type === 'password' ? true : false;
    const disabled = props.disable ? false : true;
    const keyboardType = props.keyboardType ? props.keyboardType : 'default';
    const cFocus = props.onFocus;
    const cBlur = props.onBlur;

    return (
        <TextInput
            autoFocus={props.autoFocus}
            keyboardType={keyboardType}
            style={[
                inputStyles.textInputLogin,
                active ? inputStyles.active : inputStyles.nonActive
            ]}
            secureTextEntry={password}
            placeholder={placeholder}
            onChangeText={action}
            editable={disabled}
            value={value}
            blurOnSubmit={true}
            onFocus={() => {
                setActive(true);
                if (cFocus !== undefined) {
                    cFocus();
                }
            }}
            onBlur={() => {
                setActive(false);
                if (cBlur !== undefined) {
                    cBlur();
                }
            }}
        />
    );
};

export const InputImage = (props) => {

    const action = props.onClick;
    const file = props.value;
    const value = file.name ? file.name : '';
    const placeholder = props.placeholder;

    return (
        <View style={{
            flex: 1,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
            alignContent: 'center',
            marginLeft: 10
        }} onTouchStart={action}>
            <View style={{
                flex: 1,
                borderWidth: 1,
                borderRadius: 10,
                alignItems: 'center',
                borderColor: Colors.grey,
                paddingTop: 5,
                marginTop: 10,
                paddingBottom: 5
            }}>
                <Icon name="md-camera" size={30} color="#4F8EF7" />
            </View>
            <View style={{
                flex: 3,
            }}>
                <InputLogin
                    placeholder={placeholder}
                    disable={true}
                    onChangeText={action}
                    value={value}
                />
            </View>
        </View>
    );
}

export const InputIcon = (props) => {

    const value = props.value;
    const placeholder = props.placeholder;
    const action = props.onChangeText;
    const title = props.title;
    const right = props.right ? props.right : true;
    const onClick = props.onClick;
    const onBlur = props.onBlur;
    const keyboardType = props.keyboardType ? props.keyboardType : 'default';
    const icon = props.icon ? props.icon : 'md-people';

    return (
        <View style={{
            margin: 10
        }}>
            <Text style={{
                fontSize: 20,
                marginLeft: 10,
            }}>{title}</Text>
            <View style={{
                flex: 1,
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'center',
                alignContent: 'center',
            }} >
                {!right ? (
                    <View style={{
                        flex: 1,
                        borderWidth: 1,
                        borderRadius: 10,
                        alignItems: 'center',
                        borderColor: Colors.grey,
                        paddingTop: 7,
                        paddingBottom: 7,
                        marginTop: 10,
                        marginLeft: 10
                    }}>
                        <Icon 
                        name={icon}
                        size={30} 
                        color="#4F8EF7" />
                    </View>
                ) : (
                        <View />
                    )}
                <View style={{
                    flex: 5,
                }}>
                    <InputLogin
                        onBlur={onBlur}
                        placeholder={placeholder}
                        onChangeText={action}
                        value={value}
                        keyboardType={keyboardType}
                    />
                </View>
                {right ? (
                    <View style={{
                        flex: 1,
                        borderWidth: 1,
                        borderRadius: 10,
                        alignItems: 'center',
                        borderColor: Colors.grey,
                        paddingTop: 7,
                        paddingBottom: 7,
                        marginTop: 10,
                        marginRight: 10
                    }}>
                        <TouchableOpacity onPress={onClick}>
                            <Icon name={icon} size={30} color="#4F8EF7" />
                        </TouchableOpacity>
                    </View>
                ) : (
                        <View />
                    )}
            </View>
        </View>
    );
}

export const InputSellected = (props) => {

    const value = props.value;
    const action = props.onPress;
    const title = props.title;

    return (
        <View style={{
            margin: 20
        }}>
            <Text style={{
                fontSize: 20,
                marginLeft: 10,
            }}>{title}</Text>
            <TouchableOpacity style={[containerStyles.betweenRow, {
                padding: 10,
                borderRadius: 10,
                borderColor: Colors.grey,
                borderWidth: 1,
                marginTop: 5
            }]} onPress={action}>
                <Text style={{
                    fontSize: 18,
                    color: Colors.grey
                }}>{value.length === 0 ? title : value}</Text>
                <Icon
                    name='ios-arrow-forward'
                    type='ionicon'
                    color='#517fa4'
                />
            </TouchableOpacity>
        </View>
    );
}

export const InputOTP = (props) => {

    const action = props.onChangeText;
    const value = props.value;
    const ref = props.ref;

    return (
        <View style={inputStyles.otpContainer}>
            <TextInput
                ref={ref}
                keyboardType={'number-pad'}
                style={inputStyles.otpInput}
                onChangeText={action}
                value={value}
            />
        </View>
    );
}