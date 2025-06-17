import {_} from 'lodash'

/*
*
*/
export const getTotalPayments = async ({ state, effects }) => {
  const { payments } = await effects.gql.queries.payments()

  state.payments.totalRecords = payments ? payments.length : 0
}

/*
*
*/
export const getPayments = async ({ state, effects }, data) => {
  let options = {}
  if (data && data.options) options = data.options
  else if (data && data.all) options = {}
  else {
    options = {
      first: state.payments.paymentPerPage,
      skip: (state.payments.activePage - 1) * state.payments.paymentPerPage
    }
  }
  //
  const { payments } = await effects.gql.queries.payments(options)
  if (data && data.getValues) return payments
  else state.payments.payments = _.keyBy(payments, 'id')
}

/*
*
*/
export const savePayment = async ({ effects }, data) => {
  return await effects.gql.mutations.savePayment(data)
}

/*
*
*/
export const onChangePage = async ({ state }, page) => {
  state.payments.activePage = page
}

/*
*
*/
export const onPaymentAdded = ({ state }, data) => {
  state.payments.push(data)
}

/*
*
*/
export const sendPoints = async ({ state, effects, actions }, data) => {
  console.log(data, 'sendPoints variables');

  await effects.gql.mutations.sendPoints(data);

  await actions.wallet.getWalletBalance({ userId: state.currentUser.id });
  await actions.wallet.getWallets({ userId: state.currentUser.id });
  await actions.onUserChange();
}

export const withdrawRebate = async ({state, actions, effects}, data) => {
  try {
    const {withdrawRebate} = await effects.gql.mutations.withdrawRebate({userId: state.currentUser.id, ...data});
    return withdrawRebate;
  } catch (e) {
    console.log(e);
  }
}

export const createStripeRebateAccount = async ({state, actions, effects}, data) => {
  try {
    const {createStripeRebateAccount} = await effects.gql.mutations.createStripeRebateAccount({userId: state.currentUser.id, ...data})
    const {getUserById} = await effects.gql.queries.getUserById({userId: state.currentUser.id});
    await actions.user.updateUserProfile({
      setDefaultPaymentMethodId: createStripeRebateAccount.newMethodId,
      defaultPaymentType: 'rebate',
    });
    console.log(getUserById)
    state.currentUser = getUserById;
    return true;
  } catch (e) {
    console.log(e)
    return false;
  }
}
