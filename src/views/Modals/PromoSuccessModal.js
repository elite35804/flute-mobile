import React from 'react';
import {Modal} from 'react-native';
import styled from 'styled-components';
import {Images, Styles} from '../../styles';
import {MainRegularFont, MainSemiBoldFont} from '../Components';
import FIcon from 'react-native-vector-icons/Feather';

const PromoSuccessModal = (props) => {
  return (
    <Modal visible={props.showModal} animationType="slide" transparent={true}>
      <Container>
        <Wrapper>
          <FIcon size={120} color="#d6b839" name="check-circle" />
          <Title>SUCCESS!</Title>
          <Description>Cash has been added to your wallet.</Description>
        </Wrapper>
        <ConfirmBtn style={{borderRightWidth: 0}} onPress={() => props.navigation.pop()}>
          <ConfirmText>OK</ConfirmText>
        </ConfirmBtn>
      </Container>
    </Modal>
  );
};

const Title = styled(MainSemiBoldFont)`
  font-size: 32px;
  color: white;
  margin-bottom: 10px;
  text-align: center;
  margin-top: 10px;
`;

const ConfirmText = styled(MainSemiBoldFont)`
  font-size: 18px;
  color: black;
  text-align: center;
`;

const ConfirmBtn = styled.TouchableOpacity`
  padding-horizontal: 60px;
  padding-vertical: 8px;
  background-color: white;
  border-radius: 32px;
  align-self: center;
  margin-top: 30px;
  margin-bottom: 40px;
  ${Styles.center};
`;

const Wrapper = styled.View`
  padding-top: 30px;
  padding-horizontal: 20px;
  flex: 1;
  ${Styles.center}
`;

const Description = styled(MainSemiBoldFont)`
  font-size: 15px;
  margin-bottom: 17px;
  line-height: 24px;
  color: white;
  padding-bottom: 5px;
  text-align: center;
  width: 200px;
`;

const SubText = styled(MainSemiBoldFont)`
  font-size: 15px;
  margin-bottom: 17px;
  line-height: 24px;
  color: white;
`;

const Container = styled.View`
  flex: 1;
  background-color: black;
  ${Styles.center};
`;

const TopImage = styled.Image`
  width: 100%;
  height: 394px;
`;

export default PromoSuccessModal;
