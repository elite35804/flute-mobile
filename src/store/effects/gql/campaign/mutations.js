import gql from 'graphql-tag';
import { campaignFragment } from './fragments';

export const saveCampaign = gql`
  mutation saveCampaign($data: CampaignUpdateInput!, $where: CampaignWhereUniqueInput) {
    saveCampaign(data: $data, where: $where) ${campaignFragment}
  }
`;

export const deleteCampaign = gql`
  mutation deleteCampaign($where: CampaignWhereUniqueInput) {
    deleteCampaign(where: $where) ${campaignFragment}
  }
`;
