export const state = {
    paymentMethods: {},
    isLoading: true,
    currentPaymentMethodId: null,
    paymentMethodPerPage: 10,
    totalRecords: 10,
    activePage: 1,
    paymentMethodsList: paymentMethodNamespace =>
      Object.values(paymentMethodNamespace.paymentMethods)
        .sort((a, b) => {
          if (a.createdAt > b.createdAt) {
            return 1
          } else if (a.createdAt < b.createdAt) {
            return -1
          }

          return 0
        })
        .slice(0, paymentMethodNamespace.paymentMethodPerPage)
  }