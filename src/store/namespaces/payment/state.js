export const state = {
    payments: {},
    currentPaymentId: null,
    paymentPerPage: 10,
    totalRecords: 10,
    activePage: 1,
    paymentsList: state =>
      Object.values(state.payments)
        .sort((a, b) => {
          if (a.createdAt > b.createdAt) {
            return 1
          } else if (a.createdAt < b.createdAt) {
            return -1
          }

          return 0
        })
        .slice(0, state.paymentPerPage)
  }