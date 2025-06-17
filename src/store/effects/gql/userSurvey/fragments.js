import gql from "graphql-tag";

export const userSurveyFragment = gql`
  {
    id
    user {
      id
    }
    survey {
      id
    }
    answers {
      id
      answer
      question {
        id
      }
    }
  }
`;
