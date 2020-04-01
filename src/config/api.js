import axios from 'axios';
import { snackBarSuccess, snackBarError } from '../components/snackBar';
import { getStorage, clearStorage } from './storage';
import config from '../config/device.json';
import { setRoot } from '../router/navigator';

const host = {
    member: 'https://arkamaia-dev-account.azurewebsites.net/api/v1/',
    master: 'https://arkamaia-dev-master.azurewebsites.net/api/v1/',
    configuration: 'https://arkamaia-dev-configuration.azurewebsites.net/api/v1/',
    product: 'https://arkamaia-dev-product.azurewebsites.net/api/v1/',
    order: 'https://arkamaia-dev-order.azurewebsites.net/api/v1/',
    loan: 'https://arkamaia-dev-loan.azurewebsites.net/api/v1/',
    notification: 'https://arkamaia-dev-notification.azurewebsites.net/api/v1/'
};

const service = {
    member: 'service-member/',
    master: 'service-master/',
    configuration: 'service-configuration/',
    product: 'service-product/',
    order: 'service-order/',
    loan: 'service-loan/',
    notification: 'service-notification/'
};

const api = (myService, url, param) => {
    switch (url) {
        // service loan     
        case 'disbursement':
            return host[myService] + service[myService] + 'loan-disbursement/save';
        case 'UploadRepayment':
            return host[myService] + service[myService] + 'loan-repayment/upload-payment';
        case 'reqRepayment':
            return host[myService] + service[myService] + 'loan-repayment/save';
        case 'calcRepayment':
            return host[myService] + service[myService] + 'loan/calculate-repayment';
        case 'detailLoan':
            return host[myService] + service[myService] + 'loan/detail/' + param;
        case 'checkEmploy':
            return host[myService] + service[myService] + 'loan/check-kekaryawanan';
        case 'checkFulFillment':
            return host[myService] + service[myService] + 'loan/check-fulfillment';
        case 'totalInstallment':
            return host[myService] + service[myService] + 'loan/total-installment/' + param;
        case 'createLoan':
            return host[myService] + service[myService] + 'loan/non-microloan/save';
        case 'createMicroLoan':
            return host[myService] + service[myService] + 'loan/microloan/save';
        case 'checkEligible':
            return host[myService] + service[myService] + 'loan/check-eligibility';
        case 'loanSimulation':
            return host[myService] + service[myService] + 'loan/simulation';
        case 'getAllLoan':
            return host[myService] + service[myService] + 'loan?id_user=' + param;
        // service product   
        case 'cart':
            return host[myService] + service[myService] + 'product-cart';
        case 'ads':
            return host[myService] + service[myService] + 'ads';
        case 'delCart':
            return host[myService] + service[myService] + 'product-cart/delete/' + param;
        case 'saveCart':
            return host[myService] + service[myService] + 'product-cart/save';
        case 'wishlist':
            return host[myService] + service[myService] + 'product-wishlists';
        case 'deleteWishlist':
            return host[myService] + service[myService] + 'product-wishlists/' + param;
        case 'previxPhone':
            return host[myService] + service[myService] + 'products/phone/' + param;
        case 'getBillers':
            return host[myService] + service[myService] + 'products/biller/search';
        // sevice member
        case 'getProduct':
            return host[myService] + service[myService] + 'products/product/search';
        case 'searchProduct':
            return host[myService] + service[myService] + 'products/product/search?name=' + param;
        case 'updateFCM':
            return host[myService] + service[myService] + 'token/save';
        case 'configDoc':
            return host[myService] + 'public/' + service[myService] + 'configuration-registration/by-subscription/' + config.id_subscription;
        case 'updateAddress':
            return host[myService] + service[myService] + 'member-address/' + param + '/update';
        case 'deleteAddress':
            return host[myService] + service[myService] + 'member-address/delete/' + param;
        case 'company':
            return host[myService] + service[myService] + 'company/by-holding/' + config.id_holding;
        case 'balance':
            return host[myService] + service[myService] + 'me/balance?holding=' + config.id_holding;
        case 'billers':
            return host[myService] + service[myService] + 'product';
        // service order
        case 'checkListrik':
            return 'https://arkamaia-dev-middleware.azurewebsites.net/metra/inquiry/listrik';
        case 'pulsaPay':
            return host[myService] + service[myService] + 'transaction/order/biller';
        case 'listrikPay':
            return host[myService] + service[myService] + 'transaction/order/listrik';
        case 'productPay':
            return host[myService] + service[myService] + 'transaction/order/product';
        // service configuration
        case 'getIDMicroLoan':
            // http://arkamaia-dev-configuration.azurewebsites.net/api/v1/service-configuration/configuration-loan-product/by-holding/26/21?is_microloan=1
            return host[myService] + service[myService] + 'configuration-loan-product/by-holding/26/' + param + '?is_microloan=1';
        case 'configLoan':
            return host[myService] + service[myService] + 'configuration-loan-product/by-holding/' + config.id_holding + '/' + param;
        case 'periodeLoan':
            return host[myService] + service[myService] + 'master-periode-loan?id_holding=' + config.id_holding;
        // service master
        case 'detailCompany':
            return host[myService] + service[myService] + 'company/detail/' + param;
        case 'kurir':
            return host[myService] + service[myService] + 'courier/active';
        case 'bank':
            return host[myService] + service[myService] + 'bank';
        case 'grade':
            return host[myService] + service[myService] + 'grade';
        case 'updateBank':
            return host[myService] + service[myService] + 'member/' + param + '/update/bank';
        case 'saveAddress':
            return host[myService] + service[myService] + 'address';
        case 'updateProfile':
            return host[myService] + service[myService] + 'me/profile/save';
        case 'categoryProduct':
            return host[myService] + service[myService] + 'product-category';
        case 'detailProduct':
            return host[myService] + service[myService] + 'product?id_category=' + param + '&id_holding=' + config.id_holding;
        case 'recomendation':
            return host[myService] + service[myService] + 'product-wishlist/' + param;
        case 'topRated':
            return host[myService] + service[myService] + 'order/product-recommendation/' + param;
        case 'changePhone':
            return host[myService] + service[myService] + 'member/' + param + '/update/phone';
        case 'changePassword':
            return host[myService] + service[myService] + 'change_password?token=' + param;
        case 'changeEmail':
            return host[myService] + service[myService] + 'member/' + param + '/update/email';
        case 'register':
            return host[myService] + service[myService] + 'register';
        case 'reqOtp':
            return host[myService] + service[myService] + 'request_otp';
        case 'generateOtpRegister':
            return host[myService] + service[myService] + 'otp/register/generate';
        case 'validationOtpRegister':
            return host[myService] + service[myService] + 'otp/register/check';
        case 'generateOtpLogin':
            return host[myService] + service[myService] + 'login-otp';
        case 'listOrder':
            return host[myService] + service[myService] + 'transaction/my-order';
        case 'validationOtpLogin':
            return host[myService] + service[myService] + 'login-otp/check';
        case 'configBySub':
            return host[myService] + service[myService] + 'configuration/by-subscription/' + config.id_subscription;
        case 'createDoc':
            return host[myService] + service[myService] + 'document';
        case 'updateDoc':
            return host[myService] + service[myService] + 'document/update/' + param;
        case 'updateEmploy':
            // return host[myService] + service[myService] + 'member/' + param + '/update/company';
            return host[myService] + service[myService] + 'salary/update';
        // service notification
        case 'notif':
            return host[myService] + service[myService] + 'notifications/' + param;
        default:
            return 'errr'
    }
}

