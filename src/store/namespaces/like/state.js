export const state = {
    likes: {},
    currentLikeId: null,
    likePerPage: 10,
    totalRecords: 10,
    activePage: 1,
    likesList: state =>
      Object.values(state.likes)
        .sort((a, b) => {
          if (a.createdAt > b.createdAt) {
            return 1
          } else if (a.createdAt < b.createdAt) {
            return -1
          }

          return 0
        })
        .slice(0, state.likePerPage)
  }