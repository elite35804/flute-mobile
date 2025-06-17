/*
*
*/
export const searchGooglePlaces = async ({ state, effects }, data) => {
  try {
    const results = await effects.gql.queries.searchGooglePlaces(data);
    state.google.placeResults = results.searchGooglePlaces;
    return results;
  } catch(e) {
    console.log(e, 'searchGooglePlaces error');
    // actions.alert.showError(error.message, 'Location')
  }
}
