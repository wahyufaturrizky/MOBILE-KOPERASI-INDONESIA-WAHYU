import { StyleSheet, Dimensions } from 'react-native';
import { Colors } from './colors';

export const deviceHeight = Dimensions.get('screen').height;
export const deviceWidth = Dimensions.get('screen').width;

const styles = StyleSheet.create({
    scrollView: {
        backgroundColor: Colors.light,
        // minHeight: deviceHeight
    },
    body: {
        backgroundColor: Colors.light,
        flex: 1
    },
    div: {
        height: 200,
        backgroundColor: Colors.white
    },
    paymentContainer: {
        flex: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.primary,
        padding: 20,
        borderRadius: 15,
        marginLeft: 20
    }
});

export const Styles = styles;