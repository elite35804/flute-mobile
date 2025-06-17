import {StyleSheet} from 'react-native';
import {bs, sizes} from '@theme';

export default StyleSheet.create({
  picker_selected: {
    backgroundColor: '#FFEC00',
    width: sizes.em(122),
    height: sizes.em(104),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.5,
    shadowRadius: sizes.em(8),
  },
});
