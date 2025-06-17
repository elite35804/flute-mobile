import gql from 'graphql-tag';
import { campaignFragment } from './fragments';

export const getDriverOrders = gql`
  query getDriverOrdersForDelivery(
    $driverId: String!
  ){
    getDriverOrdersForDelivery(
      driverId: $driverId
    )
  }
`;
