import gql from 'graphql-tag';
import {orderFragment} from './fragments';

export const saveOrder = gql`
  mutation saveOrder($data: OrderUpdateInput!, $where: OrderWhereUniqueInput) {
    saveOrder(data: $data, where: $where) ${orderFragment}
  }
`;

export const deleteOrder = gql`
  mutation deleteOrder($where: OrderWhereUniqueInput) {
    deleteOrder(where: $where) ${orderFragment}
  }
`;

export const createOrder = gql`
  mutation createOrder(
        $cartId:String!
        $eventId: String
        $paymentMethodId: String
        $useWallet: Boolean
        $tipAmount: Float
        $tipType: String
        $notes: String
        $sendUtensils: Boolean
        $ipAddress: String
        $referringSite: String
        $companyId: String
        $processPayment: Boolean
        $removeProductSubscriptions: [String]
        $sessionId: String
    ){
      createOrder(
          cartId: $cartId
          eventId: $eventId
          paymentMethodId: $paymentMethodId
          useWallet: $useWallet
          tipAmount: $tipAmount
          tipType: $tipType
          notes: $notes
          sendUtensils: $sendUtensils
          ipAddress: $ipAddress
          referringSite: $referringSite
          companyId: $companyId
          processPayment: $processPayment
          removeProductSubscriptions: $removeProductSubscriptions
          sessionId: $sessionId
      ){
        id
      }
    }
  `;

export const updateOrder = gql`
  mutation updateOrder(
      $data: OrderUpdateInput!
      $where: OrderWhereUniqueInput!
      $tipAmount: Float!
      $tipType: String!
  ){
      updateOrder(
          data: $data
          where: $where
          tipAmount: $tipAmount
          tipType: $tipType
      )${orderFragment}
  }
`;

export const cancelOrder = gql`
  mutation cancelOrder(
    $orderId: String!
    $userId: String!
    $eventId: String
  ){
    cancelOrder(
      orderId: $orderId
      userId: $userId
      eventId: $eventId
    )
  }
`;

export const emailReceipt = gql`
mutation emailReceipt($orderId: String!){
  emailReceipt(orderId:$orderId)
}
`;

export const createSurveyAnswer = gql`
mutation createSurveyAnswer($questionId: String! $answer: Int! $userId: String! $surveyId: String!) {
  createSurveyAnswer(questionId: $questionId answer: $answer userId: $userId surveyId: $surveyId){
    id answer question{id} metadata score createdAt
  }
}
`
