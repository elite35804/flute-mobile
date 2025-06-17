import {Platform} from "react-native";
import FTIcon from "react-native-vector-icons/Feather";
import FAIcon from "react-native-vector-icons/FontAwesome";
import React from "react";
import styled from "styled-components";
import {MainBoldFont, MainRegularFont, MainSemiBoldFont} from "@/views/Components/controls/Text";

const NavBar = ({title, description, ...props}) => {
  return <NavBarContainer>
    <BackButton onPress={() => props.navigation.pop()}>
      <BackText>
        {Platform.OS === 'ios' ? <FTIcon name="arrow-left" size={20} color="black"/> :
          <FAIcon name="arrow-left" size={20} color="black"/>}
      </BackText>
    </BackButton>
    {title && <BackTitle>{title}</BackTitle>}
    {description && <BackDesc>{description}</BackDesc>}
  </NavBarContainer>
};

const BackDesc = styled(MainRegularFont)`
  font-size: 15px;
  margin-left: 10px;
  color: black;
`;

const BackTitle = styled(MainBoldFont)`
  font-size: 30px;
  margin-left: 10px;
  color: black;
`;
const BackText = styled(MainSemiBoldFont)`
  font-size: 12px;
  color: black;
`;

const BackButton = styled.TouchableOpacity`
  align-self: flex-start; margin-left: 5px; z-index: 9999;
`

const NavBarContainer = styled.SafeAreaView`
  align-self: stretch;
  padding-vertical: 20px;
  padding-horizontal: 10px;
  border-bottom-width: 0.5px;
  border-color: #CCC;
`;

export default NavBar;
