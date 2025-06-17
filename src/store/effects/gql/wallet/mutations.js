import gql from 'graphql-tag';
import { walletFragment } from './fragments';

export const saveWallet = gql`
  mutation saveWallet($data: WalletUpdateInput!, $where: WalletWhereUniqueInput) {
    saveWallet(data: $data, where: $where) ${walletFragment}
  }
`;

export const deleteWallet = gql`
  mutation deleteWallet($where: WalletWhereUniqueInput) {
    deleteWallet(where: $where) ${walletFragment}
  }
`;
