import gql from 'graphql-tag';
import { cartFragment } from './fragments';

export const saveCart = gql`
  mutation saveCart(
    $userId: String!
    $cartId: String
    $eventId: String
    $orderId: String
    $deleteCart: Boolean
    $addItems: [CartItemInput!]
    $updateItems: [CartItemInput!]
    $removeItems: [CartItemInput!]
    $tipAmount: Float
    $metadata: Json
    $findMarketplace: Boolean
    $tipType: String) {
      
    saveCart(userId:$userId cartId:$cartId eventId:$eventId orderId: $orderId deleteCart:$deleteCart addItems:$addItems updateItems:$updateItems
      removeItems:$removeItems tipAmount:$tipAmount tipType:$tipType  metadata:$metadata findMarketplace: $findMarketplace
    ) ${cartFragment}
  }
`;

export const deleteCart = gql`
  mutation deleteCart($where: CartWhereUniqueInput) {
    deleteCart(where: $where) ${cartFragment}
  }
`;
