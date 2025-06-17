export const state = {
  ads: {},
  currentAdId: null,
  adPerPage: 10,
  totalRecords: 10,
  activePage: 1,
  fluteAd: null,
  adByLocation: [],
  showAds: [],
  illegalState: null,
  adsList: state =>
    Object.values(state.ads)
      .sort((a, b) => {
        if (a.createdAt > b.createdAt) {
          return 1
        } else if (a.createdAt < b.createdAt) {
          return -1
        }

        return 0
      })
      .slice(0, state.adPerPage)
}
