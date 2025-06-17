import {Dimensions, Platform, View} from 'react-native';
import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import {ModalHeader} from '@/views/Components/ModalHeader';
import {useNavigation} from '@react-navigation/native';
import {MainRegularFont} from '@/views/Components';
import {useOvermind} from '@/store';
import TextInputFlat from '@/views/Components/EditInput';
// import {DyScanView} from '@dyneti/react-native-dyscan';
import {pad} from '@/utils/NumberUtil';
import moment from 'moment';
import {isEmpty} from 'lodash';
import {NetworkInfo} from 'react-native-network-info';
import {Masks} from 'react-native-mask-input';
import {MaterialIndicator} from 'react-native-indicators';

const AddRebate = (props) => {
  const {state, actions} = useOvermind();
  const {currentUser} = state;
  const navigation = useNavigation();
  const [cardNumber, setCardNumber] = useState('');
  const [expireMonth, setMonth] = useState(null);
  const [expireYear, setYear] = useState(null);
  const [ipAddress, setIpAddress] = useState(null);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    NetworkInfo.getIPV4Address().then((ip) => setIpAddress(ip));
  }, []);

  const onPressConfirm = async () => {
    if (isLoading) {
      return false;
    }
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

    // actions.hud.show();
    setLoading(true);
    try {
      const res = await actions.payments.createStripeRebateAccount({
        card: {
          exp_month: month,
          exp_year: year,
          number: cardNumber,
          currency: 'USD',
        },
        ipAddress,
      });
      if (res) {
        actions.alert.showSuccess({message: 'Debit card added successfully.', title: 'Flute'});
        navigation.pop();
      }
    } catch (e) {
      console.log(e);
      actions.alert.showError({
        message: 'There was an issue. Be sure the card you are adding is a debit card.',
        title: 'Flute',
      });
    } finally {
      setLoading(false);
      // actions.hud.hide();
    }
  };

  const onCardScanned = (card) => {
    console.log(card, 'card');
    // the scanned card (can be null)
    // Access the fields cardNumber, expiryMonth, or expiryYear
    if (card && card.cardNumber) setCardNumber(card.cardNumber);
    if (card && card.expiryMonth) setMonth(pad(card.expiryMonth, 2));
    if (card && card.expiryYear) setYear('20' + card.expiryYear);
  };
  return (
    <Container>
      <ModalHeader title="Add Debit Card" description="Enter debit card info for rebate payout" {...props} />
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
          <View style={{width: Dimensions.get('window').width, flex: 1}}>
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
              <View style={{paddingRight: 5, flex: 1}}>
                <TextInputFlat
                  value={expireMonth}
                  placeholder={'Expire Month - ex. 02'}
                  onChangeText={(value) => {
                    setMonth(value);
                  }}
                  disabled
                  mask={[/\d/, /\d/]}
                  keyboardType="number-pad"
                />
              </View>
              <View style={{paddingRight: 5, flex: 1}}>
                <TextInputFlat
                  value={expireYear}
                  placeholder={'Expire Year- ex. 2025'}
                  onChangeText={(value) => {
                    setYear(value);
                  }}
                  disabled
                  mask={[/\d/, /\d/, /\d/, /\d/]}
                  keyboardType="number-pad"
                />
              </View>
            </ExpireView>
          </View>
        </Scroll>
        <CheckoutButton onPress={onPressConfirm}>
          {isLoading ? (
            <MaterialIndicator color={'black'} size={25} trackWidth={2} />
          ) : (
            <BtnTitle>SAVE DEBIT CARD</BtnTitle>
          )}
        </CheckoutButton>
      </KeyboardAvoiding>
    </Container>
  );
};

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
  margin-bottom: 40px;
  align-self: stretch;
  flex-direction: row;
  height: 50px;
`;

const ExpireView = styled.View`
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  margin-horizontal: 20px;
  margin-top: 20px;
`;

const Container = styled.View`
  flex: 1;
  background-color: #f5f5f5;
`;
const NameInputView = styled.View`
  margin-top: 20px;
  margin-horizontal: 20px;
  width: 90%;
`;

const Scroll = styled.ScrollView`
  height: 75%;
`;

const KeyboardAvoiding = styled.KeyboardAvoidingView`
  justify-content: flex-start;
  align-items: center;
  flex: 1;
`;

export default AddRebate;
