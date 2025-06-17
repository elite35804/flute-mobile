import React from 'react';
import styled from 'styled-components';
import {TextInputMask} from 'react-native-masked-text';

import {themeProp} from '@/utils/CssUtil';

const StyledInput = styled.TextInput`
  ${props => props.theme.font ? `font-family: ${props.theme.font};` : ''}
  color: ${props => props.theme.colorText};
  height: ${themeProp('szInputHeight')};
  padding-vertical: 0;
`;

export const MaskedInput = styled(props => <TextInputMask {...props} />)`
  ${props => props.theme.font ? `font-family: ${props.theme.font};` : ''}
  color: ${props => props.theme.colorText};
  height: ${themeProp('szInputHeight')};
  padding-vertical: 0;
`;
/**
 * Define most commonly used components here.
 */

export default StyledInput;