const header = {
    'Holding': config.id_holding,
    'Subscription': config.id_subscription,
    'Content-Type': 'application/json'
}

const headerAuth = {
    'Holding': config.id_holding,
    'Subscription': config.id_subscription,
    Authorization: 'Bearer ',
    'Content-Type': 'application/json'
}

function logger(res, url, body, header) {
    console.log(' ============== start API =================')
    console.log('url => ' + url)
    console.log('body => ')
    console.log(body)
    console.log('header => ')
    console.log(header)
    console.log('respons => ')
    console.log(res)
    console.log(' ============== end API =================')

}

function doLogout() {
    clearStorage();
    setRoot({ title: 'Login', page: 'ark.Login', param: null, ID: 'Component14' })
}

async function getResponse(payload, apiUrl, body, header) {
    try {
        logger(payload, apiUrl, body, header)
        const data = await payload;
        if (data.Status === 200 || data.Status === 201 || data.Status === 'Success' || data.Status === 'true') {
            if (data.ErrorMessage.length >= 2) {
                snackBarError(JSON.stringify(data.ErrorMessage))
                return data
            } else {
                return data;
            }
        } else {
            snackBarError('[ ' + data.Status + ' ] ' + JSON.stringify(data.ErrorMessage));
            return data;
        }
    } catch (error) {
        alert(JSON.stringify(error));
        console.log(error)
    }
}

// fixing get response 
async function getRes(payload, apiUrl, body, header) {
    try {
        logger(payload, apiUrl, body, header)
        const data = await payload;
        if (data.Status === 200 || data.Status === 201 || data.Status === 'Success' || data.Status === 'Success update data' || data.Status === 'true' || data.status) {
            // snackBarSuccess('Success');
            if (data.Data !== null) {
                if (data.ErrorMessage === 'Token Expired' || data.ErrorMessage === 'Token Expired' || data.ErrorMessage === 'Unauthorized' || data.ErrorMessage === 'Unauthorized.') {
                    snackBarError('Token Expired')
                    doLogout();
                }
                if (data.Data) {
                    return data.Data;
                } else if (data.data) {
                    return data.data;
                } else {
                    return []
                }
            } else {
                if (data.ErrorMessage === 'Token Expired' || data.ErrorMessage === 'Token Expired' || data.ErrorMessage === 'Unauthorized' || data.ErrorMessage === 'Unauthorized.') {
                    snackBarError('Token Expired')
                    doLogout();
                    return false;
                } else {
                    return true;
                }
            }
        } else {
            // alert(JSON.stringify({
            //     data,
            //     apiUrl,
            //     body
            // }));
            if (data.ErrorMessage === 'Token Expired' || data.ErrorMessage === 'Token Expired' || data.ErrorMessage === 'Unauthorized' || data.ErrorMessage === 'Unauthorized.') {
                snackBarError('Token Expired')
                doLogout();
            } else if (data.Status === 'false') {
                return data.Data;
            } else {
                snackBarError('[ ' + data.Status + ' ] ' + JSON.stringify(data.ErrorMessage));
                return false;
            }
        }
    } catch (error) {
        alert(JSON.stringify({
            data: error,
            apiUrl,
            body
        }));
        console.log(error);
        return false;
    }
}

