import React, {useState} from "react";
import styled from 'styled-components';
import {Styles} from "@/styles";
import {MainBoldFont, MainRegularFont, YellowButton} from "@/views/Components";
import {Dimensions, Text, Modal} from "react-native";
import Feather from 'react-native-vector-icons/Feather';

const ErrorModal = (props) => {
  return (
    <Modal
      visible={props.showModal}
      onRequestClose={props.setModal}
      transparent={true}
      animationType={'slide'}
      statusBarTranslucent={true}>
      <MainModal>
        <Container>
          <Button onPress={props.setModal}>
            <Feather name={'x'} size={20} color={'black'} />
          </Button>
          <Header>
            <Title>Error saving promo</Title>
          </Header>
          <ErrorMessage>{props.message}</ErrorMessage>
          <ConfirmButton onPress={props.setModal}>
            <Title style={{textAlign: 'center', color: 'white'}}>OK</Title>
          </ConfirmButton>
        </Container>
      </MainModal>
    </Modal>
  );
};

const ConfirmButton = styled.TouchableOpacity`
  background-color: #e6b900;
  padding-vertical: 7px;
  border-width: 1px;
  border-color: #e6b900;
  width: 150px;
`

const Button = styled.TouchableOpacity`
  position: absolute;
  right: 10px;
  top: 10px;
`

const Title = styled(MainBoldFont)`
  font-size: 18px;
  color: red;
`

const Header = styled.View`
  margin-top: 10px;
`

const ErrorMessage = styled(MainRegularFont)`
  color: red;
  font-size: 15px;
  margin-top: 20px;
  margin-bottom: 20px;
`

const MainModal = styled.View`
  align-items: center;
  padding-bottom: 10px;
  padding: 10px;
  flex: 1;
  height: 100%;
  width: 100%;
  background-color: #00000080;
`

const Container = styled.SafeAreaView`
  ${Styles.start_center}
  background-color: white;
  border-radius: 10px;
  width: ${Dimensions.get('window').width - 20}px;
  padding-vertical: 10px;
`

export default ErrorModal;
