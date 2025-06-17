import gql from 'graphql-tag';
import { adFragment } from './fragments';

export const ads = gql`
  query ads($where: AdWhereInput, $orderBy: AdOrderByInput, $skip: Int, $after: String, $before: String, $first: Int, $last: Int) {
    ads(where: $where, orderBy: $orderBy, skip: $skip, after: $after, before: $before, first: $first, last: $last) ${adFragment}
  }
`;

export const adRedeemeds = gql`
  query adRedeemeds ($where: AdRedeemedWhereInput) {
    adRedeemeds(where: $where) {
      id universalData
    }
  }
`
