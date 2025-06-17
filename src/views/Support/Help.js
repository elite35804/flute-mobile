import React, {useState} from 'react';
import styled from 'styled-components/native';
import {Dimensions, Platform, View} from 'react-native';
import {MainSemiBoldFont, MainBoldFont, MainRegularFont} from '@/views/Components';
import {useOvermind} from '@/store';
import {Images} from '@/styles/Images';
import {Styles} from '@/styles';
import {useNavigation} from '@react-navigation/native';
import TextInputFlat from '@/views/Components/EditInput';
import {ModalHeader} from '@/views/Components/ModalHeader';

const Help = (props) => {
  const {state, actions} = useOvermind();
  const [subject, setSubject] = useState('');
  const [name, setName] = useState(state.currentUser.fullName);
  const [comment, setComment] = useState('');

  const [validationErrors, setValidationErrors] = useState({});
  const navigation = useNavigation();

  const onPressSubmit = async () => {
    try {
      actions.hud.show();
      const variables = {subject, message: comment, userId: state.currentUser?.id};
      await actions.comment.requestSupport(variables);
      actions.hud.hide();
      actions.alert.showSuccess({message: 'Your message has been submitted successfully', name: 'Flute'});
      props.navigation.pop();
    } catch (err) {
      console.log(err, 'Help errors ...');
      actions.hud.hide();
    }
  };

  function formatPhoneNumber(phoneNumberString) {
    var cleaned = ('' + phoneNumberString).replace(/\D/g, '');
    var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    }
    return null;
  }

  return (
    <Container>
      <Bg source={Images.bg_setting} />
      <ModalHeader title={'Help'} {...props} />
      <Header>
        <HeaderLogo source={Images.logo_support} />
        <HeaderContent>
          <HeaderTitle>Flute Technologies Inc.</HeaderTitle>
          <HeaderText>PO BOX 6061-596</HeaderText>
          <HeaderText>Sherman Oaks, CA 91413</HeaderText>
          <HeaderText style={{marginTop: 15}}>{formatPhoneNumber(state.currentUser?.phones?.[0]?.number)}</HeaderText>
          <HeaderText>{state.currentUser?.email}</HeaderText>
        </HeaderContent>
      </Header>
      <Content useKeyboardAware={Platform.OS === 'ios'}>
        <View style={{paddingHorizontal: 15, marginTop: 20}}>
          <TextInputFlat
            value={name}
            placeholder={'Name'}
            onChangeText={(value) => {
              setName(value);
            }}
          />
        </View>
        <View style={{paddingHorizontal: 15, marginTop: 20}}>
          <TextInputFlat
            value={subject}
            placeholder={'Subject'}
            onChangeText={(value) => {
              setSubject(value);
            }}
          />
        </View>
        <View style={{paddingHorizontal: 15, marginTop: 20}}>
          <TextInputFlat
            value={comment}
            placeholder={'Comment'}
            onChangeText={(value) => {
              setComment(value);
            }}
            multiline
          />
        </View>
        <SubmitBtn onPress={onPressSubmit}>
          <BtnTitle>SUBMIT</BtnTitle>
        </SubmitBtn>
      </Content>
    </Container>
  );
};

export default Help;

const SubmitBtn = styled.TouchableOpacity`
  background-color: #d6b839;
  height: 44px;
  border-radius: 2px;
  margin-horizontal: 10px;
  margin-bottom: 10px;
  overflow: hidden;
  margin-top: 25px;
  justify-content: center;
  align-items: center;
`;

const BtnTitle = styled(MainRegularFont)`
  font-size: 12px;
  letter-spacing: 12px;
  color: black;
`;

const HeaderText = styled(MainRegularFont)`
  font-size: 12px;
  color: black;
`;

const HeaderTitle = styled(MainRegularFont)`
  font-size: 18px;
  color: black;
`;

const HeaderContent = styled.View`
  margin-left: 10px;
  justify-content: flex-start;
  align-items: flex-start;
`;

const Header = styled.View`
  align-self: stretch;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  padding-horizontal: 20px;
`;

const HeaderLogo = styled.Image`
  width: 90px;
  height: 90px;
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
  align-self: flex-start;
  margin-left: 5px;
  z-index: 9999;
`;

const Navbar = styled.SafeAreaView`
  align-self: stretch;
  padding-vertical: 20px;
  padding-horizontal: 10px;
`;

const Bg = styled.Image`
  ${Styles.absolute_full}
  width: ${Dimensions.get('window').width}px;
  height: ${Dimensions.get('window').height}px;
  resize-mode: stretch;
`;

const Container = styled.View`
  ${Styles.match_parent}
  background-color: white;
`;

const Content = styled.ScrollView`
  flex: 1;
  align-self: stretch;
`;
