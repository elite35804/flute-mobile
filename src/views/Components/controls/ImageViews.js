import React from 'react';
import styled, {useTheme} from 'styled-components/native';
import {View, StyleSheet} from 'react-native';

import {Colors} from '@/styles';
import {themeProp} from '@/utils/CssUtil';


export const ThumbnailView = styled.Image`
  width: ${themeProp('szAvatarSmall')};
  height: ${themeProp('szAvatarSmall')};
  border-radius: ${props => props.theme.szAvatarSmall / 2}px;
`;

export const ThumbnailPlaceholder = styled(ThumbnailView)`
  background-color: ${Colors.grey220};
  border-width: ${StyleSheet.hairlineWidth}px;
  border-color: ${Colors.grey125};
`;
