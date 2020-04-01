import { StyleSheet } from 'react-native';

import { Colors } from '../styles/colors';

const styles = StyleSheet.create({
    textInputLogin: {
        height: 45,
        padding: 10,
        marginLeft: 10,
        marginRight: 10,
        marginTop: 10,
        borderRadius: 10,
        fontSize: 18,
        backgroundColor: Colors.white
    },
    active: {
        borderColor: Colors.primary,
        borderWidth: 2,
    },
    nonActive: {
        borderColor: Colors.grey,
        borderWidth: 1,
    },
    otpContainer: {
        height: 60,
        width: 60,
        backgroundColor: '#E0E0E0',
        borderWidth: 2,
        borderColor: Colors.primary,
        alignItems: 'center',
        alignContent: 'center',
        borderRadius: 10
    },
    otpInput: {
        padding: 10,
        height: 40,
        marginTop: 10,
        marginLeft: 10,
        width: 40,
        fontSize: 24,
        fontWeight: 'bold'
    }
});

export const inputStyles = styles;