import _, {get, isEmpty} from 'lodash';
import { getDistance, convertDistance } from 'geolib';
import moment from 'moment';
import {google} from '@/Config';
import { defineProperty, setupItems } from './md_base';
import {Images} from "@/styles";
import {latlng} from "@/utils/LocUtils";

function getOpenDate(dow, time) {
  let date = moment().startOf('week');
  date = date.add(dow, 'days');

  const hour = parseInt(time.substring(0, 2), 10);
  const min = parseInt(time.substring(2), 10);
  date = date.add(hour, 'hours');
  date = date.add(min, 'minutes');
  return date;
}

function setup(v) {
  if (v.is_setup) return;

  // id, name, avatar, description, typeName, slug, taxRate
  // address, address2, city, state, postalCode, country
  // visits, uniqueVisits, geoFenceRadius
  // isActive, isCommercial, isFranchise, servesAlcohol
  // happyHourPrices { category, price }
  // fluteStats {
  //   openTabs, totalTabs, visits,
  //   sentFlutes, receivedFlutes
  // }
  // phones { number }
  // emails { address }
  // images { url }
  // gps { lat, lon }
  // google {
  //   photos { url }
  //   openingHours {
  //     openNow, weekdayText
  //     periods {
  //       open { day, time }
  //       close { day, time }
  //     }
  //   }
  // }
  // yelp { rating, reviewCount }

  let thumb = v.avatar;
  if (isEmpty(thumb)) thumb = get(v, 'images.0.url');
  if (isEmpty(thumb)) thumb = get(v, 'google.photos.0.url');
  if (isEmpty(thumb)) thumb = Images.ic_dummy_thumb;

  const location = latlng(v.gps);
  const mobile = get(v, 'google.formattedPhoneNumber', '');
  const mobile2 = get(v, 'google.internationalPhoneNumber', '');
  const locurl = get(v, 'google.url', '');
  const website = get(v, 'google.website', '');
  const openHours = get(v, 'google.openingHours', {});
  const periods = get(openHours, 'periods', []);
  const prices = {};

  _.forEach(v.happyHourPrices || [], (p) => {
    prices[p.category] = p;
  });

  defineProperty(v, 'is_setup', () => true);
  defineProperty(v, 'location', () => location);
  defineProperty(v, 'thumb', () => thumb);
  defineProperty(v, 'mobile', () => mobile);
  defineProperty(v, 'mobile_international', () => mobile2);
  defineProperty(v, 'location_url', () => locurl);
  defineProperty(v, 'website', () => website);
  defineProperty(v, 'type', () => 'store type');
  defineProperty(v, 'prices', () => prices);

  // defineProperty(v, 'price', () => 1);
  defineProperty(v, 'address_state_postcode', () => {
    const addr = v;
    if (!isEmpty(addr.state) && !isEmpty(addr.postalCode)) return `${addr.state} ${addr.postalCode}`;
    if (!isEmpty(addr.state)) return addr.state;
    if (!isEmpty(addr.postalCode)) return addr.postalCode;
    return '';
  });

  defineProperty(v, 'address_city_state_postcode', () => {
    const addr = v;
    const state_zip = v.address_state_postcode;
    if (!isEmpty(addr.city) && !isEmpty(state_zip)) return `${addr.city}, ${state_zip}`;
    if (!isEmpty(addr.city)) return addr.city;
    if (!isEmpty(state_zip)) return state_zip;
    return '';
  });

  defineProperty(v, 'address_city_state', () => {
    const addr = v;
    if (!isEmpty(addr.city) && !isEmpty(addr.state)) return `${addr.city || ''}, ${addr.state || ''}`;
    if (!isEmpty(addr.city)) return addr.city;
    if (!isEmpty(addr.postalCode)) return addr.postalCode;
    return '';
  });

  defineProperty(v, 'address_full', () => {
    const addr = v;
    return `${addr.address}${addr.address_city_state_postcode ? ', ' + addr.address_city_state_postcode : ''}`;
  });

  defineProperty(v, 'today_opening_period', () => {
    if (!periods || !periods.length) return null;
    const mtoday = moment();
    let period = null;
    _.each(periods, (p) => {
      const mopen = getOpenDate(p.open.day, p.open.time);
      const mclose = getOpenDate(p.close.day, p.close.time);

      if (mtoday.isBetween(mopen, mclose)) {
        period = p;
        return false;
      } else if (mtoday < mopen) {
        period = p;
      }
      return true;
    });
    return period;
  });

  defineProperty(v, 'mopen_time', () => {
    const period = v.today_opening_period;
    if (!period) return null;
    if (!period.open) return null;
    return getOpenDate(period.open.day, period.open.time);
  });

  defineProperty(v, 'mclose_time', () => {
    const period = v.today_opening_period;
    if (!period) return null;
    if (!period.close) return null;

    return getOpenDate(period.close.day, period.close.time);
  });

  defineProperty(v, 'closed_at', () => {
    if (!periods || !periods.length) return null;

    const mclose = v.mclose_time;
    const mopen = v.mopen_time;
    if (!mclose || !mopen) return null;

    // const mnext = mopen.startOf('day').add(1, 'day');
    // if (mopen.isBetween(mclose.startOf('day'), mclose.endOf('day')) ||
    //     mnext.isBetween(mclose.startOf('day'), mclose.endOf('day'))) {
    //   return `Close at ${mclose.format('h:mm a')}`;
    // }
    return mclose.format('h:mm a');
  });

  defineProperty(v, 'open_at', () => {
    if (!periods || !periods.length) return null;

    const mclose = v.mclose_time;
    const mopen = v.mopen_time;
    if (!mclose || !mopen) return null;

    // const mnext = mopen.startOf('day').add(1, 'day');
    // if (mopen.isBetween(mclose.startOf('day'), mclose.endOf('day')) ||
    //     mnext.isBetween(mclose.startOf('day'), mclose.endOf('day'))) {
    //   return `Open from ${mopen.format('h a')} - ${mclose.format('h a')}`;
    // }
    return mopen.format('h:mm a');
  });

  defineProperty(v, 'photos', () => {
    // const photos = v.googlePlacesData.photos || [];
    const photos = v.images || [];
    const urls = _.map(photos, (p) => {
      if (p.photo_reference && p.photo_reference.indexOf('https://') >= 0) return p.photo_reference;
      return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1024&photoreference=${p.photo_reference}&key=${google.webkey}`; // eslint-disable-line
    });
    // if (!urls.length) urls.push(images.ic_dummy_thumb);

    return urls;
  });

  v.update = function() {
    const location = v.location;
    if (location && location.lat && location.lng && gs.location.device.location) {
      if(v.typeName === 'FLUTE') {
        v.away = 0;
        v.awayMile = 0;

      } else {
        const away = getDistance(g.location.latlng2(gs.location.device.location), g.location.latlng2(location));

        v.away = away;
        v.awayMile = Number(Math.round(convertDistance(away, 'mi') + 'e' + 2) + 'e-' + 2);
      }
    } else {
      v.away = 0;
      v.awayMile = 0;
    }
  };

  v.getPrice = function(type) {
    if (g.isNull(prices)) return 0;

    const cat = prices[type];
    if (g.isNull(cat)) return 0;

    return cat.drinkCost || cat.price || 0;
  };

  v.update();
}

export default function(items) {
  return setupItems(items, setup);
}
