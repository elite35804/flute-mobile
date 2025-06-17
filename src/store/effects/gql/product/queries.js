import gql from 'graphql-tag';
import { productFragment } from './fragments';

export const products = gql`
  query products($where: ProductWhereInput, $orderBy: ProductOrderByInput, $skip: Int, $after: String, $before: String, $first: Int, $last: Int) {
    products(where: $where, orderBy: $orderBy, skip: $skip, after: $after, before: $before, first: $first, last: $last) ${productFragment}
  }
`;

export const getAddOns = gql`
  query getAddOns {
    getAddOns ${productFragment}
  }
`;
