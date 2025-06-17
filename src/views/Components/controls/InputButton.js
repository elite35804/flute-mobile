import React from 'react'
import styled from 'styled-components/native';

import {StyledText} from './Text';
import {themeProp} from '@/utils/CssUtil';

const MyInputButton = ({title, error, value, onPress, ...props}) => (
  <Container disabled={onPress == null} onPress={onPress}>
    <Title>{error ? (<ErrorTitle>{error}</ErrorTitle>) : title}</Title>
    <Value>{value}</Value>
  </Container>
)

export default MyInputButton;

export const BaseContainer = styled.TouchableOpacity`
  width: 100%;
  border-bottom-width: 1px;
  border-bottom-color: gray;
  padding-horizontal: 6px;
  justify-content:center;
`;

const Container = styled(BaseContainer)`
  height: 60px;
  margin-top: 20px;
`;

export const Title = styled(StyledText)`
  fontSize: 9px;
  fontWeight: 300;
`;

const ErrorTitle = styled.Text`
  color: red;
`

const Value = styled(StyledText)`
  ${themeProp('szInputHeight')};
  paddingVertical: 5px;
`
