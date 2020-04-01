import { StyleSheet } from 'react-native';
import { Colors } from '../styles/colors';

const styles = StyleSheet.create({
    imageSlider: {
        width: 200,
        height: 200,
        margin: 10,
        borderWidth: 1,
        borderColor: Colors.lightGrey,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
        borderRadius: 12,
        paddingHorizontal: 10,
    }
});

export const imageStyles = styles;