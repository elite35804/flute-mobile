import { derived } from 'overmind';

export const state = {
  size: { width: 0, height: 0 },
  width: derived(({ size }) => {
    return size.width;
  }),
  height: derived(({ size }) => {
    return size.height;
  }),
  isPortrait: derived(({ size }) => {
    return size.width <= size.height;
  }),
  isLandscape: derived(({ size }) => {
    return size.width > size.height;
  }),
}