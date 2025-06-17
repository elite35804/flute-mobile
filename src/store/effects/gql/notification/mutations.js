import gql from 'graphql-tag';
import { notificationFragment } from './fragments';
import { userFragment } from '../user/fragments';

export const saveNotification = gql`
  mutation saveNotification($data: NotificationUpdateInput!, $where: NotificationWhereUniqueInput) {
    saveNotification(data: $data, where: $where) ${notificationFragment}
  }
`;

export const deleteNotification = gql`
  mutation deleteNotification($where: NotificationWhereUniqueInput) {
    deleteNotification(where: $where) ${notificationFragment}
  }
`;

export const markNotificationRead = gql`
  mutation markNotificationRead($message: NotificationWhereUniqueInput! $userId: String!) {
    markNotificationRead(message:$message userId:$userId) ${userFragment}
  }
`;
