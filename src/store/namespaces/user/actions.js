import React from 'react';
import {Braintree} from '@/views/Components/braintree';
import {get, isNil, map, keyBy, isEmpty} from 'lodash';
import * as RNLocalize from 'react-native-localize';
import {json} from 'overmind';
import moment from 'moment';
import {AppDetails} from '@/Config';
import {deleteAd} from '@/store/effects/gql/ad/mutations';
import Geolocation from '@react-native-community/geolocation';

/*
 *
 */
export const getTotalUsers = async ({state, effects}) => {
  const {users} = await effects.gql.queries.users();
  state.user.totalRecords = users ? users.length : 0;
};

/*
 *
 */
export const filterUsers = async ({state, effects}, filter) => {
  try {
    state.user.isLoading = true;
    const result = await effects.gql.queries.users({match: filter});
    // await actions.search.search({keywords: userSearchKeyword, userId: currentUser.id});

    console.log(result, 'result');

    state.user.isLoading = false;
    state.user.filteredUsers = result.users;
  } catch (e) {
    setValidationErrors(errors); // flat map errors
    // actions.alert.showError('Failed to update user', Title);
  }
};

/*
 *
 */
export const getUsers = async ({state, effects}, data) => {
  try {
    let options = {};
    if (isEmpty(data)) {
      options = {
        first: state.user.userPerPage,
        skip: (state.user.activePage - 1) * state.user.userPerPage,
      };
    } else {
      options = data;
      if (!data.first) options.first = state.user.userPerPage;
      if (!data.skip) options.skip = (state.user.activePage - 1) * state.user.userPerPage;
    }

    console.log(options, 'getUsers options');

    const {users} = await effects.gql.queries.users(options);

    console.log(users, 'getUsers results');

    state.user.users = keyBy(users, 'id');
  } catch (e) {
    console.log(e, 'getUsers errors');
  }
};

/*
 *
 */
export const getUser = async ({state, effects}, options) => {
  try {
    console.log(options, 'getUser options');

    const {user} = await effects.gql.queries.user(options);

    console.log(user, 'getUser results');

    state.user.users[user.id] = user;
    return json(user);
  } catch (e) {
    console.log(e, 'getUser errors');
  }
};

/*
 *
 */
export const saveUser = async ({state, effects, actions}, variables) => {
  try {
    // Delete temporary site name
    if (variables && variables.siteName) delete variables.siteName;

    const {avatar, employer} = variables;

    if (avatar?.base64) {
      Object.assign(variables, {
        avatar: avatar.base64,
        avatarType: avatar.contentType,
      });
    } else {
      delete variables.avatar;
    }

    // Add some location props
    // Check if from google places selector
    const placeId = employer?.details?.place_id || employer?.googlePlacesId;
    const coords = employer?.details?.coords || employer?.gps;

    if (employer?.id) {
      // when site is picker
      variables.connectAddresses = {id: employer.id};
    } else if (placeId) {
      // if has google place id
      variables.googlePlacesId = placeId;
    } else if (coords) {
      // When selected from current location
      variables.gps = {lat: coords.latitude, lon: coords.longitude};
    }
    // set timezone offset and timezone
    variables.timezoneOffset = new Date().getTimezoneOffset();
    variables.timezone = RNLocalize.getTimeZone();
    variables.userId = state.currentUser.id;
    delete variables.employer;

    console.log(variables, 'save user variables');

    const updatedUser = await effects.gql.mutations.updateUserProfile(variables);

    console.log(updatedUser.updateUser.user);

    state.currentUser = updatedUser.updateUser.user;
    return updatedUser.updateUser.user;
  } catch (e) {
    console.log(e, Object.keys(e), 'saveUser raw errors');

    if (e?.response?.errors) {
      console.log(map(e.response.errors, 'message'), 'saveUser errors');
      await actions.alert.showError({message: e.response.errors[0]['message'], title: 'Profile Update'});
    }
  }
};

