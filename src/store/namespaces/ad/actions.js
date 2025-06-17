import {_} from 'lodash';

export const getTotalAds = async ({state, effects}) => {
  const {ads} = await effects.gql.queries.ads();
  state.ads.totalRecords = ads ? ads.length : 0;
};

export const getAds = async ({state, effects}, data) => {
  let options = {};
  if (data && data.options) options = data.options;
  else if (data && data.all) options = {};
  else {
    options = {
      first: state.ads.adPerPage,
      skip: (state.ads.activePage - 1) * state.ads.adPerPage,
    };
  }
  //
  const {ads} = await effects.gql.queries.ads(options);
  if (data && data.getValues) return ads;
  else state.ads.ads = _.keyBy(ads, 'id');
};

export const saveAd = async ({effects}, data) => {
  return await effects.gql.mutations.saveAd(data);
};

export const onChangePage = async ({state}, page) => {
  state.ads.activePage = page;
};

export const onAdAdded = ({state}, data) => {
  state.ads.push(data);
};

export const checkForQualifiedAds = async ({state, actions, effects}, data) => {
  const {checkForQualifiedAds} = await effects.gql.mutations.checkForQualifiedAds(data);
  console.log(checkForQualifiedAds, 'CheckForQualifiedAds');
  const campaigns = [];
  checkForQualifiedAds.showAds?.map((s) => {
    if (!campaigns?.find((a) => a?.id === s?.campaign?.id)) campaigns.push(s.campaign);
  });
  if (state.currentUser?.id) {
    state.ad.adByLocation = campaigns;
    state.ad.showAds = checkForQualifiedAds?.showAds;
  } else {
    state.ad.adByLocation = campaigns;
  }
  return checkForQualifiedAds;
};

export const checkForQualifiedAdsByLocation = async ({effects, state}, data) => {
  console.log(data, 'data');
  const {checkForQualifiedAdsByLocation} = await effects.gql.mutations.checkForQualifiedAdsByLocation(data);
  console.log(checkForQualifiedAdsByLocation, 'CheckForQualifiedAdsByLocation');
  state.ad.illegalState = checkForQualifiedAdsByLocation.status;
  if (!checkForQualifiedAdsByLocation?.status) {
    if (state.currentUser?.id) {
      state.ad.adByLocation = checkForQualifiedAdsByLocation?.campaigns;
      state.ad.showAds = checkForQualifiedAdsByLocation?.user?.showAds;
    } else {
      state.ad.adByLocation = checkForQualifiedAdsByLocation?.campaigns;
    }
  } else {
    state.ad.adByLocation = [];
    state.ad.showAds = [];
  }
  return checkForQualifiedAdsByLocation;
};

export const setFluteAd = ({state, actions}, ad) => {
  state.ad.fluteAd = ad;
};

export const dismissAd = async ({effects}, data) => {
  await effects.gql.mutations.dismissAd(data);
};

export const adRedeemeds = async ({effects}, data) => {
  return await effects.gql.queries.adRedeemeds(data);
};
