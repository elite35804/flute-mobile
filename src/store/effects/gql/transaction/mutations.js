import gql from 'graphql-tag';
import { transactionFragment } from './fragments';

export const saveTransaction = gql`
  mutation saveTransaction($data: TransactionUpdateInput!, $where: TransactionWhereUniqueInput) {
    saveTransaction(data: $data, where: $where) ${transactionFragment}
  }
`;

export const deleteTransaction = gql`
  mutation deleteTransaction($where: TransactionWhereUniqueInput) {
    deleteTransaction(where: $where) ${transactionFragment}
  }
`;
