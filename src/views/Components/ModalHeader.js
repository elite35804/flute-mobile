import React from "react";
import styled from "styled-components";
import {MainBoldFont, MainRegularFont, StyledText} from "@/views/Components/controls/Text";
import {Sizes} from "@/styles/Sizes";

export const ModalHeader = ({title, description, ...props}) => (
  <Header>
    <Left>
      <Title>{title}</Title>
      <Description>{description}</Description>
    </Left>
    <Right onPress={() => props.navigation.pop()}>
      <BtnText>X</BtnText>
    </Right>
  </Header>
);

const BtnText = styled(StyledText)`
  font-weight: 600;
  font-size: 30px;
  line-height: 37px;
  color: black;
`;

const Left = styled.View`
`;

const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding-horizontal: 15px;
  margin-top: 15px;
  margin-bottom: 23px;
`

const Description = styled(MainRegularFont)`
  font-size: ${Sizes.hScale(14)}px;
  line-height: ${Sizes.hScale(19)}px;
  color: black;
`;
const Title = styled(MainBoldFont)`
  font-size: ${Sizes.hScale(30)}px;
  line-height: ${Sizes.hScale(37)}px;
  color: black;
`;

const Right = styled.TouchableOpacity`
  padding-top: 1px;
`
