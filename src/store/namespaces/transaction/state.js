export const state = {
    transactions: {},
    isLoading: false,
    currentTransactionId: null,
    transactionPerPage: 10,
    totalRecords: 10,
    activePage: 1,
    transactionList: transactionNamespace =>
      Object.values(transactionNamespace.transactions)
        .sort((a, b) => {
          if (a.createdAt > b.createdAt) {
            return 1
          } else if (a.createdAt < b.createdAt) {
            return -1
          }

          return 0
        })
        .slice(0, transactionNamespace.transactionPerPage)
  }