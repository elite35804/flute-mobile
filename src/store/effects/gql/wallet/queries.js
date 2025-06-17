import gql from 'graphql-tag';
import { walletFragment } from './fragments';

/*
*
*/
export const wallets = gql`
  query getWalletTransactions($userId: String!) {
    getWalletTransactions(userId: $userId) ${walletFragment}
  }
`;

/*
*
*/
export const getWalletBalance = gql`
  query getWalletBalance($userId: String! $date: DateTime) {
    getWalletBalance(userId:$userId date:$date)
  }
`;
