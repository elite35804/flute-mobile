import { Dimensions, StatusBar, Platform } from 'react-native';
import { _ } from 'lodash';

/*
*
*/
export const initialize = async ({ state, actions }) => {
  actions.window.updateWindow(Dimensions.get('window'));

  Dimensions.addEventListener('change', ({window}) => {
    console.log(window, 'changed window')
    actions.window.updateWindow(window);
  });
}

/*
*
*/
export const updateWindow = async ({ state }, { width, height }) => {
  if (Platform.OS === 'android') {
    height -= StatusBar?.currentHeight ?? 0;
  }
  state.window.size = {
    width,
    height,
  };
}