import {Image, View} from 'react-native';
import React from 'react';
import styled from 'styled-components/native';
import {Images, Styles} from '../../styles';
import {MainMediumFont} from '../Components';

const SentDrink = (props) => {
  return (
    <Container>
      <Bg source={Images.ic_blur_back} />
      <ConfirmBtn activeOpacity={0.9} onPress={() => props.navigation.navigate('Home')}>
        <BtnText>
          Your Drinks{'\n'}Have Been{'\n'}Sent!
        </BtnText>
        <Border style={{shadowOffset: {width: 0, height: -2}}}>
          <BorderImage source={Images.btn_social_send} />
        </Border>
      </ConfirmBtn>
    </Container>
  );
};

export default SentDrink;

const BorderImage = styled.Image`
  width: 64px;
  height: 64px;
`;

const Border = styled.View`
  ${Styles.center};
  shadowcolor: rgba(0, 0, 0, 0.5);
  shadowopacity: 1;
  shadowradius: 6;
  elevation: 3;
  margintop: 30px;
`;

const BtnText = styled(MainMediumFont)`
  text-align: center;
  font-size: 30px;
  color: white;
`;

const Container = styled.View`
  flex: 1;
  align-self: stretch;
  justify-content: flex-start;
  align-items: center;
`;

const Bg = styled.Image`
  ${Styles.absolute_full};
  width: 100%;
  height: 100%;
`;

const ConfirmBtn = styled.TouchableOpacity`
  flex: 1;
  alignself: stretch;
  justify-content: flex-end;
  align-items: center;
  padding-bottom: 30px;
`;
