import gql from 'graphql-tag';

export const PaymentMethod = `
{
    id
    type
    cardType
    vendors { name token }
    last4
    isValid
    isDefault
    image
    expirationDate
    createdAt
}
`;
/*
*
*/
export const userFragment = gql`{
    id, needToUpgrade playerId, email, username, chatId
    fullName, firstName, lastName
    gender, avatar, dateOfBirth
    unreadMessages, balance
    braintreeCustomerId
    phones { number }
    paymentMethods { id type expirationDate cardType last4 isValid isDefault createdAt methodType isValid image
      vendors { name token callbackUrl redirectUrl isValid checkoutUrl cardId }
    }
    site { id name address address2 city state postalCode country phones{id number} googlePlacesId gps{lat lon} }
    sites { id name address address2 city state postalCode country phones{id number} googlePlacesId gps{lat lon}}
    settings {
      allowGifts, allowPushNotification, soundAlertNotification,
      defaultTip, drinkOfChoice, additionalDrinksOfChoice, disableToolTips
    }
    pendingSurveys { id questions { id question sortOrder } status }
    pendingGifts { id }
    acceptedGifts { id}
    pendingGifts { id }
    acceptedGifts { id}
    pendingSplits { id }
    acceptedSplits { id }
    failedPayments { id transactionId amount comment response tab { id } wallet { id } retry }
    lastWithdrawalDate
    showAds {
      id accepted
      ad { id images { iPhone } name recipeUrl title buttonColor textColor }
      campaign { id isDelivery isSupplier endDate discountType discountAmount maxItemsPer site { id }
        products{
          id name description slug isAddOn isTaxable isFree onSale rating isHidden isActive isAlcohol
          site { id }
          pricing { id type weekday startTime stopTime retailPrice salePrice wholesalePrice }
          suppliers { id name }
        } 
      }
    }
    openedTab {
      id
      posTabName
      user {
        id, firstName, lastName, avatar
      }
      isOpen
      site {
        id, name, avatar taxRate
        address, address2, city, state, postalCode, country
        phones { number }
      }
      openedWithDrinkType
      items {
        title, quantity, pricePerUnit, posPrice, itemCost, retailPrice
        wholesalePrice, itemReceived, isPromo, isSupplier
        rebateAmount, promoCost
        modifiers {
         posItemId title quantity pricePerUnit description posPrice itemCost
         retailPrice wholesalePrice itemReceived isPromo isSupplier
         rebateAmount promoCost
       }
      }
      flaskAmount, fluteAmount, tipRate
      walletDiscount, serviceCharge, subtotal, tip, tax, total, totalBeforeWallet totalAfterRebate
      retailSubtotal, retailTip, retailTax, retailTotal instantRebate promoCredit posServiceCharge, posDiscount discount
      isSettled
      splitWith {
        id
        user { id, firstName, lastName, avatar }
        payments { amount comment }
        acceptedSplit splitAmount isSettled
      }
      isSplitReconciled, createdAt
    }
}`;

/*
*
*/
export const AuthPayLoad = gql`
{
  user${userFragment}
  verificationCode
}
`;


