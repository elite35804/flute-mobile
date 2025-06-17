import {getDistance} from 'geolib';
import { google } from '@/Config';
import _ from 'lodash';
import {latlng, latlng2} from "@/utils/LocUtils";

export const _onLocation = async ({state, effects, actions}, e) => {
  // check updated at least 10m
  try {
    const location = latlng(e);
    const isInit = !state.location.location;
    if (!isInit) {
      const dist = getDistance(latlng2(state.location.location), latlng2(location));
      if (dist < 10) return;
    }

    state.location.location = location;
    state.location.searchLocation = location;
    // if (!gs.location.search.byAddress) {
    //   handler.main.update.venue();
    // }
    await actions.user.updateUserLocation({gps: state.location.location});
    await actions.location.requestAddress();
    // this.checkFences();
    //
    // this.main && this.main.onLocation(e, isInit);
  } catch (e) {
    console.log(e, '_onLocation issue');
  }

};

export const requestAddress = async ({state, actions}) => {
  try {
    const params = {
      key: google.webkey,
    };
    params.latlng = `${state.location.location.lat},${state.location.location.lon}`;


    const suffix = Object.keys(params).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`).join('&')

    const res = await fetch('https://maps.googleapis.com/maps/api/geocode/json?' + suffix);
    const data = await res.json();
    console.log(data);
    if (data.status === 200) {
      const place = actions.location.parse_address(res);
      state.location.location.address.street = place?.streetAddress?.long_name;
      state.location.location.address.city = place?.city?.long_name;
      state.location.location.address.state = place?.status.long_name;
      state.location.location.address.zipcode = place?.zip?.long_name;
      state.location.location.address2.short = actions.location.address_from_google({data: res, type: 'city,status'});
      state.location.location.address2.long = actions.location.address_from_google({data: res, type: 'formatted'});

      console.log('device address: ', state.location.location);
    }
  } catch (e) {
    console.log('changeLocation failed: ', e);
  }
}

export const parse_address = ({state, effects, actions}, data) => {
  let place = null;
  if (data.length) place = data;
  else if (data.data && data.data.results && data.data.results.length) place = data.data.results;
  else if (data.results && data.results.length) place = data.results;
  else if (data.result) place = [data.result];

  place = place[0];
  const comps = place.address_components || [];

  let streetNumber, streetAddress, route, neighbor, zip, status, city, country;

  _.each(comps, (comp) => {
    _.each(comp.types || [], (addrType) => {
      if (addrType === 'street_number') streetNumber = comp;
      else if (addrType === 'street_address') streetAddress = comp;
      else if (addrType === 'route') route = comp;
      else if (addrType === 'neighborhood') neighbor = comp;
      else if (addrType === 'locality') city = comp;
      else if (addrType === 'administrative_area_level_1') status = comp;
      else if (addrType === 'country') country = comp;
      else if (addrType === 'postal_code') zip = comp;
    });
  });
  return {
    streetNumber,
    streetAddress,
    route,
    neighbor,
    zip,
    status,
    city,
    country,
  };
};

export const address_from_google = ({state, actions}, {data, type}) => {
  const place = g.location.parse_address(data);

  if (type === 'formatted') {
    if (place.formatted_address && place.formatted_address.length) return place.formatted_address;
    type = 'street,city,state,zip,country';
  }

  let addr = '';
  if (!type) type = 'street,state,zip';
  if (type.indexOf('street') >= 0) {
    if (place.streetNumber && place.streetAddress) addr = `${place.streetNumber.long_name} ${place.streetAddress.long_name}`;
    else if (place.streetAddress) addr = place.streetAddress.long_name;
    else if (place.streetNumber && place.route) addr = `${place.streetNumber.long_name} ${place.route.long_name}`;
    else if (place.route) addr = place.route.long_name;
    else if (place.neighbor) addr = place.neighbor.long_name;
  }
  if (type.indexOf('city') >= 0) {
    if (place.city && addr.length) addr = `${addr}, ${place.city.long_name}`;
    else if (place.city) addr = place.city.long_name;
  }
  if (type.indexOf('status') >= 0) {
    if (place.state && addr.length) addr = `${addr}, ${place.state.short_name}`;
    else if (place.state) addr = place.state.short_name;
  }
  if (type.indexOf('zip') >= 0) {
    if (place.zip && addr.length) addr = `${addr} ${place.zip.long_name}`;
    else if (place.zip) addr = place.zip.long_name;
  }
  if (type.indexOf('country') >= 0) {
    if (place.country && addr.length) addr = `${addr}, ${place.country.long_name}`;
    else if (place.country) addr = place.country.long_name;
  }

  return addr;
};
