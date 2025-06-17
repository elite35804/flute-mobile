import gql from 'graphql-tag';

export const requestSupport = gql`
  mutation requestSupport(
    $userId: String
    $subject: String!
    $message: String!
    $email: String
    $phone: String
    $reason: String
    $companies: [String!]
  ) {
    requestSupport(
      userId: $userId
      subject: $subject
      message: $message
      email: $email
      phone: $phone
      reason: $reason
      companies: $companies
    )
  }
`
