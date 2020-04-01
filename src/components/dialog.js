import React, { useState } from 'react';
import { Icon } from 'react-native-elements'
import {
    View,
    TouchableOpacity,
    Text
} from 'react-native';
import { Colors } from '../styles/colors';
import Dialog, { DialogFooter, DialogContent } from 'react-native-popup-dialog';
import { deviceWidth } from '../styles';
import { Nav } from '../router/navigator';
import { CustomButton } from './button';
import { TextInput } from 'react-native-gesture-handler';

export const DialogPassword = (props) => {

    const [hidePass, setHidePass] = useState(false)

    return (
        <Dialog
            width={deviceWidth - 30}
            visible={props.show}
            onTouchOutside={props.close}
            dialogTitle={
                <View style={{
                    padding: 20
                }}>
                    <Text h3>Password</Text>
                </View>
            }
            footer={
                <DialogFooter>
                    <View style={{
                        flex: 1,
                    }}>
                        <CustomButton
                            color={Colors.danger}
                            title={'KONFIRMASI'}
                            onPress={props.action}
                        />
                    </View>
                </DialogFooter>
            }
        >
            <DialogContent>
                <View style={{
                    marginTop: 20,
                    marginBottom: 10,
                }}>
                    <View style={[{
                        borderRadius: 15,
                        borderWidth: 1,
                        borderColor: Colors.grey,
                        padding: 5,
                        flexDirection: 'row',
                        justifyContent: 'space-between'
                    }]}>
                        <TextInput
                            value={props.pass}
                            secureTextEntry={hidePass}
                            style={{
                                padding: 5,
                                width: deviceWidth - 130,
                            }}
                            onChangeText={props.setPass} />
                        <TouchableOpacity onPress={() => {
                            setHidePass(!hidePass)
                        }}>
                            <Icon
                                name={hidePass ? 'ios-eye-off' : 'ios-eye'}
                                type='ionicon'
                                containerStyle={{
                                    paddingVertical: 10,
                                    paddingRight: 20
                                }}
                                color={Colors.grey}
                            />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        onPress={() => {
                            Nav({ title: 'Forgot Password', page: 'ark.Forgot', param: null, ID: props.componentId })
                        }}>
                        <Text style={{
                            fontSize: 18,
                            textAlign: 'right',
                            marginTop: 10
                        }}>Lupa Password ?</Text>
                    </TouchableOpacity>
                </View>
            </DialogContent>
        </Dialog>
    );
};