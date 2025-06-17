import { keyBy } from 'lodash';

export const getTotalPaymentMethods = async ({ state, effects }) => {
  const { paymentMethods } = await effects.gql.queries.paymentMethods();
  state.paymentMethods.totalRecords = paymentMethods ? paymentMethods.length : 0;
}

export const getPaymentMethods = async ({ state, effects }, data) => {
  let options = {}
  if (data && data.options) options = data.options
  else if (data && data.all) options = {}
  else {
    options = {
      first: state.paymentMethods.paymentMethodPerPage,
      skip: (state.paymentMethods.activePage - 1) * state.paymentMethods.paymentMethodPerPage
    }
  }

  const { paymentMethods } = await effects.gql.queries.paymentMethods(options)
  if (data && data.getValues) return paymentMethods
  else state.paymentMethods.paymentMethods = keyBy(paymentMethods, 'id')
}

export const savePaymentMethod = async ({ effects }, data) => {
  return await effects.gql.mutations.savePaymentMethod(data)
}

export const onChangePage = async ({ state }, page) => {
  state.paymentMethods.activePage = page
}

export const onPaymentMethodAdded = ({ state }, data) => {
  state.paymentMethods.push(data)
}
  
/*
*
*/
export const generateBraintreeToken = async ({ state, actions, effects }, handler) => {
  const { currentUser } = state;
  const result = await effects.gql.mutations.generateBraintreeClientToken({customerId: currentUser.braintreeCustomerId});
  return result.generateBraintreeClientToken;
}