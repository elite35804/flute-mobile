import { merge, namespaced } from 'overmind/config';
import { createHook } from 'overmind-react';

import { onInitialize } from './onInitialize'
import { state } from './state'
import * as effects from './effects';
import * as actions from './actions';

// common
import * as alert from '@/store/namespaces/alert';
import * as ad from '@/store/namespaces/ad';
import * as hud from '@/store/namespaces/hud';
import * as dateSlider from '@/store/namespaces/dateSlider';
import * as pushNotification from '@/store/namespaces/pushNotification';
import * as search from '@/store/namespaces/search';
import * as window from '@/store/namespaces/window';

// custom
import * as comment from './namespaces/comment'
import * as cart from './namespaces/cart'
import * as google from './namespaces/google'
import * as product from './namespaces/product'
import * as order from './namespaces/order'
import * as driver from './namespaces/driver'
import * as user from './namespaces/user'
import * as paymentMethod from './namespaces/paymentMethod';
import * as site from './namespaces/site'
import * as likes from './namespaces/like'
import * as notification from './namespaces/notification'
import * as event from './namespaces/event'
import * as transaction from './namespaces/transaction'
import * as wallet from './namespaces/wallet'
import * as payments from './namespaces/payment'
import * as location from './namespaces/location'
import * as userSurvey from './namespaces/userSurvey'

export const config = merge(
  {
    onInitialize,
    state,
    effects,
    actions
  },
  namespaced({
    alert,
    hud,
    pushNotification,
    window,
    google,
    search,
    dateSlider,
    comment,
    cart,
    product,
    order,
    driver,
    user,
    paymentMethod,
    site,
    likes,
    notification,
    event,
    transaction,
    wallet,
    payments,
    location,
    ad,
    userSurvey
  })
)

export const useOvermind = createHook();
