import gql from 'graphql-tag';
import { campaignFragment } from './fragments';

export const campaigns = gql`
  query campaigns($where: CampaignWhereInput, $orderBy: CampaignOrderByInput, $skip: Int, $after: String, $before: String, $first: Int, $last: Int) {
    campaigns(where: $where, orderBy: $orderBy, skip: $skip, after: $after, before: $before, first: $first, last: $last) ${campaignFragment}
  }
`;
