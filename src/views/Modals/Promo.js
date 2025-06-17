import React from 'react';
import { Modal, Platform } from 'react-native';
import styled from 'styled-components';
import { Images, Styles } from '../../styles';
import { MainMediumFont, MainSemiBoldFont } from '../Components';

const Promo = (props) => {
  return (
    <Modal visible={props.showModal} animationType="slide" transparent={true}>
      <Container>
        <TopImage source={Images.promo} />
        <Wrapper>
          <Title>Heads Up!</Title>
          <Description>Please make sure the receipt clearly shows:</Description>
          <Description style={{ marginBottom: 10 }}>1. Venue name</Description>
          <Description style={{ marginBottom: 10 }}>2. Date</Description>
          <Description style={{ marginBottom: 10 }}>3. Brand name</Description>
          <Description>4. Price greater than rebate</Description>
        </Wrapper>
        <ConfirmBtn style={{ borderRightWidth: 0 }} onPress={() => props.setModal(true)}>
          <ConfirmText>{props?.isRetry ? 'Retry': 'OK'}</ConfirmText>
        </ConfirmBtn>
      </Container>
    </Modal>
  );
};

export default Promo;

const Title = styled(MainSemiBoldFont)`
  font-size: ${Platform.OS === 'ios' ? '29px' : '25px'};
  color: white;
  margin-bottom: 20px;
`;

const ConfirmText = styled(MainSemiBoldFont)`
  font-size: 18px;
  color: black;
`;

const ConfirmBtn = styled.TouchableOpacity`
  padding-horizontal: 60px;
  padding-vertical: 8px;
  background-color: white;
  border-radius: 32px;
  align-self: center;
  margin-top: ${Platform.OS === 'ios' ? '30px' : '15px'}
  margin-bottom: ${Platform.OS === 'ios' ? '40px' : '20px'};
   ${Styles.center};
`;

const Wrapper = styled.View`
  padding-top: ${Platform.OS === 'ios' ? '30px' : '15px'};
  padding-horizontal: 20px;
  flex: 1;
`;

const Description = styled(MainMediumFont)`
  font-size: ${Platform.OS === 'ios' ? '20px' : '15px'}
  margin-bottom: ${Platform.OS === 'ios' ? '27px' : '20px'}
  line-height: 27px;
  color: white;
  padding-bottom: 5px;
`;

const Container = styled.View`
  flex: 1;
  background-color: black;
`;

const TopImage = styled.Image`
  width: 100%;
  height: 40%;
`;
