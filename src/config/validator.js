import { snackBarError } from "../components/snackBar"
import { arkApi } from "./api"

export const resValid = (data) => {
    try {
        if (data.Status === 200 || data.Status === 'Success') {
            return true
        } else {
            return false
        }
    } catch (error) {
        alert(error)
    }
}

export const reqOTP = async (phone, flag) => {
    try {
        let body = { otp_type: flag, phone_number: phone }
        let otp = await arkApi({ metod: 'post', svc: 'member', url: 'reqOtp', param: null, body });
        if (otp) {
            return reqOtpValid(otp, flag, phone)
        }
    } catch (error) {
        console.log(error)
        return false
    }
}

export const reqOtpValid = (data, flag, phone) => {
    try {
        if (data.id_otp_request !== undefined) {
            return {
                id_otp_request: data.id_otp_request,
                time_limit: data.time_limit,
                phone,
                flag
            }
        } else {
            snackBarError('ID request otp not found');
            return false;
        }
    } catch (error) {
        alert(error)
    }
}

export const nullChecker = (data) => {
    try {
        let keys = Object.keys(data);
        let val = 1;
        for (let i in keys) {
            if (data[keys[i]].length <= 1) {
                val = val * 0;
            }
        }
        if (val === 1) {
            return true
        } else {
            return false
        }
    } catch (error) {
        snackBarError(JSON.stringify(error))
    }
}