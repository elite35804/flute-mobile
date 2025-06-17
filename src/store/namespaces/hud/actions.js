import { _ } from 'lodash';

/*
*
*/
export const show = async ({ state }) => {
  state.hud.counter += 1;
}

/*
*
*/
export const hide = async ({ state }) => {
  state.hud.counter = Math.max(state.hud.counter - 1, 0);
}

/*
*
*/
export const reset = async ({ state }) => {
  state.hud.counter = 0;
}