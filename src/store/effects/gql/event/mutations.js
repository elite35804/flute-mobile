import gql from 'graphql-tag';
import { eventFragment } from './fragments';

export const createEventNotifyAttendees = gql`
  mutation createEventNotifyAttendees( $data: EventCreateInput! $users: [String!]! $googlePlacesId: String $gps:GeoLocCreateInput) {
    createEventNotifyAttendees(data:$data users:$users googlePlacesId:$googlePlacesId gps:$gps) ${eventFragment}
  }
`;

export const saveEvent = gql`
  mutation saveEvent($data: EventUpdateInput!, $where: EventWhereUniqueInput) {
    saveEvent(data: $data, where: $where) ${eventFragment}
  }
`;

export const deleteEvent = gql`
  mutation deleteEvent($where: EventWhereUniqueInput) {
    deleteEvent(where: $where) ${eventFragment}
  }
`;


export const addInviteesToEvent = gql`
    mutation addInviteesToEvent(
      $users: [String!]!
      $eventId: String!
    ) {
      addInviteesToEvent(
        users: $users
        eventId: $eventId
      )${eventFragment}
    }
  `;

export const cancelEvent = gql `
    mutation cancelEvent(
      $eventId: String!
      $userId: String!
    ){
      cancelEvent(
        eventId: $eventId
        userId: $userId
      )
    }
  `;
