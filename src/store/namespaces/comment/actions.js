
export const requestSupport = async ({state, actions, effects}, data) => {
  try {
    await effects.gql.mutations.requestSupport(data);
  } catch(e){
    console.log(e)
  }
}
