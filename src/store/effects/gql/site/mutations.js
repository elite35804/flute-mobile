import gql from 'graphql-tag';
import { siteFragment } from './fragments';

export const saveSite = gql`
  mutation saveSite($data: SiteUpdateInput!, $where: SiteWhereUniqueInput) {
    saveSite(data: $data, where: $where) ${siteFragment}
  }
`;

export const deleteSite = gql`
  mutation deleteSite($where: SiteWhereUniqueInput) {
    deleteSite(where: $where) ${siteFragment}
  }
`;
