import {forEach, isEmpty, keyBy} from 'lodash';
import moment from 'moment';
import {json} from 'overmind';

/*
 *
 */
export const getTotalCarts = async ({state, effects}) => {
  const {carts} = await effects.gql.queries.carts();

  state.cart.totalRecords = carts ? carts.length : 0;
};

/*
 *
 */
export const getCarts = async ({state, effects, actions}, data) => {
  try {
    let options = {};

    if (isEmpty(data)) {
      options = {
        first: state.order.orderPerPage,
        skip: (state.order.activePage - 1) * state.order.orderPerPage,
      };
    } else {
      options = data;

      if (!data.first) options.first = state.order.orderPerPage;
      if (!data.skip) options.skip = (state.order.activePage - 1) * state.order.orderPerPage;
    }

    console.log(options, 'getCart options...');

    const {carts} = await effects.gql.queries.carts(options);

    console.log(carts, 'getCart results');

    state.cart.carts = keyBy(carts, 'id');

    forEach(carts, function (cart) {
      if (cart.event && cart.event.id) {
        // state.eventCart = cart;
      } else {
        state.currentCart = cart;
      }
    });
  } catch (e) {
    console.log(e, 'getCarts errors');
  }
};
/*
 *
 */
export const saveCart = async ({state, actions, effects}, data) => {
  try {
    if (state.currentUser.sites?.length > 0) {
      const eventId = data.eventId;
      const cartId = data.cartId;

      data = {
        userId: state.currentUser.id,
        ...data,
      };

      if (!eventId) delete data.eventId;
      if (cartId) data.cartId = cartId;

      console.log(data, 'Pass data to saveCart');

      const {saveCart} = await effects.gql.mutations.saveCart(data);
      state.currentCart = saveCart;

      console.log(saveCart, 'saveCart result');

      if (eventId) {
        state.eventCart = {};
        await actions.event.getUserEvents({userId: state.currentUser.id});
      }

      await actions.order.getOrders({where: {user: {id: state.currentUser.id}}});
      await actions.cart.getCarts({where: {user: {id: state.currentUser.id}, isPending: true}});

      return saveCart;
    } else {
      await actions.alert.showError({
        message: 'Please update your profile and set up a delivery address.',
        title: 'Flute',
      });
    }
  } catch (e) {
    console.log(e, 'saveCart errors');
    await actions.alert.showError({message: e.response.errors[0]['message'], title: 'Flute'});
  }
};

/*
 *
 */
export const onChangePage = async ({state}, page) => {
  state.cart.activePage = page;
};

/*
 *
 */
export const onCartAdded = ({state}, data) => {
  state.cart.push(data);
};

/*
 *
 */
export const isSoldOut = ({state}, date) => {
  if (!date) date = state.dateSlider.selectedDate;
  const formattedDate = moment(date).format('YYYY-MM-DD').toString();
  const soldOutDays = state.cart.soldOutDays && Object.values(json(state.cart.soldOutDays))[0];
  const isSoldOut = soldOutDays.findIndex((s) => s.trim() === formattedDate.trim());
  return isSoldOut > -1;
};

/*
 *
 */
export const setSoldOutDays = async ({state, effects}) => {
  state.cart.soldOutDays = await effects.gql.queries.soldOutDays();
};

/*
 *
 */
export const emptyCart = async ({state, effects, actions}, data) => {
  try {
    if (!data.eventId) delete data.eventId;
    data.userId = state.currentUser.id;
    console.log('Delete Cart', data);
    await effects.gql.mutations.saveCart(data);
    if (data.eventId) {
      await actions.event.getUserEvents({userId: state.currentUser.id});
    }
    await actions.order.getOrders({where: {user: {id: state.currentUser.id}}});
    await actions.cart.getCarts({where: {user: {id: state.currentUser.id}, isPending: true}});
    if (data.eventId) {
      state.eventCart = {};
    } else {
      state.currentCart = {};
    }
  } catch (e) {
    console.log(e, 'emptyCart errors');
  }
};

export const modifierChange = ({state, effects}, {id, modifier, isEvent}) => {
  console.log(id, json(modifier), isEvent);
  if (isEvent) {
    state.eventCart.items[id].modifiers = modifier;
  } else {
    state.currentCart.items[id].modifiers = modifier;
  }
};

export const downToLastItem = ({state}, items) => {
  const totalLeft = json(items || []).filter((o) => o.product.isAddOn === false).length;
  return totalLeft <= 1;
};
