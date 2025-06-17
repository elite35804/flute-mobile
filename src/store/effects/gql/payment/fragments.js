import gql from 'graphql-tag';

export const paymentFragment = gql`{
  id
  methodType
  vendor
  type
  cardType
  token
  last4
  nameOnAccount
  routingNumberLast
  isValid
  isDefault
  image
  expirationDate
  callbackUrl
  redirectUrl
  checkoutUrl
  createdAt
}`
