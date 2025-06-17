/*
*
*/
export const searchIndex = async ({ state, effects }, { keywords, name }) => {
  const { searchIndex } = await effects.gql.queries.searchIndex({ keywords, name });
  state.search.searchResults = searchIndex;
}

/*
*
*/
export const search = async ({ state, effects }, { keywords, userId }) => {
  const { search } = await effects.gql.queries.search({ keywords, userId });
  state.search.muliSearchResults = search;
  return search;
}
