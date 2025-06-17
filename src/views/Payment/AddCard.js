import {Platform, Dimensions, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import {ModalHeader} from '@/views/Components/ModalHeader';
import {useNavigation} from '@react-navigation/native';
import {MainMediumFont, MainRegularFont} from '@/views/Components';
import {useOvermind} from '@/store';
import TextInputFlat from '@/views/Components/EditInput';
import {Masks} from 'react-native-mask-input';
// import { DyScanView } from '@dyneti/react-native-dyscan';
// import RnBraintreeNoncehelper from 'rn-braintree-noncehelper';

import {pad} from '@/utils/NumberUtil';
import moment from 'moment';
import {isEmpty} from 'lodash';

const AddCard = (props) => {
  const {state, actions} = useOvermind();
  const {currentUser} = state;
  const navigation = useNavigation();
  const [cardNumber, setCardNumber] = useState('');
  const [expireMonth, setMonth] = useState('');
  const [expireYear, setYear] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [name, setName] = useState(state.currentUser.fullName);

  const onCardScanned = (card) => {
    console.log(card, 'card');
    // the scanned card (can be null)
    // Access the fields cardNumber, expiryMonth, or expiryYear
    if (card && card.cardNumber) setCardNumber(card?.cardNumber);
    if (card && card.expiryMonth) setMonth(pad(card?.expiryMonth, 2));
    if (card && card.expiryYear) setYear('20' + card?.expiryYear);
  };

  useEffect(() => {
    setName(state.currentUser.fullName);
  }, [state.currentUser]);

  const _onPressSave = async () => {
    const mnow = moment();
    const curYear = parseInt(mnow.format('YYYY'), 10);
    const curMonth = parseInt(mnow.format('MM'), 10);
    const month = parseInt(expireMonth, 10);
    const year = parseInt(expireYear, 10);

    if (isEmpty(currentUser.firstName) && isEmpty(currentUser.lastName)) {
      actions.alert.showError({message: 'Please enter user name', title: 'Flute'});
      return;
    }
    if (isEmpty(cardNumber)) {
      actions.alert.showError({message: 'Please enter valid card number', title: 'Flute'});
      return;
    }
    if (year < curYear || (year === curYear && month < curMonth)) {
      actions.alert.showError({message: 'Please enter valid expiration date', title: 'Flute'});
      return;
    }
    if (isEmpty(cardCvv)) {
      actions.alert.showError({message: 'Please enter cvv', title: 'Flute'});
      return;
    }
    if (isEmpty(zipCode)) {
      actions.alert.showError({message: 'Please enter zip code', title: 'Flute'});
      return;
    }

    await _requestAdd(month, year);
  };

  const _requestAdd = async (month, year) => {
    actions.hud.show();
    try {
      const {generateBraintreeClientToken} = await actions.user.generateBraintreeClientToken();
      // const result = await RnBraintreeNoncehelper.createNonce(generateBraintreeClientToken, {
      //   number: cardNumber.toString(),
      //   expirationMonth: month.toString(),
      //   expirationYear: year.toString(),
      //   cvv: cardCvv.toString(),
      //   postalCode: zipCode.toString(), // This is optional parameter
      // });
      // if (result?.type === 'Unknown') {
      //   actions.alert.showError({
      //     message: 'There is an issue with your payment method. Please try to use a different one.',
      //   });
      //   actions.hud.hide();
      //   return false;
      // }
      // console.log(result, 'result');
      const res = await actions.user.updateUserProfile({
        paymentMethod: {
          firstName: currentUser.firstName,
          lastName: currentUser.lastName,
          verificationCode: cardCvv,
          month: month.toString(),
          year: year.toString(),
          number: cardNumber.replace(/[^A-Z0-9]/gi, ''),
          type: 'credit_card',
          // nonce: result.nonce,
          billingZip: zipCode,
        },
      });
      if (props.route.params?.newUser) {
        props.navigation.navigate('Main');
      } else {
        props.navigation.pop();
      }
      if (props.route.params?.onAdded) {
        props.route.params?.onAdded(res);
      }
      actions.alert.showSuccess({message: 'Credit card added successfully.', title: 'Flute'});
    } catch (ex) {
      console.log('AddCard::_requestAdd failed: ', ex);
      actions.alert.showError({message: 'Failed to add credit card', title: 'Flute'});
    }
    actions.hud.hide();
  };

  return (
    <Container>
      <ModalHeader title="Add Credit Card" description="Pay your tabs using your credit card on file" {...props} />
      <KeyboardAvoiding behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Scroll contentStyle={{paddingHorizontal: 20}}>
          {/* <DyScanView
            onCardScanned={onCardScanned}
            bgColor={'#E6E6E6'}
            showCorners={true}
            showDynetiLogo={false}
            cornerThickness={12}
            bgOpacity={0.0}
            vibrateOnCompletion={true}
            style={{
              width: Dimensions.get('window').width,
              height: 320,
              alignSelf: 'center',
              justifyContent: 'flex-start',
              marginTop: 70,
            }}
          /> */}
          <NameView>
            <NameInputView>
              <TextInputFlat
                value={name}
                placeholder={'Card holder name'}
                onChangeText={(value) => {
                  setCardNumber(value);
                }}
                disabled
              />
            </NameInputView>
            <ChangeBtn onPress={() => navigation.navigate('Profile')}>
              <ChangeTitle>CHANGE NAME</ChangeTitle>
            </ChangeBtn>
          </NameView>
          <NameInputView>
            <TextInputFlat
              value={cardNumber}
              placeholder={'Card Number'}
              onChangeText={(value) => {
                setCardNumber(value);
              }}
              disabled
              mask={Masks.CREDIT_CARD}
              keyboardType="number-pad"
            />
          </NameInputView>
          <ExpireView>
            <InputView>
              <TextInputFlat
                value={expireMonth}
                placeholder={'Expire Month - ex. 02'}
                onChangeText={(value) => {
                  if (value?.length > 2) return;
                  setMonth(value);
                }}
                disabled
                mask={[/\d/, /\d/]}
                keyboardType="number-pad"
              />
            </InputView>
            <InputView>
              <TextInputFlat
                value={expireYear}
                placeholder={'Expire Year- ex. 2025'}
                onChangeText={(value) => {
                  if (value?.length > 4) return;
                  setYear(value);
                }}
                disabled
                mask={[/\d/, /\d/, /\d/, /\d/]}
                keyboardType="number-pad"
              />
            </InputView>
          </ExpireView>
          <ExpireView>
            <InputView>
              <TextInputFlat
                value={zipCode}
                placeholder={'billing zip code'}
                onChangeText={(value) => {
                  if (value?.length > 5) return;
                  setZipCode(value);
                }}
                disabled
              />
            </InputView>
            <InputView>
              <TextInputFlat
                value={cardCvv}
                placeholder={'CVV - Ex. 222'}
                onChangeText={(value) => {
                  if (value?.length > 4) return;
                  setCardCvv(value);
                }}
                disabled
              />
            </InputView>
          </ExpireView>
        </Scroll>
        <CheckoutButton onPress={_onPressSave}>
          <BtnTitle>SAVE PAYMENT</BtnTitle>
        </CheckoutButton>
      </KeyboardAvoiding>
    </Container>
  );
};

const InputView = styled.View`
  flex: 1;
`;

const BtnTitle = styled(MainRegularFont)`
  font-size: 13px;
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
  margin-horizontal: 10px;
  margin-top: 10px;
  align-self: stretch;
`;

const ExpireView = styled.View`
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  margin-horizontal: 20px;
  margin-top: 20px;
`;

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: #f5f5f5;
`;
const ChangeTitle = styled(MainMediumFont)`
  color: #0064ff;
  font-size: 12px;
`;

const ChangeBtn = styled.TouchableOpacity`
  position: absolute;
  right: 20px;
  top: 44px;
`;
const NameInputView = styled.View`
  margin-top: 20px;
  margin-horizontal: 20px;
  width: 90%;
`;

const NameView = styled.View`
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: row;
`;

const Scroll = styled.ScrollView`
  height: 75%;
`;

const KeyboardAvoiding = styled.KeyboardAvoidingView`
  justify-content: flex-start;
  align-items: center;
  flex: 1;
`;

export default AddCard;
