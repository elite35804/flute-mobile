import gql from 'graphql-tag';
import { orderFragment } from './fragments';

export const orders = gql`
  query orders($where: OrderWhereInput, $orderBy: OrderOrderByInput, $skip: Int, $after: String, $before: String, $first: Int, $last: Int) {
    orders(where: $where, orderBy: $orderBy, skip: $skip, after: $after, before: $before, first: $first, last: $last) ${orderFragment}
  }
`;