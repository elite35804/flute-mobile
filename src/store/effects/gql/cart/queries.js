import gql from 'graphql-tag';
import { cartFragment } from './fragments';

/*
*
*/
export const carts = gql`
  query carts($where: CartWhereInput, $orderBy: CartOrderByInput, $skip: Int, $after: String, $before: String, $first: Int, $last: Int) {
    carts(where: $where, orderBy: $orderBy, skip: $skip, after: $after, before: $before, first: $first, last: $last) ${cartFragment}
  }
`;

/*
*
*/
export const soldOutDays = gql`
  query soldOutDays {
    soldOutDays
  }
`;
