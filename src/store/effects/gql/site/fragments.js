import gql from 'graphql-tag';

export const siteFragment = gql`{
  id
  name
  address2
  address
  city
  state
  country
  rating
  tags{id type name}
  postalCode
  avatar
  gps{
    lat
    lon
  }
  images {
      name
      url
    }
  groups {
      id
      name
  }
  likes{
    id
   
  }
  products {
    id
    name
    description
    isAddOn
    isFree
    rating
    isAlcohol
    pricing {
      id
      retailPrice
      type
    }
  }
}`