export const awsTempToken = async ({effects, actions}, data) => {
  try {
    return await effects.gql.queries.awsTempToken(data);
  } catch (e) {
    console.log(e);
    actions.alert.showError({message: e.response.errors[0]['message']});
  }
};

export const userRedeemedCampaigns = async ({state, effects}) => {
  try {
    const {userRedeemedCampaigns} = await effects.gql.queries.userRedeemedCampaigns({userId: state.currentUser.id});
    state.user.redeemedCampaigns = userRedeemedCampaigns;
    console.log('userRedeemedCampaigns =>', userRedeemedCampaigns);
    return userRedeemedCampaigns;
  } catch (e) {
    console.log(e);
    return false;
  }
};

/*
 *
 */
export const onChangePage = async ({state}, page) => {
  state.user.activePage = page;
};

/*
 *
 */
export const onUserAdded = ({state}, data) => {
  state.user.push(data);
};

/**
 * Use Add Payment Hook
 * @return {[type]} [description]
 */
export const addUserBraintreePayment = async ({state, effects}, addPaymentHandler) => {
  const {currentUser} = state;

  const result = await effects.gql.mutations.generateBraintreeClientToken({
    customerId: currentUser.braintreeCustomerId,
  });
  const token = result.generateBraintreeClientToken;

  try {
    const res = await Braintree.showDropIn(token);
    if (!res || !res.paymentOptionType) {
      console.log('useAddPayment() : Failed to add braintree.');
      addPaymentHandler({error: new Error('useAddPayment() : Failed to add braintree.')});
      return false;
    }

    const paymentMethod = {
      type: 'payment',
      cardType: Braintree.getOptionType(res.paymentOptionType),
      last4: res.paymentDescription,
      token: res.paymentNonce,
      isValid: true,
      isDefault: true,
    };

    console.log('useAddPayment() : braintree response - ', res, paymentMethod);
    const updatedUser = await effects.gql.mutations.updateUserProfile({paymentMethod, userId: state.currentUser.id});
    state.currentUser = updatedUser.updateUser.user;
    addPaymentHandler({data: paymentMethod, added: state.currentUser.paymentMethods.find((p) => p.type === 'payment')});
  } catch (error) {
    addPaymentHandler({error});
    console.log(error);
  }
};

/*
 *
 */
export const requestSupport = async ({effects, actions}, data) => {
  try {
    await effects.gql.mutations.requestSupport(data);
    await actions.alert.showSuccess({
      message: 'Someone will be in touch with you ASAP. Thanks!',
      title: 'Flute',
    });
    return true;
  } catch (e) {
    console.log(e, 'requestSupport errors');
  }
};

export const updateUserLocation = async ({effects, actions, state}, data) => {
  try {
    await effects.gql.mutations.updateUserProfile({userId: state.currentUser.id, ...data});
  } catch (e) {
    console.log(e, 'updateUserProfile issues');
  }
};

export const findSocialUsers = async ({effects, actions, state}) => {
  try {
    console.log(state.location.location);
    const byGPS = {
      gps: {
        lon: state.location.location?.lng | -118.4243946,
        lat: state.location.location?.lat | 34.1471148,
      },
      radius: 1000,
    };
    const {findSocialUsers} = await effects.gql.queries.findSocialUsers({userId: state.currentUser.id, byGPS});
    state.user.socialUsers = findSocialUsers?.items;
    console.log(state.user.socialUsers, '======> Social Users');
  } catch (e) {
    console.log(e, 'Find social Users issue');
  }
};

export const getAge = async ({effects, state, actions}, date) => {
  if (!date) return 0;
  const mnow = moment(new Date());
  const mdate = moment(date);
  return mnow.diff(mdate, 'years');
};

export const userAcceptedCampaigns = async ({state, effects, actions}) => {
  try {
    const {userAcceptedCampaigns} = await effects.gql.queries.userAcceptedCampaigns({userId: state.currentUser.id});
    state.user.campaigns = userAcceptedCampaigns;
  } catch (e) {
    console.log(e);
  }
};

