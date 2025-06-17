export const state = {
    products: {},
    isLoading: false,
    currentProductId: null,
    productPerPage: 10,
    totalRecords: 10,
    activePage: 1,
    addOns: [],
    productList: productNamespace =>
      Object.values(productNamespace.products)
        .sort((a, b) => {
          if (a.createdAt > b.createdAt) {
            return 1
          } else if (a.createdAt < b.createdAt) {
            return -1
          }

          return 0
        })
        .slice(0, productNamespace.productPerPage)
  }