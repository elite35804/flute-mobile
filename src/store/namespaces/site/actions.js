import { keyBy, isEmpty } from 'lodash';

/*
*
*/
export const getTotalSites = async ({ state, effects }) => {
  const { sites } = await effects.gql.queries.sites()
  state.site.totalRecords = sites ? sites.length : 0
}

/*
*
*/
export const getSites = async ({ state, effects }, data) => {
  console.log(data, 'data getSites');
  let options = {};

  if(isEmpty(data)) {
    options = {
      first: state.site.sitePerPage,
      skip: (state.site.activePage - 1) * state.site.sitePerPage
    }
  } else {
    options = data;
    if(!data.first) options.first = state.site.sitePerPage;
    if(!data.skip) options.skip = (state.site.activePage - 1) * state.site.sitePerPage;
  }

  console.log(options, 'options getSites');
  
  const { sites } = await effects.gql.queries.sites(options)
  state.site.sites = keyBy(sites, 'id');
}

/*
*
*/
export const saveSite = async ({ effects }, data) => {
  return await effects.gql.mutations.saveSite(data)
}

/*
*
*/
export const onChangePage = async ({ state }, page) => {
  state.site.activePage = page
}

/*
*
*/
export const onSiteAdded = ({ state }, data) => {
  state.site.push(data)
}
