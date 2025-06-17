import { keyBy, isEmpty } from 'lodash';
import moment from 'moment';

/*
*
*/
export const getTotalOrders = async ({ state, effects }) => {
  const { orders } = await effects.gql.queries.orders()

  state.order.totalRecords = orders ? orders.length : 0
}

/*
*
*/
export const getOrders = async ({ state, effects }, data) => {
  console.log('action getOrders...');

  try {
    let options = {};

    if (isEmpty(data)) {
      options = {
        first: state.order.orderPerPage,
        skip: (state.order.activePage - 1) * state.order.orderPerPage
      }
    } else {
      options = data;
      if (!data.first) options.first = state.order.orderPerPage;
      if (!data.skip) options.skip = (state.order.activePage - 1) * state.order.orderPerPage;
    }

    console.log(options, 'getOrders options');

    const { orders } = await effects.gql.queries.orders(options);

    console.log(orders, 'getOrders results');

    state.order.orders = keyBy(orders, 'id');

    // format orders
    state.order.formattedOrders = orders
      .filter(o => {
        return o.items && o.items.length > 0
      })
      .map(order => {
        const deliverBy = moment(order.deliverBy || new Date()).format("ddd • MMM D, YYYY")

        if (order.isDelivered || (!order.isCancelledByCustomer && !order.isCancelledByOperator && moment(order.deliverBy) < moment())) {
          return ({ title: "COMPLETED", deliverBy, data: order.items, raw: order, eventId: order.event?.id })

        } else if (order.isCancelledByCustomer || order.isCancelledByOperator) {
          return ({ title: "CANCELED", deliverBy, data: order.items, raw: order, eventId: order.event?.id })

        } else {
          return ({ title: "PENDING", deliverBy, data: order.items, raw: order, eventId: order.event?.id })
        }
      });

  } catch (e) {
    console.log(e, 'getOrders errors');
    // actions.alert.showError({ message: e.response.errors[0]['message'], title: 'Fetching Order' });
  }
}

/*
*
*/
export const saveOrder = async ({ effects }, data) => {
  return await effects.gql.mutations.saveOrder(data)
}

/*
*
*/
export const onChangePage = async ({ state }, page) => {
  state.order.activePage = page
}

/*
*
*/
export const onOrderAdded = ({ state }, data) => {
  state.order.push(data)
};

/*
*
*/
export const createOrder = async ({ state, actions, effects }, data) => {
  console.log(data, 'createOrder data...');
  try {
    const { createOrder } = await effects.gql.mutations.createOrder(data);
    console.log(createOrder, 'createOrder result');
    if (data.eventId) {
      state.eventCart = {};
    } else {
      state.currentCart = {};
    }
    // await actions.event.getUserEvents({userId: state.currentUser.id });
    await actions.order.getOrders({where: { user: { id: state.currentUser.id }}});
    return createOrder;
  } catch (e) {
    console.log(e, 'createOrder errors');
    await actions.alert.showError({ message: e.response.errors[0]['message'], title: 'Flute' });
  }
};

/*
 *
 */
export const updateOrder = async ({ state, actions, effects }, data) => {
  console.log(data, 'updateOrder data...');

  try {
    const { updateOrder } = await effects.gql.mutations.updateOrder(data);

    console.log(updateOrder, 'updateOrder result');

    await actions.order.getOrders({ where: { user: { id: state.currentUser.id } } });

  } catch (e) {
    console.log(e, 'updateOrder errors');
    await actions.alert.showError({ message: e.response.errors[0]['message'], title: 'Flute' });
  }
}

/*
*
*/
export const cancelOrder = async ({ state, actions, effects }, data) => {
  try {
    await effects.gql.mutations.cancelOrder(data);
    await actions.order.getOrders({ where: { user: { id: state.currentUser.id } } });
    await actions.event.getUserEvents({ userId: state.currentUser.id });
  } catch(e) {
    console.log(e, 'cancelOrder errors');
  }
};

/*
*
*/
export const emailReceipt = async ({ effects }, data) => {
  try {
    await effects.gql.mutations.emailReceipt(data);

  } catch(e) {
    console.log(e, 'emailReceipt errors');
  }
};

/*
*
*/
export const createSurveyAnswer = async ({ effects }, data) => {
  try {
    return await effects.gql.mutations.createSurveyAnswer(data);
  } catch(e) {
    console.log(e, 'createSurveyAnswer errors');
  }
};

