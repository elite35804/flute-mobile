import { keyBy, isEmpty } from 'lodash';

/*
*
*/
export const getTotalProducts = async ({ state, effects }) => {
  const { products } = await effects.gql.queries.products()

  state.products.totalRecords = products ? products.length : 0
}

/*
*
*/
export const getProducts = async ({ state, effects }, data) => {
  console.log('action getProducts...');

  try {

    let options = {}

    if (isEmpty(data)) {
      options = {
        first: state.product.productPerPage,
        skip: (state.product.activePage - 1) * state.product.productPerPage
      }
    } else {
      options = data;
      if (!data.first) options.first = state.product.productPerPage;
      if (!data.skip) options.skip = (state.product.activePage - 1) * state.product.productPerPage;
    }

    console.log(options, 'getProducts options');

    const { products } = await effects.gql.queries.products(options)

    console.log(products, 'getProducts results');

    state.product.products = keyBy(products, 'id');

  } catch (e) {
    console.log(e, 'getProducts errors');
    // actions.alert.showError({ message: e.response.errors[0]['message'], title: 'Fetching Order' });
  }
}

/*
*
*/
export const saveProduct = async ({ effects }, data) => {
  return await effects.gql.mutations.saveProduct(data)
}

/*
*
*/
export const onChangePage = async ({ state }, page) => {
  state.products.activePage = page
}

/*
*
*/
export const onProductAdded = ({ state }, data) => {
  state.products.push(data)
}

/*
*
*/
export const getAddOns = async ({ state, effects }) => {

  try {
    const result = await effects.gql.queries.getAddOns();
    state.product.addOns = result.getAddOns;

  } catch (e) {
    console.log(e, 'getAddOns error look');
  }
}