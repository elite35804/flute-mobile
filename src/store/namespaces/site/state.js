export const state = {
    sites: {},
    isLoading: false,
    currentSiteId: null,
    sitePerPage: 10,
    totalRecords: 10,
    activePage: 1,
    siteList: siteNamespace =>
      Object.values(siteNamespace.sites)
        .sort((a, b) => {
          if (a.createdAt > b.createdAt) {
            return 1
          } else if (a.createdAt < b.createdAt) {
            return -1
          }
          return 0
        })
        .slice(0, siteNamespace.sitePerPage)
  }