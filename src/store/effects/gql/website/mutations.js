import gql from 'graphql-tag';
import { websiteFragment } from './fragments';

export const saveWebsite = gql`
  mutation saveWebsite($data: WebsiteUpdateInput!, $where: WebsiteWhereUniqueInput) {
    saveWebsite(data: $data, where: $where) ${websiteFragment}
  }
`;

export const deleteWebsite = gql`
  mutation deleteWebsite($where: WebsiteWhereUniqueInput) {
    deleteWebsite(where: $where) ${websiteFragment}
  }
`;
