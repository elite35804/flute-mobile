import gql from 'graphql-tag';
import { likeFragment } from './fragments';

export const likes = gql`
  query likes($where: LikeWhereInput, $orderBy: LikeOrderByInput, $skip: Int, $after: String, $before: String, $first: Int, $last: Int) {
    likes(where: $where, orderBy: $orderBy, skip: $skip, after: $after, before: $before, first: $first, last: $last) ${likeFragment}
  }
`;
