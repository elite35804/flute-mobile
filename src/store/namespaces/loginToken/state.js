export const state = {
    loginTokens: {},
    currentLoginTokenId: null,
    loginTokenPerPage: 10,
    totalRecords: 10,
    activePage: 1,
    loginTokensList: state =>
      Object.values(state.loginTokens)
        .sort((a, b) => {
          if (a.createdAt > b.createdAt) {
            return 1
          } else if (a.createdAt < b.createdAt) {
            return -1
          }

          return 0
        })
        .slice(0, state.loginTokenPerPage)
  }