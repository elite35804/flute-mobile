import gql from 'graphql-tag';
import { loginTokenFragment } from './fragments';

export const saveLoginToken = gql`
  mutation saveLoginToken($data: LoginTokenUpdateInput!, $where: LoginTokenWhereUniqueInput) {
    saveLoginToken(data: $data, where: $where) ${loginTokenFragment}
  }
`;

export const deleteLoginToken = gql`
  mutation deleteLoginToken($where: LoginTokenWhereUniqueInput) {
    deleteLoginToken(where: $where) ${loginTokenFragment}
  }
`;