export const updateUser = async ({state, effects, actions}, data) => {
  try {
    const {saveUser} = await effects.gql.mutations.saveUser(data);
    state.currentUser = saveUser;
  } catch (e) {
    console.log(e);
  }
};

export const getWalletTransactions = async ({state, effects, actions}) => {
  try {
    const {getWalletTransactions} = await effects.gql.queries.getWalletTransactions({userId: state.currentUser.id});
    console.log(getWalletTransactions, 'getWalletTransactions')
    state.user.transactions = getWalletTransactions;
  } catch (e) {
    console.log(e);
  }
};

export const getUserTabs = async ({state, effects, actions}) => {
  try {
    const {getUserTabs} = await effects.gql.queries.getUserTabs({userId: state.currentUser.id});
    state.user.tabs = getUserTabs;
  } catch (e) {
    console.log(e);
  }
};

export const setSocialCb = ({state, actions}, data) => {
  state.user.socialCb = data;
};

export const updateUserProfile = async ({state, actions, effects}, data) => {
  console.log({userId: state.currentUser.id, ...data});
  try {
    const {updateUser} = await effects.gql.mutations.updateUserProfile({userId: state.currentUser.id, ...data});
    state.currentUser = updateUser.user;
    return updateUser.user;
  } catch (e) {
    console.log(e);
    if (e?.message?.includes('Gateway Rejected')) {
      actions.alert.showError({
        message: 'Your payment method has been flagged by our team. We will notify you of our findings',
      });
    } else {
      actions.alert.showError({message: e?.response?.errors?.[0]?.message});
    }
    return false;
  }
};

export const deactivateUser = async ({effects, state}) => {
  try {
    await effects.gql.mutations.deactivateUser({userId: state.currentUser.id});
  } catch (e) {
    console.log(e);
  }
};

export const validateFluteCode = async ({state, effects, actions}, data) => {
  try {
    console.log(data, 'data');
    const {validateFluteCode} = await effects.gql.mutations.validateFluteCode(data);
    console.log(validateFluteCode, 'validateFluteCode');
    return validateFluteCode;
  } catch (e) {
    console.log(e?.response?.errors);
    if (e?.response?.errors?.[0]?.message === 'DUPLICATE') {
      return {
        isDuplicated: true
      }
    }
  }
};

export const sendFlutes = async ({state, effects, actions}, data) => {
  try {
    const {sendFlutes} = await effects.gql.mutations.sendFlutes(data);
    return sendFlutes;
  } catch (e) {
    console.log(e);
  }
};

export const doAccountsExist = async ({state, effects, actions}, data) => {
  try {
    const {doAccountsExist} = await effects.gql.mutations.doAccountsExist(data);
    return doAccountsExist;
  } catch (e) {
    console.log(e);
  }
};

export const inviteContact = async ({state, effects, actions}, data) => {
  try {
    const {inviteContact} = await effects.gql.mutations.inviteContact(data);
    console.log(inviteContact);
  } catch (e) {
    console.log(e);
  }
};

export const deleteUserAddress = async ({state, actions, effects}, data) => {
  try {
    const {deleteUserAddress} = await effects.gql.mutations.deleteUserAddress(data);
    console.log(deleteUserAddress, '+++++++++++++++++++++++++++++++');
    state.currentUser = deleteUserAddress;
  } catch (e) {
    console.log(e);
  }
};

export const getPlaceFromCoordinates = async ({state, effects}, data) => {
  try {
    const {getPlaceFromCoordinates} = await effects.gql.queries.getPlaceFromCoordinates(data);
    return getPlaceFromCoordinates;
  } catch (e) {
    console.log(e);
  }
};

export const generateBraintreeClientToken = async ({effects, state}) => {
  try {
    return await effects.gql.mutations.generateBraintreeClientToken({customerId: state.currentUser.id});
  } catch (e) {
    console.log(e, 'generateBraintree Client Token issue');
  }
};
