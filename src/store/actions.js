import {AppDetails} from '@/Config';
import * as internalActions from '@/store/internalActions';
import * as Storage from '@/utils/AsyncStorage';
import {isEmpty} from 'lodash';

const TOKEN_NAME = '@' + AppDetails.appName.toLowerCase().replace(/\s/g, '') + ':token';

export const internal = internalActions;

/*
 *
 */
export const isProfileUnset = ({state}) => {
  return isEmpty(state.currentUser.email) || isEmpty(state.currentUser.fullName) || isEmpty(state.currentUser.id);
};

/*
 *
 */
export const createAppUser = async ({state, effects, actions}, variables) => {
  console.log('creating app user...', variables);

  try {
    const user = await effects.gql.mutations.createAppUser(variables);
    state.currentUser = user.createAppUser.user;
    return user.createAppUser;
  } catch (e) {
    console.log(e);
    actions.alert.showError({message: e?.response?.errors[0].message, title: 'Flute'});
  }
};

/*
 *
 */
export const verifySmsCode = async ({effects, actions}, variables) => {
  console.log('verifying sms code...');

  try {
    const result = await effects.gql.mutations.verifySmsCode(variables);
    return result.verifySmsCode;
  } catch (e) {
    console.log(e.response.errors);
    actions.alert.showError({message: e?.response?.errors[0].message, title: 'Flute'});
  }
};

/*
 *
 */
export const setStoredAuthToken = async ({state}) => {
  return Storage.putObject(TOKEN_NAME, {token: state.authToken, userId: state.currentUser.id});
};

/*
 *
 */
export const getStoredAuthToken = async () => {
  var TOKEN = await Storage.getObject(TOKEN_NAME);
  if (!TOKEN) {
    Storage.putObject(TOKEN_NAME, {token: null, userId: null});
    return {token: null, userId: null};
  }
  return TOKEN;
};

/*
 *
 */
export const removeStoredAuthToken = async () => {
  return Storage.remove(TOKEN_NAME);
};

/*
 *
 */
export const logout = async ({state, actions}) => {
  state.currentUser = null;
  state.isLoggedIn = false;
  state.authToken = null;

  await actions.removeStoredAuthToken();
  // actions.pushNotification.unsubscribe();
  return true;
};

/*
 *
 */
export const login = async ({effects, state, actions}, variables) => {
  try {
    const {login} = await effects.gql.mutations.login(variables);

    state.currentUser = login.user;
    state.isLoggedIn = true;
    state.authToken = login.token;

    await actions.setStoredAuthToken();
    return true;
  } catch (e) {
    await actions.removeStoredAuthToken();
    console.log(e.response.errors);
    actions.alert.showError({message: e.message?.split('.:')[0], title: 'Flute'});
  }
};

/*
 *
 */
export const loginWithToken = async ({effects, state, actions}, variables) => {
  console.log('logging in with token...', variables);

  if (!variables.token || !variables.userId) {
    state.isAuthenticating = false;
    return;
  }

  try {
    const {loginWithToken} = await effects.gql.mutations.loginWithToken(variables);
    console.log(loginWithToken, 'loginWithToken');
    state.currentUser = loginWithToken.user;
    state.isLoggedIn = true;
    state.authToken = variables.token;
    state.isAuthenticating = false;
    await actions.setStoredAuthToken();
    await actions.user.userRedeemedCampaigns();
    // actions.pushNotification.subscribe();
    // await actions.location.getDeviceLocation();
    // const params = {
    //   userId: state.currentUser?.id,
    //   siteId: siteId
    // };
    // await actions.ad.checkForQualifiedAdsByLocation(params);
    // await actions.user.findSocialUsers();
    // await actions.user.userAcceptedCampaigns();
    await actions.user.getWalletTransactions();
    await actions.user.getUserTabs();
    return true;
  } catch (e) {
    state.isAuthenticating = false;
    await actions.removeStoredAuthToken();
    console.log(e.response.errors);
    actions.alert.showError({message: e.message?.split('.:')[0], title: 'Flute'});
  }
};

/*
 *
 */
export const onUserChange = async ({state, effects}) => {
  console.log(state.currentUser, 'user subscription reaction =========================================');

  // query user from db to get newest relational data
  const result = await effects.gql.queries.users({where: {id: state.currentUser.id}});
  state.currentUser = result.users[0];
};

/*
 *
 */
export const focusInput = ({state}) => {
  state.errors = [];
};

/*
 *
 */
export const connectionChanged = ({state}, connected) => {
  state.connected = connected;
};

export const getCurrentUser = async ({state, effects}) => {
  try {
    const {getUserById} = await effects.gql.queries.getUserById({userId: state.currentUser.id});
    state.currentUser = getUserById;
  } catch (e) {
    console.log(e);
    return false;
  }
};
/*
 * Init User in Local Storage ('user_info_snapshot')
 */
