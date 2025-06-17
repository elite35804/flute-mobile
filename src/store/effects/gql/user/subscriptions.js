import { gql } from 'overmind-graphql';
import { userFragment } from './fragments';

/*
*
*/
export const userSubscription = gql`subscription userSubscription($userId: String!){
  userSubscription(userId: $userId){
    node${userFragment}
  }
}`;