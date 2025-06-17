import React from 'react';
import styled from 'styled-components/native';
import {Platform} from 'react-native';
import {MainSemiBoldFont} from '../Components';
import FTIcon from 'react-native-vector-icons/Feather';
import FAIcon from 'react-native-vector-icons/FontAwesome';

const Preview = (props) => {
  return (
    <Container>
      <BackBtn onPress={() => props.navigation.pop()}>
        <BackButton onPress={() => props.navigation.pop()}>
          <BackText>
            {Platform.OS === 'ios' ? (
              <FTIcon name="arrow-left" size={20} color="black" />
            ) : (
              <FAIcon name="arrow-left" size={20} color="black" />
            )}
          </BackText>
        </BackButton>
      </BackBtn>
      <Logo source={{uri: props.route.params.image}} />
    </Container>
  );
};

export default Preview;

const BackText = styled(MainSemiBoldFont)`
  font-size: 12px;
  color: black;
`;

const BackBtn = styled.TouchableOpacity`
  position: absolute;
  paddingtop: 6px;
  paddingleft: 3px;
  borderradius: 25px;
  height: 35px;
  width: 35px;
  top: 50px;
  left: 20px;
  zindex: 100;
  backgroundcolor: white;
`;

const BackButton = styled.TouchableOpacity`
  align-self: flex-start;
  margin-left: 5px;
  z-index: 9999;
`;
const Container = styled.View`
  flex: 1;
`;
const Logo = styled.Image`
  width: 100%;
  height: 100%;
`;
