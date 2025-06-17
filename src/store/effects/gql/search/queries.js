import gql from 'graphql-tag';

/*
*
*/
export const searchIndex = gql`
  query searchIndex($keywords: String! $name: String!) {
    searchIndex(keywords:$keywords name:$name)
  }
`;

/*
*
*/
export const search = gql`
  query search($keywords: String! $userId: String) {
    search(keywords:$keywords userId:$userId)
  }
`;
