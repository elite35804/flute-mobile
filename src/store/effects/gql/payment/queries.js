import gql from 'graphql-tag';
import { paymentFragment } from './fragments';

export const payments = gql`
  query payments($where: PaymentWhereInput, $orderBy: PaymentOrderByInput, $skip: Int, $after: String, $before: String, $first: Int, $last: Int) {
    payments(where: $where, orderBy: $orderBy, skip: $skip, after: $after, before: $before, first: $first, last: $last) ${paymentFragment}
  }
`;
