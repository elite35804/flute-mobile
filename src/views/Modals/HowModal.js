import React, {useRef} from 'react';
import styled from 'styled-components';
import LottieView from 'lottie-react-native';
import {View, Modal, Platform} from 'react-native';
import {MainBoldFont} from '@/views/Components';

const HowModal = (props) => {
  const lottie = useRef(null);
  setTimeout(() => {
    if (lottie.current) {
      lottie.current.play();
    }
  }, 2000);

  const _onPressClose = () => {
    props.setModal(false);
  };

  return (
    <Modal
      visible={props.showModal}
      onRequestClose={_onPressClose}
      transparent={true}
      animationType={'slide'}
      statusBarTranslucent={true}>
      <MainModal>
        <Container>
          <CloseBtn onPress={props.setModal}>
            <CloseText>X</CloseText>
          </CloseBtn>
          <View style={{flex: 10, justifyContent: 'center', opacity: 1, marginTop: Platform.OS === 'ios' ? 0 : 40}}>
            <LottieView
              ref={lottie}
              loop={false}
              speed={1.5}
              style={{flex: 1}}
              autoPlay
              source={require('./universal-redemption.json')}
            />
          </View>
        </Container>
      </MainModal>
    </Modal>
  );
};

export default HowModal;

const CloseBtn = styled.TouchableOpacity`
  position: absolute;
  top: 25px;
  right: 20px;
  z-index: 1000;
`;

const CloseText = styled(MainBoldFont)`
  font-size: 30px;
  color: black;
`;

const Container = styled.SafeAreaView`
  bottom: ${Platform.OS === 'ios' ? '10px': '0'};
  justify-content: center;
  background-color: white;
  width: 100%;
  height: 100%;
`;

const MainModal = styled.View`
  margin: 0;
  padding: 0;
  background-color: #00000080;
`;
