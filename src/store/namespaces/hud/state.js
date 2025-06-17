import { derived } from 'overmind';

export const state = {
  counter: 0,
  isVisible: derived(({ counter }) => {
    return counter > 0;
  }),  
}