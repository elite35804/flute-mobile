import { EndPoint } from '@/Config';

export const onInitialize = async ({ state, actions, effects }) => {
console.log(EndPoint.apiUrl, 'EndPoint.apiUrl')
  effects.gql.initialize({
    endpoint: EndPoint.apiUrl, // query and mutation options
    // This runs on every request
    // headers: () => ({
    //   authorization: `Bearer ${state.auth.token}`
    // }),
    // The options are the options passed to GRAPHQL-REQUEST
    // options: {
    //   credentials: 'include',
    //   mode: 'cors',
    // },
  }, {
    endpoint: EndPoint.wssUrl
  });

  console.log('Overmind Initialization...', actions, effects);
  console.log('Overmind State...', state);
  console.log('Overmind Actions...', actions);
  console.log('Overmind Effects...', effects);

  effects.init.initialize(actions); // init state
}
