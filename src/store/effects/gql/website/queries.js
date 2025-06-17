import gql from 'graphql-tag';
import { websiteFragment } from './fragments';

export const websites = gql`
  query websites($where: WebsiteWhereInput, $orderBy: WebsiteOrderByInput, $skip: Int, $after: String, $before: String, $first: Int, $last: Int) {
    websites(where: $where, orderBy: $orderBy, skip: $skip, after: $after, before: $before, first: $first, last: $last) ${websiteFragment}
  }
`;
