import { Navigation } from 'react-native-navigation';
// import { gestureHandlerRootHOC } from 'react-native-gesture-handler'

import { Provider } from 'react-redux';
import { store } from '../redux/store/store';

import Template from '../view/tabs/template';
import Home from '../view/tabs/home';

export function registerScreens() {

  Navigation.registerComponent('ark.Intro', () => require('../view/login/intro').default);
  Navigation.registerComponent('ark.Login', () => require('../view/login/login').default);
  Navigation.registerComponent('ark.LoginPhone', () => require('../view/login/loginPhone').default);
  Navigation.registerComponent('ark.Register', () => require('../view/login/register').default);
  Navigation.registerComponent('ark.Forgot', () => require('../view/login/forgotPassword').default);
  Navigation.registerComponent('ark.ChangePass', () => require('../view/login/changePassword').default);
  Navigation.registerComponent('ark.OTP', () => require('../view/login/otp').default);
  Navigation.registerComponent('ark.Information', () => require('../view/login/information').default);
  Navigation.registerComponent('ark.TermAndCondition', () => require('../view/login/termANC').default);
  Navigation.registerComponent('ark.Splash', () => require('../view/login/splash').default);

  Navigation.registerComponent('ark.Home', () => Home);
  Navigation.registerComponentWithRedux('ark.Profile', () => require('../view/tabs/profile').default, Provider, store);
  Navigation.registerComponent('ark.Product', () => require('../view/tabs/product').default);
  Navigation.registerComponent('ark.Template', () => Template);
  Navigation.registerComponent('ark.Billers', () => require('../view/tabs/billers').default);

  Navigation.registerComponent('ark.Balance', () => require('../view/home/balance').default);
  Navigation.registerComponent('ark.Pulsa', () => require('../view/ppob/pulsa').default);
  Navigation.registerComponent('ark.PaketData', () => require('../view/ppob/PaketData').default);
  Navigation.registerComponent('ark.ListrikPost', () => require('../view/ppob/listrikPost').default);
  Navigation.registerComponent('ark.DetailAds', () => require('../view/home/detailAds').default);

  Navigation.registerComponent('ark.Saving', () => require('../view/saving/saving').default);
  Navigation.registerComponent('ark.Loan', () => require('../view/loan/myLoan').default);
  Navigation.registerComponent('ark.ListLoan', () => require('../view/loan/listLoan').default);
  Navigation.registerComponent('ark.LoanType', () => require('../view/loan/typeLoan').default);
  Navigation.registerComponent('ark.LoanTNC', () => require('../view/loan/loanTNC').default);
  Navigation.registerComponent('ark.DetailLoan', () => require('../view/loan/detailLoan').default);
  Navigation.registerComponent('ark.SumaryLoan', () => require('../view/loan/sumaryLoan').default);
  Navigation.registerComponent('ark.LoanInformation', () => require('../view/loan/loanInformation').default);
  Navigation.registerComponent('ark.MenuRepayment', () => require('../view/loan/repayment').default);
  Navigation.registerComponent('ark.TypeRepayment', () => require('../view/loan/typeRepayment').default);
  Navigation.registerComponent('ark.ProofRepayment', () => require('../view/loan/proofRepayment').default);
  Navigation.registerComponent('ark.Disbursement', () => require('../view/loan/disbursement').default);

  Navigation.registerComponent('ark.Account', () => require('../view/profile/account').default);
  Navigation.registerComponent('ark.Settings', () => require('../view/profile/settings').default);
  Navigation.registerComponent('ark.Bank', () => require('../view/profile/bank').default);
  Navigation.registerComponent('ark.Documents', () => require('../view/profile/documents').default);
  Navigation.registerComponent('ark.Address', () => require('../view/profile/address').default);
  Navigation.registerComponent('ark.DetailAddress', () => require('../view/profile/detailAddress').default);
  Navigation.registerComponent('ark.UpdateAddress', () => require('../view/profile/updateAddress').default);
  Navigation.registerComponent('ark.ChangeEmail', () => require('../view/profile/changeEmail').default);
  Navigation.registerComponent('ark.ProfileInformation', () => require('../view/profile/profileInformation').default);
  Navigation.registerComponent('ark.DetailProfile', () => require('../view/profile/detailProfile').default);
  Navigation.registerComponent('ark.Employe', () => require('../view/profile/employ').default);
  Navigation.registerComponent('ark.System', () => require('../view/profile/system').default);

  Navigation.registerComponent('ark.Cart', () => require('../view/order/cart').default);
  Navigation.registerComponent('ark.Payment', () => require('../view/order/payment').default);
  Navigation.registerComponent('ark.PaymentAddress', () => require('../view/order/paymentAddress').default);
  Navigation.registerComponent('ark.PaymentInformation', () => require('../view/order/paymentInformation').default);
  Navigation.registerComponent('ark.Order', () => require('../view/order/order').default);
  Navigation.registerComponent('ark.DetailOrder', () => require('../view/order/detailOrder').default);

  Navigation.registerComponent('ark.ListPulsa', () => require('../view/ppob/listPulsa').default);
  Navigation.registerComponent('ark.DetailPulsa', () => require('../view/ppob/detailPulsa').default);
  Navigation.registerComponent('ark.CheckOut', () => require('../view/ppob/checkOut').default);

  Navigation.registerComponent('ark.DetailProduct', () => require('../view/product/detailProduct').default);
  Navigation.registerComponent('ark.SearchPage', () => require('../view/product/searchPage').default);
  Navigation.registerComponent('ark.SearchProduct', () => require('../view/product/searchProduct').default);
  Navigation.registerComponent('ark.WishList', () => require('../view/product/wishlist').default);

  Navigation.registerComponent('ark.Notif', () => require('../view/tabs/notification').default);







}