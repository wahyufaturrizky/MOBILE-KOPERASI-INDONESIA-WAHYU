import { AsyncStorage } from "react-native"
import { snackBarError } from "../components/snackBar";

export const getStorage = async (key) => {
    try {
        const value = await AsyncStorage.getItem(key);
        if (value !== null) {
            return JSON.parse(value)
        } else {
            return false
        }
    } catch (error) {
        console.log(error)
        return false
    }
}

export const getFcmToken = async () => {
    try {
        const value = await AsyncStorage.getItem('fcmToken');
        return value;
    } catch (error) {
        console.log(error)
        return false
    }
}

export const getUrlProfile = async (url) => {
    try {
        const value = await AsyncStorage.getItem('user');
        if (value !== null) {
            let data = JSON.parse(value)
            let apiUrl = data.id_user_profile + '/' + url;
            return apiUrl;
        } else {
            snackBarError(JSON.stringify('Url Not Found'))
        }
    } catch (error) {
        console.log(error)
        snackBarError(JSON.stringify(error))
    }
}

export const getIDProfile = async () => {
    try {
        const value = await AsyncStorage.getItem('user');
        if (value !== null) {
            let data = JSON.parse(value)
            return data.id_user_profile;
        } else {
            snackBarError(JSON.stringify('ID Not Found'))
        }
    } catch (error) {
        console.log(error)
        snackBarError(JSON.stringify(error))
    }
}

export const getIDUser = async () => {
    try {
        const value = await AsyncStorage.getItem('user');
        if (value !== null) {
            let data = JSON.parse(value)
            return data.id_user;
        } else {
            snackBarError(JSON.stringify('ID Not Found'))
        }
    } catch (error) {
        console.log(error)
        snackBarError(JSON.stringify(error))
    }
}

export const getLocProfile = async () => {
    try {
        const value = await AsyncStorage.getItem('user');
        if (value !== null) {
            let data = JSON.parse(value)
            return data.user_address;
        } else {
            snackBarError(JSON.stringify('ID Not Found'))
        }
    } catch (error) {
        console.log(error)
        snackBarError(JSON.stringify(error))
    }
}

export const getDocuments = async () => {
    try {
        const value = await AsyncStorage.getItem('user');
        if (value !== null) {
            let data = JSON.parse(value)
            return data.user.documents;
        } else {
            snackBarError(JSON.stringify('Document Not Found'))
        }
    } catch (error) {
        console.log(error)
        snackBarError(JSON.stringify(error))
    }
}

export const setStorage = async (key, payload) => {
    try {
        const data = JSON.stringify(payload)
        await AsyncStorage.setItem(key, data);
    } catch (error) {
        alert(error)
    }
}

export const clearStorage = async () => {
    try {
        await AsyncStorage.clear()
    } catch (error) {
        alert(error)
    }
}