export const initializeUserFromStorage = ({state}, user) => {
  return Storage.getObject(key)
    .then((snapshot) => {
      if (snapshot) {
        applySnapshot(store, snapshot);
      }
    })
    .catch((e) => {
      console.error('UserStore::initialize() : Error Occurred:', e);
    });
};

/*
 * Store User in Local Storage ('user_info_snapshot')
 */
export const scheduleWrite2Storage = ({state}, user) => {
  if (store._saveTimeoutHandler) {
    clearTimeout(store._saveTimeoutHandler);
  }
  // Save to local storage
  store._saveTimeoutHandler = setTimeout(() => {
    console.log('scheduleWrite2Storage(): Saving state to local storage');
    Storage.putObject(key, getSnapshot(store));
  }, 300);
};

/*
 *
 */
export const fetchCarts = async ({state, effects}, eventId) => {
  // const isfetching = true;
  const user = await effects.gql.mutations.createAppUser({
    where: {user: {id: user.id}},
  });

  await actions.cart.getCarts({where: {user: {id: currentUser.id}}});
  // console.log('====>fetch cart', error, result);
  // // state.isfetching = false;

  // if (error == null && result.errors == null) {
  //     const pending = result.data.carts.find(o => o.isPending &&
  //         (eventId == null ? (o.event == null || o.event.id == null) :
  //             (o.event != null && o.event.id == eventId)));
  // }
};

/*
 *
 */
export const setEventCart = async ({state}, data) => {
  try {
    state.eventCart = data;
  } catch (e) {
    console.log(e, 'setEventCart errors');
  }
};

/*
 *
 */
export const setErrors = ({state}, errors) => {
  state.errors = errors;
};

/*
 *
 */
export const signInClicked = ({state}, redirectTo) => {
  state.signInModalOpen = true;
  state.redirectOnLogin = redirectTo || '';
};

/*
 *
 */
export const signOutClicked = async ({state, effects, actions}) => {
  effects.analytics.track('Sign Out', {});
  state.workspace.openedWorkspaceItem = 'files';
  if (state.live.isLive) {
    actions.live.internal.disconnect();
  }
  await effects.api.signout();
  effects.jwt.reset();
  state.currentUser = null;
  effects.browser.reload();
};

/*
 *
 */
export const signInButtonClicked = async ({actions, state}, options) => {
  if (!options) {
    await actions.internal.signIn({
      useExtraScopes: false,
    });
    state.signInModalOpen = false;
    return;
  }
  await actions.internal.signIn(options);
  state.signInModalOpen = false;
};

/*
 *
 */
export const modalOpened = ({state, effects}, props) => {
  effects.analytics.track('Open Modal', {modal: props.modal});
  state.currentModal = props.modal;
  if (props.modal === 'preferences' && props.itemId) {
    state.preferences.itemId = props.itemId;
  } else {
    state.currentModalMessage = props.message || null;
  }
};

/*
 *
 */
export const modalClosed = ({state}) => {
  state.currentModal = null;
};

/*
 *
 */
export const toggleSignInModal = ({state}) => {
  state.signInModalOpen = !state.signInModalOpen;
};

/*
 *
 */
export const addNotification = ({effects}, {message, type, timeAlive}) => {
  console.log(type, 'type addNotification');
  effects.notificationToast.add({
    message,
    // status: effects.notificationToast.convertTypeToStatus(type),
    timeAlive: timeAlive * 1000,
  });
};

/*
 *
 */
export const removeNotification = ({state}, id) => {
  const notificationToRemoveIndex = state.notifications.findIndex((notification) => notification.id === id);

  state.notifications.splice(notificationToRemoveIndex, 1);
};

/*
 *
 */
export const notificationAdded = ({effects}, {title, notificationType, timeAlive}) => {
  console.log(notificationType, 'notificationType notificationAdded');
  effects.notificationToast.add({
    message: title,
    // status: convertTypeToStatus(notificationType),
    timeAlive: timeAlive ? timeAlive * 1000 : undefined,
  });
};

/*
 *
 */
export const notificationRemoved = ({state}, {id}) => {
  const {notifications} = state;
  const notificationToRemoveIndex = notifications.findIndex((notification) => notification.id === id);

  state.notifications.splice(notificationToRemoveIndex, 1);
};

/*
 *
 */
export const track = ({effects}, {name, data}) => {
  effects.analytics.track(name, data);
};

/*
 *
 */
export const signInGithubClicked = async ({state, actions}) => {
  state.isLoadingGithub = true;
  await actions.internal.signIn({useExtraScopes: true});
  state.isLoadingGithub = false;
};

/*
 *
 */
export const signOutGithubIntegration = async ({state, effects}) => {
  if (state.currentUser?.integrations?.github) {
    await effects.api.signoutGithubIntegration();
    delete state.currentUser.integrations.github;
  }
};

export const setLocPermission = ({state}, permission) => {
  state.locationPermission = permission;
};
