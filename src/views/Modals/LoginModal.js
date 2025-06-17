import React, {useEffect, useState} from 'react';
import {Platform, LayoutAnimation, Alert, Modal, Keyboard} from 'react-native';
import styled from 'styled-components';
import {MyTextInput, YellowButton, MainMediumFont, MainBoldFont, MainSemiBoldFont} from '@/views/Components';
import {Colors, Images} from '@/styles';
import {Spacing, FontSize} from '@/styles/Dimension';
import LoadingHud from '@/views/Components/hud';
import {useOvermind} from '@/store';
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";

const tag = 'LoginModal:: ';

const LoginModal = props => {
  const [step, setStep] = useState(null);
  const [mobileNumber, setMobileNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isShow, setShow] = useState(false);

  const {state} = useOvermind();
  const width = state.window.width;

  useEffect(() => {
    setStep(0);
    Keyboard.addListener('keyboardDidShow', () => setShow(true));
    Keyboard.addListener('keyboardDidHide', () => setShow(false));
    return () => {
      Keyboard.addListener('keyboardDidShow', () => setShow(true));
      Keyboard.addListener('keyboardDidHide', () => setShow(false));
    }
  }, []);
  /*
  *
  */
  const hide = () => {
    props.setModalVisible(false);
  };

  /*
  *
  */
  const validNumber = (number) => {
    return number.length == 10;
  };

  /*
  *
  */
  const login = () => {
    const number = mobileNumber.replace(/[^A-Z0-9]/ig, "");

    if (!validNumber(number)) {
      Alert.alert('Please input valid phone number')
      return;
    }

    setStep(1);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    props.onLogin && props.onLogin(number);
  };

  /*
  *
  */
  const verify = () => {
    props.onVerify && props.onVerify(verificationCode);
  };

  /*
  *
  */
  const onResend = () => {
    props.onResend && props.onResend();
  };

  /*
  *
  */
  const onChange = () => {
    setStep(0);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  };

  /*
  *
  */
  return (
    <Modal
      visible={props.showModal}
      animationType='slide'
      transparent={true}
    >
      <KeyboardView behavior={"padding"} keyboardVerticalOffset={0} enabled>
        <Space onPress={hide} isShow={isShow}/>
        <Container>
          <Header>
            {step === 1 && <BackButton onPress={() => setStep(0)}>
              <FontAwesome5Icon name={'angle-left'} size={20}/>
            </BackButton>}
            <Title>
              LOGIN / SIGN UP
            </Title>
          </Header>
          <RowContainer style={{marginLeft: step === 0 ? 0 : -width}}>
            <FieldsContainer>
              <MbTitle>MOBILE NUMBER</MbTitle>
              <AuthTextInput
                type={'cel-phone'}
                options={{
                  maskType: 'BRL',
                  withDDD: true,
                  dddMask: '(999) 999-9999'
                }}
                placeholder={"Enter mobile number"}
                placeholderTextColor='#A0A0A0'
                keyboardType="phone-pad"
                value={mobileNumber}
                onChangeText={mobileNumber => setMobileNumber(mobileNumber)}
              />
              <MbDesc>We'll text you a 6 digit code.</MbDesc>
              <MbBtn onPress={login}>
                <MbImage source={Images.btn_opentab}/>
                <MbBtnTitle>SEND VERIFICATION CODE</MbBtnTitle>
              </MbBtn>
            </FieldsContainer>
            <FieldsContainer>
              <MbTitle>VERIFICATION CODE</MbTitle>
              <AuthTextInput
                keyboardType="number-pad"
                value={verificationCode}
                onChangeText={verificationCode => setVerificationCode(verificationCode)}
              />
              <MbResendBtn onPress={onResend}>
                <ResentTitle>Resend Verification Code</ResentTitle>
              </MbResendBtn>
              <MbBtn onPress={verify}>
                <MbImage source={Images.btn_opentab}/>
                <MbBtnTitle>SUBMIT VERIFICATION CODE</MbBtnTitle>
              </MbBtn>
            </FieldsContainer>
          </RowContainer>
        </Container>
      </KeyboardView>
      <LoadingHud/>
    </Modal>
  )
}

export default LoginModal;

const BackButton = styled.TouchableOpacity`
  position: absolute;
  left: 10px;
`

const KeyboardView = styled.KeyboardAvoidingView`
  flex: 1;
`

const Container = styled.View`
  backgroundColor: #D8D8D8;
  width:100%;
`

const FieldsContainer = styled.View`
  flex:1;
  padding-horizontal: 30px;
`

const Space = styled.TouchableOpacity`
  flex: 1;
  backgroundColor: transparent;
`

const Header = styled.View`
  backgroundColor: #CFCFCF;
  paddingHorizontal: ${Spacing.SM}px;
  padding-vertical: 10px;
  justifyContent: center;
  align-items: center;
`

const Title = styled(MainBoldFont)`
  fontSize: ${FontSize.Medium}px;
  color: ${Colors.black};
  fontWeight: bold;
`

const Bottom = styled.View`
  padding: ${Spacing.MD}px;
  margin-bottom: 10px;
`

const Description = styled(MainMediumFont)`
  color: ${Colors.lightText};
  fontSize: ${FontSize.Small}px;
  textAlign: center;
  marginBottom: ${Spacing.SM}px;
`

const Link = styled.Text`
  color: ${Colors.linkText};
  fontSize: ${FontSize.Small}px;
  textAlign: center;
  marginBottom: ${Spacing.SM}px;
  textDecorationLine: underline;
`

const RowContainer = styled.View`
  flexDirection: row;
  width:200%;
`
const Expander = styled.View`
  flex: 1;
`

const AuthTextInput = styled(MyTextInput)`
  text-align:center;
  font-family: Montserrat-Bold;
  background-color: white;
  height: 50px;
  padding-horizontal: 10px;
  margin-top: 10px;
  color: #000;
  width: 100%;
  flex: 1;
`

const MbTitle = styled(MainSemiBoldFont)`
  color: black;
  font-size: 14px;
  align-self: flex-start;
  margin-top: 20px;
`

const MbDesc = styled(MainSemiBoldFont)`
  color: #444;
  font-size: 13px;
  margin-top: 15px;
  align-self: center;
`

const MbBtn = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  background-color: #E6B900;
  height: 45px;
  border-color: #E6B900;
  border-width: 1px;
  margin-vertical: 20px;
  overflow: hidden;
  width: 100%;
`

const MbResendBtn = styled.TouchableOpacity`
  padding-vertical: 10px;
  margin-top: 5px;
  align-items: center;
`

const ResentTitle = styled(MainSemiBoldFont)`
  color: #659EE0;
  font-size: 14px;
  text-decoration: underline;
  text-decoration-color: #659ee0;
`

const MbImage = styled.Image`
  position: absolute;
  left: 0; right: 0; top: 0; bottom: 0;
  height: 45px;
  width: 100%;
  resize-mode: stretch;
`

const MbBtnTitle = styled(MainBoldFont)`
  font-size: 14px;
  color: #fff;
`

