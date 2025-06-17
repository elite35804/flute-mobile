import {NativeModules} from 'react-native';

const RNCardIOModule = NativeModules.CardIOModule;

const defConfig = {
  hideCardIOLogo: true,
  useCardIOLogo: false,
};

const CardIOModule = {
  scanCard(config = defConfig) {
    return RNCardIOModule.scanCard(config);
  },
};

export default CardIOModule;
