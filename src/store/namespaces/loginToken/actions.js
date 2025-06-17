import { _ } from 'lodash'

  export const getTotalLoginTokens = async ({ state, effects }) => {
    const { loginTokens } = await effects.gql.queries.loginTokens()

    state.loginTokens.totalRecords = loginTokens ? loginTokens.length : 0
  }

  export const getLoginTokens = async ({ state, effects }, data) => {
    let options = {}
    if (data && data.options) options = data.options
    else if (data && data.all) options = {}
    else {
      options = {
        first: state.loginTokens.loginTokenPerPage,
        skip: (state.loginTokens.activePage - 1) * state.loginTokens.loginTokenPerPage
      }
    }
    //
    const { loginTokens } = await effects.gql.queries.loginTokens(options)
    if (data && data.getValues) return loginTokens
    else state.loginTokens.loginTokens = _.keyBy(loginTokens, 'id')
  }

  export const saveLoginToken = async ({ effects }, data) => {
    return await effects.gql.mutations.saveLoginToken(data)
  }

  export const onChangePage = async ({ state }, page) => {
    state.loginTokens.activePage = page
  }

  export const onLoginTokenAdded = ({ state }, data) => {
    state.loginTokens.push(data)
  }
  