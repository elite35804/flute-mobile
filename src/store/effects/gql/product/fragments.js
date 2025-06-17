import gql from 'graphql-tag';

export const productFragment = gql`{
  id
  name
  description
  isActive
  pricing { id type retailPrice }
  images { id url source }
  rating
  tasks {
    id
    sortOrder
    name
    description
    ingredient{id name nameLower isHot}
    type
    size
    unit
  }
}`
