// import OneSignal from 'react-native-onesignal';
// import { OneSignal as Config } from '@/Config';
import { _ } from 'lodash';

/*
*
*/
export const initialize = async ({ actions }) => {
  try {
    // OneSignal.init(Config.appId, {kOSSettingsKeyInFocusDisplayOption: 0});
    // OneSignal.provideUserConsent(true);
    // // OneSignal.inFocusDisplaying(2)
    // OneSignal.addEventListener('ids', (device) => {
    //   console.log(device, '___________________________________');
    //   actions.pushNotification.setPlayerId(device);
    // });
  } catch (ex) {
    console.log('PushNotification:: initialize() - ', 'Exception occurred', ex);
  }
}

/*
*
*/
export const subscribe = async ({ state, actions }) => {
  // Clear all current cache
  state.pushNotification.notification = undefined;
  state.pushNotification.playerId = undefined;
  state.pushNotification.openResult = undefined;

  try {
    // OneSignal.addEventListener('received', actions.pushNotification.setNotification);
    // OneSignal.addEventListener('opened', actions.pushNotification.setOpenResult);

  } catch (error) {
    console.log('PushNotification::subscribe() - Error Occurred', error);
  }
}

/*
*
*/
export const unsubscribe = async ({ state, actions }) => {
  // Clear all current cache
  state.pushNotification.notification = undefined;
  state.pushNotification.playerId = undefined;
  state.pushNotification.openResult = undefined;

  try {
    OneSignal.removeEventListener('received', actions.pushNotification.setNotification);
    OneSignal.removeEventListener('opened', actions.pushNotification.setOpenResult);

  } catch (error) {
    console.log('PushNotification::unsubscribe() - Error Occurred', error);
  }
}

/*
*
*/
export const setPlayerId = async ({ state }, playerId) => {
  state.pushNotification.playerId = playerId;
}

/*
*
*/
export const setNotification = async ({ state }, notification) => {
  state.pushNotification.notification = notification;
}

/*
*
*/
export const setOpenResult = async ({ state }, openResult) => {
  state.pushNotification.openResult = openResult;
}
