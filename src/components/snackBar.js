import Snackbar from 'react-native-snackbar';
import { Colors } from '../styles/colors';
import { clearStorage } from '../config/storage';

export const snackBarSuccess = (title) => {
    setTimeout(() => {
        Snackbar.show({
            title: title,
            backgroundColor: Colors.secondary,
            duration: Snackbar.LENGTH_LONG
        });
    }, 200);
};

export const snackBarSuccessOK = (title) => {
    setTimeout(() => {
        Snackbar.show({
            title: title,
            color: Colors.light,
            backgroundColor: Colors.secondary,
            duration: Snackbar.LENGTH_INDEFINITE,
            action: {
                title: 'OK',
                color: Colors.light,
                // onPress: () => { 
                //     clearStorage();
                //  },
            },
        });
    }, 200);
};

export const snackBarWarning = (title) => {
    setTimeout(() => {
        Snackbar.show({
            title: title,
            color: Colors.dark,
            backgroundColor: Colors.warning,
            duration: Snackbar.LENGTH_INDEFINITE,
            action: {
                title: 'OK',
                color: Colors.dark,
                // onPress: () => { 
                //     clearStorage();
                //  },
            },
        });
    }, 200);
};

export const snackBarError = (title) => {
    setTimeout(() => {
        Snackbar.show({
            title: title,
            backgroundColor: Colors.danger,
            duration: Snackbar.LENGTH_INDEFINITE,
            action: {
                title: 'OK',
                color: Colors.light,
                // onPress: () => { 
                //     clearStorage();
                //  },
            },
        });
    }, 200);
};