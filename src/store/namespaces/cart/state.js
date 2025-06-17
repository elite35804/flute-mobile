export const state = {
    carts: {},
    isLoading: false,
    currentCartId: null,
    cartPerPage: 10,
    totalRecords: 10,
    activePage: 1,
    cartList: cartNamespace =>
      Object.values(cartNamespace.carts)
        .sort((a, b) => {
          if (a.createdAt > b.createdAt) {
            return 1
          } else if (a.createdAt < b.createdAt) {
            return -1
          }

          return 0
        })
        .slice(0, cartNamespace.cartPerPage)
  }