import { StyleSheet } from 'react-native';
import { Colors } from './colors';

const styles = StyleSheet.create({
    titleSlider: {
        fontWeight: 'bold',
        fontSize: 24,
        textAlign: 'center'
    },
    contentSlider: {
        marginBottom: 150,
        textAlign: 'center',
        fontSize: 16,
        color: Colors.greyDark
    },
    h1: {
        fontSize: 24,
        fontWeight: 'bold'
    },
    h2: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    h3: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    loanLeft: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.greyDark
    },
    title: {
        fontSize: 24,
    },
    subtitle: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    contentProfile: {
        fontWeight: 'bold',
        fontSize: 18,
        color: Colors.light
    }
});

export const textStyles = styles;