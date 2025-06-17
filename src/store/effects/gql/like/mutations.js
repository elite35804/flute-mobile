import gql from 'graphql-tag';
import { likeFragment } from './fragments';

export const like = gql`
  mutation like($userId: String!
		$likeId: String
		$siteId: String
		$productId: String
		$commentId: String
		$notificationId: String
		$articleId: String
		$eventId: String
		$eventDayId: String
		$donation: Float) {
      like(userId: $userId, likeId: $likeId siteId:$siteId productId:$productId commentId:$commentId notificationId:$notificationId articleId:$articleId eventId:$eventId eventDayId:$eventDayId donation:$donation)
  }
`;

export const saveLike = gql`
  mutation saveLike($data: LikeUpdateInput!, $where: LikeWhereUniqueInput) {
    saveLike(data: $data, where: $where) ${likeFragment}
  }
`;

export const deleteLike = gql`
  mutation deleteLike($where: LikeWhereUniqueInput) {
    deleteLike(where: $where) ${likeFragment}
  }
`;
