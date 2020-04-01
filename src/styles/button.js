import { StyleSheet } from 'react-native';
import { Colors } from '../styles/colors';
import { deviceWidth } from '../styles'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        width: deviceWidth,
        marginTop: 10
      },
      welcome: {
        fontSize: 20,
        margin: 10,
        color: Colors.light,
        fontWeight: 'bold'
      },
      welcomePress: {
        fontSize: 20,
        textAlign: "center",
        margin: 10,
        color: Colors.light,
        fontWeight: 'bold'
      },
      button: {
        backgroundColor: Colors.primary,
        borderRadius: 10,
        width: deviceWidth - 50
      },
      buttonPress: {
        backgroundColor: Colors.primaryDark,
        borderRadius: 10,
        width: deviceWidth - 45
      },
      containerHeaderIcon: {
        flex: 1,
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 10,
        borderRadius: 10
      }
});

export const buttonStyles = styles;