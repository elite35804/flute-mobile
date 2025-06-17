import gql from 'graphql-tag';
import { paymentMethodFragment } from './fragments';

export const paymentMethods = gql`
  query paymentMethods($where: PaymentMethodWhereInput, $orderBy: PaymentMethodOrderByInput, $skip: Int, $after: String, $before: String, $first: Int, $last: Int) {
    paymentMethods(where: $where, orderBy: $orderBy, skip: $skip, after: $after, before: $before, first: $first, last: $last) ${paymentMethodFragment}
  }
`;
