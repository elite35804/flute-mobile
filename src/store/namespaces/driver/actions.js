
/*
*
*/
export const getDriverOrders = async ({ state, effects, actions }) => {
  try {
    const {getDriverOrdersForDelivery} = await effects.gql.queries.getDriverOrders({driverId: state.currentUser.id});
    state.driver.driver = getDriverOrdersForDelivery;
  } catch (e) {
    console.log(e, 'Error')
  }
};
