import gql from 'graphql-tag';
import { notificationFragment } from './fragments';

export const notifications = gql`
  query notifications($userId: String! $where: NotificationWhereInput, $orderBy: NotificationOrderByInput, $skip: Int, $after: String, $before: String, $first: Int, $last: Int) {
    notifications(userId: $userId where: $where, orderBy: $orderBy, skip: $skip, after: $after, before: $before, first: $first, last: $last) ${notificationFragment}
  }
`;

export const notification = gql`
  query notification($notificationId: String) {
    notification(notificationId: $notificationId) ${notificationFragment}
  }
`;