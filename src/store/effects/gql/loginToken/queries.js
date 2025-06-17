import gql from 'graphql-tag';
import { loginTokenFragment } from './fragments';

export const loginTokens = gql`
  query loginTokens($where: LoginTokenWhereInput, $orderBy: LoginTokenOrderByInput, $skip: Int, $after: String, $before: String, $first: Int, $last: Int) {
    loginTokens(where: $where, orderBy: $orderBy, skip: $skip, after: $after, before: $before, first: $first, last: $last) ${loginTokenFragment}
  }
`;
