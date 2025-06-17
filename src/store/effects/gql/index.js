import { graphql } from 'overmind-graphql';

import * as campaignMutations from './campaign/mutations'
import * as campaignQueries from './campaign/queries'
import * as campaignSubscriptions from './campaign/subscriptions'

import * as adMutations from './ad/mutations'
import * as adQueries from './ad/queries'
import * as adSubscriptions from './ad/subscriptions'

import * as commentMutations from './comment/mutations'
import * as commentQueries from './comment/queries'
import * as commentSubscriptions from './comment/subscriptions'

import * as cartMutations from './cart/mutations'
import * as cartQueries from './cart/queries'
import * as cartSubscriptions from './cart/subscriptions'

import * as productMutations from './product/mutations'
import * as productQueries from './product/queries'
import * as productSubscriptions from './product/subscriptions'

import * as orderMutations from './order/mutations'
import * as orderQueries from './order/queries'
import * as orderSubscriptions from './order/subscriptions'

import * as userMutations from './user/mutations'
import * as userQueries from './user/queries'
import * as userSubscriptions from './user/subscriptions'

import * as loginTokenMutations from './loginToken/mutations'
import * as loginTokenQueries from './loginToken/queries'
import * as loginTokenSubscriptions from './loginToken/subscriptions'

import * as paymentMethodMutations from './paymentMethod/mutations'
import * as paymentMethodQueries from './paymentMethod/queries'
import * as paymentMethodSubscriptions from './paymentMethod/subscriptions'

import * as siteMutations from './site/mutations'
import * as siteQueries from './site/queries'
import * as siteSubscriptions from './site/subscriptions'

import * as websiteMutations from './website/mutations'
import * as websiteQueries from './website/queries'
import * as websiteSubscriptions from './website/subscriptions'

import * as notificationMutations from './notification/mutations'
import * as notificationQueries from './notification/queries'
import * as notificationSubscriptions from './notification/subscriptions'

import * as eventMutations from './event/mutations'
import * as eventQueries from './event/queries'
import * as eventSubscriptions from './event/subscriptions'

import * as transactionMutations from './transaction/mutations'
import * as transactionQueries from './transaction/queries'
import * as transactionSubscriptions from './transaction/subscriptions'

import * as walletMutations from './wallet/mutations'
import * as walletQueries from './wallet/queries'
import * as walletSubscriptions from './wallet/subscriptions'

import * as paymentMutations from './payment/mutations'
import * as paymentQueries from './payment/queries'
import * as paymentSubscriptions from './payment/subscriptions'

import * as googleQueries from './google/queries'

import * as searchQueries from './search/queries'

import * as likeQueries from './like/queries';
import * as likeMutations from './like/mutations';

import * as driverQueries from './driver/queries';
import * as driverMutations from './driver/mutations';

import * as userSurveyQueries from './userSurvey/queries'
import * as userSurveyMutations from './userSurvey/mutations'
export default graphql({
  subscriptions: {
    // ...campaignSubscriptions,
    // ...campaignLocationSubscriptions,
    // ...adSubscriptions,
    // ...adImageSubscriptions,
    // ...audienceSubscriptions,
    // ...surveyQuestionSubscriptions,
    // ...surveyAnswerSubscriptions,
    // ...userSurveySubscriptions,
    // ...adImpressionSubscriptions,
    // ...adRedeemedSubscriptions,
    // ...articleCategorySubscriptions,
    // ...commentSubscriptions,
    // ...cartSubscriptions,
    // ...cartItemSubscriptions,
    // ...productSubscriptions,
    // ...pricingSubscriptions,
    // ...surveySubscriptions,
    // ...articleSubscriptions,
    // ...orderSubscriptions,
    // ...inventoryProductSubscriptions,
    // ...ingredientSubscriptions,
    // ...productionScheduleSubscriptions,
    // ...prepTimeSubscriptions,
    // ...batchSizeSubscriptions,
    // ...holdTimeSubscriptions,
    // ...productTaskSubscriptions,
    // ...tempTypeSubscriptions,
    // ...nutritionalFactSubscriptions,
    // ...foodDensitySubscriptions,
    // ...equipmentSubscriptions,
    // ...inventoryStockSubscriptions,
    // ...processDataSubscriptions,
    // ...inventoryVendorSubscriptions,
    ...userSubscriptions,
    // ...clientSubscriptions,
    // ...scheduleSubscriptions,
    // ...clockInSubscriptions,
    // ...scheduleBreakSubscriptions,
    // ...userSettingSubscriptions,
    // ...groupSubscriptions,
    // ...permissionSubscriptions,
    // ...permissionCollectionSubscriptions,
    // ...permissionAccessRuleSubscriptions,
    // ...serviceSubscriptions,
    // ...servicePasswordSubscriptions,
    // ...loginTokenSubscriptions,
    // ...emailSubscriptions,
    // ...phoneSubscriptions,
    // ...clientMapSubscriptions,
    // ...permissionAccessSubscriptions,
    // ...resumeTypeSubscriptions,
    // ...paymentMethodSubscriptions,
    // ...siteSubscriptions,
    // ...websiteSubscriptions,
    // ...geoLocSubscriptions,
    // ...mediaSubscriptions,
    // ...mediaCollectionSubscriptions,
    // ...mediaCollectionMemberSubscriptions,
    // ...systemNotificationSubscriptions,
    // ...notificationSubscriptions,
    // ...searchHistorySubscriptions,
    // ...companySubscriptions,
    // ...eventSubscriptions,
    // ...transactionSubscriptions,
    // ...walletSubscriptions,
    // ...paymentSubscriptions,
    // ...menuItemSubscriptions
  },
  queries: {
    ...campaignQueries,
    ...adQueries,
    ...commentQueries,
    ...cartQueries,
    ...orderQueries,
    ...userQueries,
    ...loginTokenQueries,
    ...paymentMethodQueries,
    ...siteQueries,
    ...websiteQueries,
    ...notificationQueries,
    ...eventQueries,
    ...transactionQueries,
    ...walletQueries,
    ...paymentQueries,
    ...googleQueries,
    ...searchQueries,
    ...likeQueries,
    ...driverQueries,
    ...userSurveyQueries,
  },
  mutations: {
    ...campaignMutations,
    ...adMutations,
    ...commentMutations,
    ...cartMutations,
    ...productMutations,
    ...orderMutations,
    ...userMutations,
    ...loginTokenMutations,
    ...paymentMethodMutations,
    ...siteMutations,
    ...websiteMutations,
    ...notificationMutations,
    ...eventMutations,
    ...transactionMutations,
    ...walletMutations,
    ...paymentMutations,
    ...likeMutations,
    ...driverMutations,
    ...userSurveyMutations
  }
})
