import {isEmpty, keyBy} from 'lodash'

/*
*
*/
export const getTotalWallets = async ({ state, effects }) => {
  const { wallets } = await effects.gql.queries.wallets();
  state.wallets.totalRecords = wallets ? wallets.length : 0;
}

/*
*
*/
export const getWallets = async ({ state, effects }, data) => {
  console.log(data, 'data getWallets');
  let options = {};

  if(isEmpty(data)) {
    options = {
      first: state.wallet.walletPerPage,
      skip: (state.wallet.activePage - 1) * state.wallet.walletPerPage
    }
  } else {
    options = data;
    if(!data.first) options.first = state.wallet.walletPerPage;
    if(!data.skip) options.skip = (state.wallet.activePage - 1) * state.wallet.walletPerPage;
  }

  console.log(options, 'options getWallets');

  const { getWalletTransactions } = await effects.gql.queries.wallets(options)
  state.wallet.wallets = keyBy(getWalletTransactions, 'id');
}

/*
*
*/
export const saveWallet = async ({ effects }, data) => {
  return await effects.gql.mutations.saveWallet(data)
}

/*
*
*/
export const onChangePage = async ({ state }, page) => {
  state.wallets.activePage = page
}

/*
*
*/
export const onWalletAdded = ({ state }, data) => {
  state.wallets.push(data)
}

/*
*
*/
export const getWalletBalance = async ({ state, effects }, data) => {
  const balance = await effects.gql.queries.getWalletBalance(data);
  state.currentUser.balance = balance.getWalletBalance;
}
