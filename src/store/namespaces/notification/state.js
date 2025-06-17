export const state = {
    notifications: {},
    isLoading: false,
    currentNotificationId: null,
    notificationPerPage: 50,
    totalRecords: 0,
    activePage: 1,
    isLast: false,
    notificationList: notificationNamespace =>
      Object.values(notificationNamespace.notifications)
        .sort((a, b) => {
          if (a.createdAt < b.createdAt) {
            return 1
          } else if (a.createdAt > b.createdAt) {
            return -1
          }

          return 0
        })
        // .slice(0, notificationNamespace.notificationPerPage)
  }
