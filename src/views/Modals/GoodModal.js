import React from 'react';
import {Modal} from 'react-native';
import styled from 'styled-components';
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import {Images, Styles} from "../../styles";
import {MainBoldFont, MainRegularFont, MainSemiBoldFont} from "../Components";

const GoodModal = props => {
  return (
    <Modal
      visible={props.showModal}
      animationType='slide'
      transparent={true}
    >
      <Container>
        <Logo source={Images.logo_good}/>
        <BackButton onPress={() => props.setModal(false)}>
          <FontAwesome5Icon name={'times'} size={25} color={'black'}/>
        </BackButton>
        <ContentView>
          <Title>Confirm Addition</Title>
          <Description>Promo is only valid for one unit per product.</Description>
          <Description>Any additional product ordered will be charged at full retail price.</Description>
        </ContentView>
      </Container>
      <BottomView>
        <ConfirmBtn onPress={() => props.setModal(false)}>
          <ConfirmText>CANCEL</ConfirmText>
        </ConfirmBtn>
        <ConfirmBtn style={{borderRightWidth: 0}} onPress={() => props.setModal(true)}>
          <ConfirmText>OK</ConfirmText>
        </ConfirmBtn>
      </BottomView>
    </Modal>
  )
}

export default GoodModal;

const ConfirmText = styled(MainRegularFont)`
  font-size: 18px;
  color: white;
`

const ConfirmBtn = styled.TouchableOpacity`
  flex: 1;
  border-width: 1px;
  border-left-width: 0px;
  border-bottom-width: 0px;
  border-color: gray;
  padding-vertical: 15px;
  ${Styles.center};
`

const BottomView = styled.View`
  position: absolute;
  bottom: 40px;
  left: 10px; right: 10px;
  flex-direction: row;
`

const Description = styled(MainSemiBoldFont)`
  font-size: 16px;
  margin-bottom: 17px;
  line-height: 16px;
  color: white;
`

const Title = styled(MainBoldFont)`
  font-size: 25px;
  margin-bottom: 30px;
  color: white;
`

const ContentView = styled.View`
  padding-vertical: 0;
  padding-horizontal: 15px;
  margin-top: 350px;
`

const Logo = styled.Image`
  width: 100%;
  height: 60%;
  border-radius: 15px;
  position: absolute;
  top: 0;
`

const BackButton = styled.TouchableOpacity`
  position: absolute;
  right: 15px; top: 15px;
`

const Container = styled.View`
  margin-horizontal: 10px;
  margin-vertical: 40px;
  border-radius: 15px;
  flex:1;
  background-color: black;
`
