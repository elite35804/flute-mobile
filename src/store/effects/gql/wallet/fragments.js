import gql from 'graphql-tag';

export const walletFragment = gql`{
  id
  sentTo { id firstName fullName avatar lastName }
  sentFrom { id firstName fullName avatar lastName }
  dueToReceiver
  createdAt
}`
