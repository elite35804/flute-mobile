import gql from 'graphql-tag';
import { siteFragment } from './fragments';

export const sites = gql`
  query sites($where: SiteWhereInput, $orderBy: SiteOrderByInput, $skip: Int, $after: String, $before: String, $first: Int, $last: Int) {
    sites(where: $where, orderBy: $orderBy, skip: $skip, after: $after, before: $before, first: $first, last: $last) ${siteFragment}
  }
`;
