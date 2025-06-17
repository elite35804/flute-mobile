import {_} from 'lodash'

export const getTotalLikes = async ({state, effects}) => {
  const {likes} = await effects.gql.queries.likes()

  state.likes.totalRecords = likes ? likes.length : 0
}

export const getLikes = async ({state, effects}, data) => {
  let options = {}
  if (data && data.options) options = data.options
  else if (data && data.all) options = {}
  else {
    options = {
      first: state.likes.likePerPage,
      skip: (state.likes.activePage - 1) * state.likes.likePerPage
    }
  }
  //
  const {likes} = await effects.gql.queries.likes(options)
  if (data && data.getValues) return likes
  else state.likes.likes = _.keyBy(likes, 'id')
}

export const saveLike = async ({effects}, data) => {
  return await effects.gql.mutations.saveLike(data)
}

export const onChangePage = async ({state}, page) => {
  state.likes.activePage = page
}

export const onLikeAdded = ({state}, data) => {
  state.likes.push(data)
}

export const like = async ({effects}, data) => {
  try {
    await effects.gql.mutations.like(data)
  } catch (e) {
    console.log(e);
  }
};
