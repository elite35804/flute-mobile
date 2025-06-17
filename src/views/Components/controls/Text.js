import styled from 'styled-components/native';

export const StyledText = styled.Text`
  ${props => props.theme.font ? `font-family: ${props.theme.font};` : ''}
  color: ${props => props.theme.colorText};
`;

/**
 * Define most commonly used components here.
 */

export const MainBoldFont = styled.Text`
  font-family: Montserrat-Bold;
`

export const MainRegularFont = styled.Text`
  font-family: Montserrat-Regular;
`

export const MainLightFont = styled.Text`
  font-family: Montserrat-Light;
`

export const MainSemiBoldFont = styled.Text`
  font-family: Montserrat-SemiBold;
`

export const MainMediumFont = styled.Text`
  font-family: Montserrat-Medium;
`
