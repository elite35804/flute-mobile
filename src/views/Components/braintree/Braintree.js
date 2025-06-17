import {NativeModules} from 'react-native';

const RNBraintree = NativeModules.RNBraintree;

const Braintree = {
  showDropIn(clientToken) {
    return RNBraintree.showDropIn(clientToken);
  },

  getOptionType(type) {
    switch (type) {
      case 0:
        return 'Unknown';
      case 1:
        return 'American Expression';
      case 2:
        return 'Diners Club';
      case 3:
        return 'Discover';
      case 4:
        return 'Master Card';
      case 5:
        return 'Visa';
      case 6:
        return 'JCB';
      case 7:
        return 'Laser';
      case 8:
        return 'Maestro';
      case 9:
        return 'UnionPay';
      case 10:
        return 'Solo';
      case 11:
        return 'Switch';
      case 12:
        return 'UKMaestro';
      case 13:
        return 'PayPal';
      case 14:
        return 'Coinbase';
      case 15:
        return 'Venmo';
      case 16:
        return 'ApplePay';
      default:
        break;
    }
    return 'Unknown';
  },
};

export default Braintree;
