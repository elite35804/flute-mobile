import React from 'react';
import { Modal } from 'react-native';
import styled from 'styled-components';
import { Images, Styles } from '../../styles';
import { MainRegularFont, MainSemiBoldFont } from '../Components';

const PromoErrorModal = (props) => {
  return (
    <Modal visible={props.showModal} animationType="slide" transparent={true}>
      <Container>
        <TopImage source={Images.rebate_issue} />
        <Wrapper>
          <Title>All Bad!</Title>
          <Description>
            There is a problem with this receipt. Please try again or email rebates@flutedrinks.com to address the issue.
          </Description>
        </Wrapper>
        <ConfirmBtn style={{ borderRightWidth: 0 }} onPress={() => props.setModal(true)}>
          <ConfirmText>OK</ConfirmText>
        </ConfirmBtn>
      </Container>
    </Modal>
  );
};

export default PromoErrorModal;

const Title = styled(MainSemiBoldFont)`
  font-size: 29px;
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
  margin-top: 30px;
  margin-bottom: 40px;
  ${Styles.center};
`;

const Wrapper = styled.View`
  padding-top: 30px;
  padding-horizontal: 20px;
  flex: 1;
`;

const Description = styled(MainSemiBoldFont)`
  font-size: 14px;
  margin-bottom: 17px;
  line-height: 24px;
  color: white;
  padding-bottom: 5px;
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
`;

const TopImage = styled.Image`
  width: 100%;
  height: 394px;
`;
