import gql from 'graphql-tag';
import { transactionFragment } from './fragments';

export const transactions = gql`
  query transactions($where: TransactionWhereInput, $orderBy: TransactionOrderByInput, $skip: Int, $after: String, $before: String, $first: Int, $last: Int) {
    transactions(where: $where, orderBy: $orderBy, skip: $skip, after: $after, before: $before, first: $first, last: $last) ${transactionFragment}
  }
`;
