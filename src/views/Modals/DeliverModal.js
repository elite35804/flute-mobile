import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import {useOvermind} from '@/store';
import {MainBoldFont, MainRegularFont, StyledText} from '@/views/Components';
import MyInputButton from '@/views/Components/controls/InputButton';
import MyTextInput from '@/views/Components/controls/TextInput';
import LocationModal from '@/views/Modals/LocationModal';
import {isEmpty, get} from 'lodash';
import {KeyboardAvoidingView, Modal} from 'react-native';

const DeliverModal = (props) => {
  const {state, actions} = useOvermind();
  const [recipient, setRecipient] = useState(null);
  const [number, setNumber] = useState(null);
  const [unit, setUnit] = useState(null);
  const [address, setAddress] = useState(null);
  const [showModal, setModal] = useState(false);
  const _onPressClose = () => props.setModal(false);
  useEffect(() => {
    if (props.data) {
      setRecipient(props.data?.name);
      setNumber(props.data?.phones[0]?.number);
      setUnit(props.data?.address2);
      setAddress(props.data);
    } else {
      setRecipient(get(state, 'currentUser.firstName') + ' ' + get(state, 'currentUser.lastName'));
      setNumber(get(state, 'currentUser.phones[0].number'));
    }
  }, [props.data]);
  const checkValid = () => {
    if (isEmpty(recipient)) {
      return 'Please input Recipient!';
    }
    if (isEmpty(number)) {
      return 'Please input Phone Number!';
    }
    if (isEmpty(address?.name)) {
      return 'Please choose Delivery Address!';
    }
    return 'valid';
  };
  const onPressContinue = async () => {
    if (checkValid() !== 'valid') {
      actions.alert.showError('Flute', checkValid());
    } else {
      const params = {
        addressNumber: number.replace(/[^A-Z0-9]/gi, ''),
        addressName: recipient,
        siteName: address?.name,
        employer: address,
        googlePlacesId: address?.place_id,
        address2: unit || '',
        checkFullAddress: true,
      };
      if (!!props.data) params.siteId = props.data.id;
      if (unit) params.address2 = unit;
      try {
        const user = await actions.user.saveUser(params);
        props.setModal(false);
        props.onAdded && props.onAdded(user, !!props.data);
      } catch (e) {
        console.log(e);
      }
    }
  };
  const onSelect = (site) => {
    setAddress(site);
  };
  return (
    <Modal
      visible={props.showModal}
      onRequestClose={_onPressClose}
      transparent={true}
      animationType={'slide'}
      statusBarTranslucent={true}>
      <KeyboardAvoidingView behavior={'padding'} style={{width: '100%', flex: 1, justifyContent: 'flex-end'}}>
        <MainModal>
          <Container>
            <Header>
              <Title>DELIVER TO</Title>
            </Header>
            <CloseBtn onPress={() => props.setModal(false)}>
              <CloseText>X</CloseText>
            </CloseBtn>

            <Scroll>
              <MyTextInput title="RECIPIENT" value={recipient} onChangeText={setRecipient} isDeliver />
              <MyTextInput
                title="PHONE NUMBER"
                type={'cel-phone'}
                options={{
                  maskType: 'BRL',
                  withDDD: true,
                  dddMask: '(999) 999-9999',
                }}
                value={number}
                onChangeText={setNumber}
                isDeliver
              />
              <MyInputButton title="ADDRESS" value={address?.address} onPress={() => setModal(true)} />
              <MyTextInput title="UNIT" value={unit} onChangeText={setUnit} isDeliver />
            </Scroll>
            <CheckoutButton onPress={onPressContinue}>
              <BtnTitle>CONTINUE</BtnTitle>
            </CheckoutButton>
          </Container>
        </MainModal>
      </KeyboardAvoidingView>
      <LocationModal
        showModal={showModal}
        setModal={setModal}
        onSelect={onSelect}
        address={address?.address ? address?.address : null}
      />
    </Modal>
  );
};

export default DeliverModal;

const CloseText = styled(MainBoldFont)`
  font-size: 20px;
  color: black;
`;

const CloseBtn = styled.TouchableOpacity`
  position: absolute;
  right: 10px;
  top: 12px;
`;

const BtnTitle = styled(MainRegularFont)`
  font-size: 10px;
  line-height: 30px;
  color: black;
  letter-spacing: 4.7px;
`;

const CheckoutButton = styled.TouchableOpacity`
  background-color: #d6b839;
  border-radius: 2px;
  align-items: center;
  justify-content: center;
  padding-vertical: 9px;
  margin-horizontal: 7px;
  margin-top: 10px;
  align-self: stretch;
`;

const Scroll = styled.ScrollView`
  flex: 1;
  width: 100%;
  padding-horizontal: 10px;
`;
const Title = styled(StyledText)`
  font-weight: 500;
  font-size: 14px;
  color: black;
  line-height: 17px;
`;
const Header = styled.View`
  background-color: #f5f5f5;
  padding-vertical: 16px;
  width: 100%;
  align-items: center;
`;
const Container = styled.SafeAreaView`
  height: 60%;
  background-color: white;
  border-radius: 5px;
  align-items: center;
`;

const MainModal = styled.View`
  flex: 1;
  height: 100%;
  width: 100%;
  padding-horizontal: 4px;
  padding-bottom: 4px;
  background-color: #00000080;
  justify-content: flex-end;
`;
