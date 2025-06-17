import gql from 'graphql-tag';
import { paymentFragment } from './fragments';

export const savePayment = gql`
  mutation savePayment($data: PaymentUpdateInput!, $where: PaymentWhereUniqueInput) {
    savePayment(data: $data, where: $where) ${paymentFragment}
  }
`;

export const deletePayment = gql`
  mutation deletePayment($where: PaymentWhereUniqueInput) {
    deletePayment(where: $where) ${paymentFragment}
  }
`;

export const sendPoints = gql`
  mutation sendPoints($fromUserId: String! $toUsers: [String!]! $numberOfPoints: Int! $comment: String) {
    sendPoints(fromUserId:$fromUserId toUsers:$toUsers numberOfPoints:$numberOfPoints comment:$comment)
  }
`;

export const withdrawRebate = gql`
  mutation withdrawRebate($userId: String! $amount: Float! $token: String! $type: String! $cardId: String! $fee: Float! $rebateMethodId: String){
    withdrawRebate(userId: $userId amount: $amount token: $token type: $type cardId: $cardId fee: $fee rebateMethodId: $rebateMethodId)
  }
`

export const createStripeRebateAccount = gql`
  mutation createStripeRebateAccount($userId: String! $card: Json $ipAddress: String) {
    createStripeRebateAccount(userId: $userId card: $card ipAddress: $ipAddress)
  }
`