async function getHeader(body) {
    try {
        let newHeader = header;
        if (body) {
            if (body.hasOwnProperty("_parts")) {
                // newHeader["Content-Type"] = 'multipart/form-data';
                delete newHeader["Content-Type"]
            } else {
                newHeader["Content-Type"] = 'application/json';
            }
        }
        let token = await getStorage('token');
        if (token) {
            newHeader.Authorization = 'Bearer ' + token
        }
        return newHeader;
    } catch (error) {
        alert(JSON.stringify(error));
        console.log(error)
    }
}

export const arkApi = async ({ metod, svc, url, param, body }) => {
    let apiUrl = api(svc, url, param);
    let header = await getHeader(body);
    let res;
    try {
        switch (metod) {
            case 'get':
                res = await axios.get(apiUrl, { headers: header })
                return getRes(res.data, apiUrl, body, header);
            case 'post':
                res = await axios.post(apiUrl, body, { headers: header })
                return getRes(res.data, apiUrl, body, header);
            case 'put':
                res = await axios.put(apiUrl, body, { headers: header })
                return getRes(res.data, apiUrl, body, header);
            case 'delete':
                res = await axios.delete(apiUrl, { headers: header })
                return getRes(res.data, apiUrl, body, header);
            default:
                return false
        }
    } catch (error) {
        console.log(error)
        return getRes({ Status: 500, ErrorMessage: 'internal server error' }, apiUrl, body, header);
    }
}

export const arkPost = async (url, body, serv) => {
    try {
        const apiUrl = host[serv] + service[serv] + url;
        let res = await axios.post(apiUrl, body, { headers: header });
        return getResponse(res.data, apiUrl, body, header);
    } catch (err) {
        console.log(err)
        let data = { Status: 500, ErrorMessage: 'internal server error' };
        return getResponse(data);
    }
};

export const arkFormPost = async (url, formData, serv) => {
    const apiUrl = host[serv] + service[serv] + url;
    try {
        let res = await axios.post(apiUrl, formData);
        return getResponse(res.data, apiUrl, formData, null);
    } catch (err) {
        console.log(err)
        let data = { Status: 500, ErrorMessage: 'internal server error' };
        return getResponse(data, apiUrl, formData, null);
    }
};

export const arkPostAuth = async (url, body, serv) => {
    try {
        const token = await getStorage('token');
        let header = headerAuth;
        headerAuth.Authorization = 'Bearer ' + token;
        const apiUrl = host[serv] + service[serv] + url;
        let res = await axios.post(apiUrl, body, { headers: header });
        return getResponse(res.data, apiUrl, body, header);
    } catch (err) {
        console.log(err)
        let data = { Status: 500, ErrorMessage: 'internal server error' };
        return getResponse(data);
    }
};

export const arkPutAuth = async (url, body, serv) => {
    try {
        const token = await getStorage('token');
        let header = headerAuth;
        headerAuth.Authorization = 'Bearer ' + token;
        const apiUrl = host[serv] + service[serv] + url;
        let res = await axios.put(apiUrl, body, { headers: header });
        return getResponse(res.data, apiUrl, null, header);
    } catch (err) {
        console.log(err)
        let data = { Status: 500, ErrorMessage: 'internal server error' };
        return getResponse(data);
    }
};


export const arkGetAuth = async (url, serv) => {
    try {
        const token = await getStorage('token');
        let header = headerAuth;
        headerAuth.Authorization = 'Bearer ' + token;
        const apiUrl = host[serv] + service[serv] + url;
        let res = await axios.get(apiUrl, { headers: header });
        return getResponse(res.data, apiUrl, 'null', header);
    } catch (err) {
        console.log(err)
        let data = { Status: 500, ErrorMessage: 'internal server error' };
        return getResponse(data);
    }
};

export const arkDelete = async (url, serv) => {
    try {
        const token = await getStorage('token');
        let header = headerAuth;
        headerAuth.Authorization = 'Bearer ' + token;
        const apiUrl = host[serv] + service[serv] + url;
        let res = await axios.delete(apiUrl, { headers: header });
        return getResponse(res.data, apiUrl, 'null', header);
    } catch (err) {
        console.log(err)
        let data = { Status: 500, ErrorMessage: 'internal server error' };
        return getResponse(data);
    }
};