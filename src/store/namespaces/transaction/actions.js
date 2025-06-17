import { keyBy } from 'lodash'

/*
*
*/
export const getTotalTransactions = async ({ state, effects }) => {
  const { transactions } = await effects.gql.queries.transactions()

  state.transaction.totalRecords = transactions ? transactions.length : 0
}

/*
*
*/
export const getTransactions = async ({ state, effects }, data) => {
  let options = {}
  if (data && data.options) options = data.options
  else if (data && data.all) options = {}
  else {
    options = {
      first: state.transaction.transactionPerPage,
      skip: (state.transaction.activePage - 1) * state.transaction.transactionPerPage
    }
  }

  const { transactions } = await effects.gql.queries.transactions(options)
  if (data && data.getValues) return transactions
  else state.transaction.transactions = keyBy(transactions, 'id')
}

/*
*
*/
export const saveTransaction = async ({ effects }, data) => {
  return await effects.gql.mutations.saveTransaction(data)
}

/*
*
*/
export const onChangePage = async ({ state }, page) => {
  state.transaction.activePage = page
}

/*
*
*/
export const onTransactionAdded = ({ state }, data) => {
  state.transaction.push(data)
}
