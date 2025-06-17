import gql from "graphql-tag";
import { userSurveyFragment } from "./fragments";

/*
 *
 */
export const userSurveys = gql`
  query userSurveys($where: UserSurveyWhereInput, $orderBy: UserSurveyOrderByInput, $skip: Int, $after: String, $before: String, $first: Int, $last: Int) {
    userSurveys(where: $where, orderBy: $orderBy, skip: $skip, after: $after, before: $before, first: $first, last: $last) ${userSurveyFragment}
  }
`;

export const userSurveysForTotal = gql`
  query userSurveys(
    $where: UserSurveyWhereInput
    $orderBy: UserSurveyOrderByInput
    $skip: Int
    $after: String
    $before: String
    $first: Int
    $last: Int
  ) {
    userSurveys(
      where: $where
      orderBy: $orderBy
      skip: $skip
      after: $after
      before: $before
      first: $first
      last: $last
    ) {
      id
      profile {
        id
      }
    }
  }
`;
