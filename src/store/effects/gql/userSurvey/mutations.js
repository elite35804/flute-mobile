import gql from 'graphql-tag';
import { userSurveyFragment } from './fragments';

/*
*
*/
export const saveUserSurvey = gql`
  mutation saveUserSurvey($data: UserSurveyUpdateInput!, $where: UserSurveyWhereUniqueInput) {
    saveUserSurvey(data: $data, where: $where) ${userSurveyFragment}
  }
`;

/*
*
*/
export const deleteUserSurvey = gql`
  mutation deleteUserSurvey($where: UserSurveyWhereUniqueInput) {
    deleteUserSurvey(where: $where) ${userSurveyFragment}
  }
`;
