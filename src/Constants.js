import {Dimensions, Platform, StatusBar} from 'react-native';

const {width, height} = Dimensions.get('window');

const isIphoneX =
  Platform.OS === 'ios' &&
  !Platform.isPad &&
  !Platform.isTVOS &&
  (height === 812 || width === 812 || height === 896 || width === 896);

/*
*
*/
export const TabBarStyle = {
  top: 'TOP',
  bottom: 'BOTTOM',
};

/*
*
*/
export const Constants = {
  NavBarHeight: 50,
  ToolbarHeight: Platform.OS === 'ios' ? (isIphoneX ? 35 : 22) : StatusBar.currentHeight,
  ScreenWidth: width,
  ScreenHeight: height,
  tabBarStyle: TabBarStyle.top,
};

/*
*
*/
export const PaymentSetting = {
  compedByCreator: {value: 'COMPED_BY_CREATOR', title: "It's my treat"},
  eachPay: {value: 'EACH_PAY', title: "We're going Dutch"},
}

PaymentSetting.all = [
  PaymentSetting.compedByCreator,
  PaymentSetting.eachPay
]

/*
*
*/
export const drink = ['Vodka', 'Gin', 'Whiskey', 'Rum', 'Tequila', 'Cognac', 'Champagne', 'Beer', 'Wine', 'Brandy', 'Malt Beverage', 'Cider', 'Liqueur', 'Spirit', 'Mezcal', 'Seltzer'];
export const tips = ['10%', '12%', '13%', '14%', '15%', '16%', '17%', '18%', '19%', '20%', '21%', '22%', '23%', '24%', '25%', '26%', '27%', '28%', '29%', '30%']
