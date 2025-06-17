import gql from 'graphql-tag';
import { siteFragment } from '../site/fragments';

export const notificationFragment = gql`{
  id
  title
  description
  sentence
  type
  toAll
  createdAt
  user { id }
  originalNotification { id }
  product { id name description isAddOn rating
    images { url }
  }
  order { id
    items { deliverBy
      product { id description rating name isAddOn
        images { url }
      }
    }
  }
  wallet { id description }
  event { id name description isLocked isCancelled
    creator { id firstName fullName avatar }
    orders { id tip tax total discount deliverBy isCancelledByCustomer isCancelledByOperator subtotal tipPercentage
      user { id }
      deliverTo ${siteFragment} 
      event { id }
      items { id
        product { id name description rating isAddOn
          images { id url }
        }
      }
    }
    carts { id
      user { id }
      items { id }
    }
    invitees { id fullName firstName lastName middleName avatar }
    days { id name startDate paymentSetting maxBudgetPer
      site { id name address address2 city state postalCode country
        gps { lon lat }
      }
    }
  }
  site${siteFragment}
  contentUser { id fullName firstName lastName avatar
    site { id name }
  }
  secondaryUser { id fullName firstName lastName avatar
    site { id name }
  }
  images { url }
  comment { id rating subject message
    images { id name url source }
  }
}`
