import gql from 'graphql-tag';
import { productFragment } from './fragments';

export const saveProduct = gql`
  mutation saveProduct($data: ProductUpdateInput!, $where: ProductWhereUniqueInput) {
    saveProduct(data: $data, where: $where) ${productFragment}
  }
`;

export const deleteProduct = gql`
  mutation deleteProduct($where: ProductWhereUniqueInput) {
    deleteProduct(where: $where) ${productFragment}
  }
`;
