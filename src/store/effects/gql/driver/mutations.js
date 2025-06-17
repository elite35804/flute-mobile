import gql from 'graphql-tag';
import {orderFragment} from "@/store/effects/gql/order/fragments";

export const assignOrderToDriver = gql`
  mutation assignOrderToDriver($orderId: String!, $driverId: String!) {
    assignOrderToDriver(orderId: $orderId, driverId: $driverId) ${orderFragment}
  }
`;
