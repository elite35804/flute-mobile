export const state = {
  orders: {},
  isLoading: false,
  currentOrderId: null,
  orderPerPage: 50,
  totalRecords: 0,
  activePage: 1,
  formattedOrders: [],
  orderList: orderNamespace =>
    Object.values(orderNamespace.orders)
      .sort((a, b) => {
        if (a.createdAt > b.createdAt) {
          return 1
        } else if (a.createdAt < b.createdAt) {
          return -1
        }

        return 0
      })
      .slice(0, orderNamespace.orderPerPage)
}
