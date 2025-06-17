import gql from 'graphql-tag';

export const searchGooglePlaces = gql`
  query searchGooglePlaces($keyword: String! $types: [String] $componentRestrictions: Json, $location: GeoLocInput) {
    searchGooglePlaces(keyword: $keyword types: $types componentRestrictions: $componentRestrictions location: $location)
  }
`;