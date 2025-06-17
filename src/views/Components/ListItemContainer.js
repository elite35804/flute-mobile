import React from 'react';
import styled from 'styled-components/native';
import {TouchableOpacity} from 'react-native';

import {themeProp as theme} from '@/utils/CssUtil';

const NoBorderItemContainer = styled.TouchableOpacity`
  height: ${theme('szListItemHeight')};
  width: 100%;
  flex-direction: row;
  align-items: center;
  padding-horizontal: ${theme('szPaddingHorizontal')};
`;

const ItemSeparator = styled.View`
  height: ${theme('szListDivider')};
  border-bottom-color: #DDDDDD;
  border-bottom-width:${theme('szListDivider')};
`;

export default NoBorderItemContainer

export {NoBorderItemContainer, ItemSeparator}
