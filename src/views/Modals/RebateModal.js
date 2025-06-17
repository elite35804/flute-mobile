import React, {useEffect, useState, useRef} from 'react';
import styled from 'styled-components';
import {useOvermind} from '@/store';
import Feather from 'react-native-vector-icons/Feather';
import {MainBoldFont, MainMediumFont, MainRegularFont, StyledText, DropDownAlert} from '@/views/Components';
import {useNavigation} from '@react-navigation/native';
import {Images, Sizes, Styles} from '@/styles';
import {
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  TouchableHighlight,
  TouchableOpacity,
  View,
  Modal,
} from 'react-native';
import numeral from 'numeral';
import moment from 'moment';
import {formatCurrencyDec, formatCurrencyUnd} from '@/utils/NumberUtil';
import PaymentErrorModal from '@/views/Modals/PaymentErrorModal';
import {MaterialIndicator} from 'react-native-indicators';
import WithdrawErrorModal from './WithdrawErrorModal';

const RebateModal = (props) => {
  var now = new Date();
  const {state, actions} = useOvermind();
  const baseFee =
    state.currentUser.lastWithdrawalDate && moment(state.currentUser.lastWithdrawalDate).month() == now.getMonth()
      ? 0
      : 2;
  const navigation = useNavigation();
  const alertRef = useRef(null);
  const [isShowing, setShowing] = useState(false);
  const [index, setIndex] = useState(0);
  const [isInput, setInput] = useState(false);
  const [value, setValue] = useState(state.currentUser.balance || 0);
  const [message, setMessage] = useState(null);
  const [isShowTooltip, setShowTooltip] = useState(false);
  const initialInstantFee =
    state.currentUser.balance * 0.01 < 0.5
      ? (0.5 + baseFee).toFixed(2)
      : (state.currentUser.balance * 0.01 + baseFee).toFixed(2);
  const [options, setOptions] = useState([
    {
      title: 'Instant Deposit',
      description: 'Fees: $' + initialInstantFee,
      type: 'instant',
    },
    {
      title: '3-5 Business Days',
      description: 'Fees: $' + (state.currentUser.balance * 0.0025 + 0.25 + baseFee).toFixed(2),
      type: 'normal',
    },
  ]);
  const [showErrorModal, setErrorModal] = useState(false);
  const [isShowWithdraw, setShowWithdraw] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const _onPressClose = () => {
    props.setModal && props.setModal(false);
  };

  const calculateInstantFee = (v) => {
    return v < 50 ? (0.5 + baseFee).toFixed(2) : (v * 0.01 + baseFee).toFixed(2);
  };

  const onPressRebate = () => {
    _onPressClose();
    navigation.navigate('Payments', {isRebate: true, updateHandler: () => props.setModal(true)});
  };

  const onPressWithdraw = async () => {
    const payment = state.currentUser.paymentMethods.find((p) => p.type === 'rebate' && p && p.isValid && p.isDefault);
    console.log(payment, 'payment');
    if (typeof Number(value) !== 'number' || state.currentUser.balance === 0) {
      setMessage('Please input valid amount!');
      return false;
    } else if (value > state.currentUser.balance) {
      setMessage('You cannot withdraw more than your balance.');
      return false;
    } else if (!payment) {
      setMessage('Please choose card!');
    } else if (parseFloat(options[index]?.description.split('Fees: $')[1]) > state.currentUser.balance) {
      setMessage('Withdrawal must be a minimum of $5.00');
    } else if (parseFloat(options[index]?.description.split('Fees: $')[1]) + 0.01 > state.currentUser.balance) {
      setMessage('Withdrawal must be a minimum of $' + parseFloat(options[index]?.description.split('Fees: $')[1]) + 1);
    } else if (parseFloat(options[index]?.description.split('Fees: $')[1]) + 1 > value) {
      setShowWithdraw(true);
    } else {
      Alert.alert('Withdraw Rebates', 'Are you sure you want to withdraw?', [
        {text: 'No', style: 'cancel'},
        {
          text: 'Yes',
          onPress: async () => {
            setInput(false);
            setMessage(null);
            try {
              setLoading(true);
              const params = {
                amount: parseFloat(value),
                token: payment.vendors?.find((v) => v?.name === 'stripe')?.token,
                type: options[index]?.type,
                cardId: payment.vendors?.find((v) => v?.name === 'stripe')?.cardId,
                fee: parseFloat(options[index]?.description.split('Fees: $')[1]),
                rebateMethodId: payment?.id,
              };
              const res = await actions.payments.withdrawRebate(params);
              if (res && !res.isDelay) {
                alertRef?.current?.showAlert('success', 'Flute', 'Your money is on the way!');
              } else if (res && res.isDelay && res.arrival_date) {
                alertRef?.current?.showAlert(
                  'success',
                  'Flute',
                  'There was some delay beyond our control, but your money is on the way!'
                );
              } else if (res && res.isDelay && !res.arrival_date) {
                alertRef?.current?.showAlert(
                  'success',
                  'Flute',
                  'There was some delay beyond our control, but your money is on the way!'
                );
              } else {
                // alertRef?.current?.showAlert('error', 'Flute', 'Unable to process your request at this time. Please email rebates@flutedrinks.com to address the issue.')
                setLoading(false);
                setErrorModal(true);
              }

              if (res) {
                await actions.user.getWalletTransactions();
                await actions.getCurrentUser();
                props.setModal(false);
              }
            } catch (e) {
              console.log(e);
              // alertRef?.current?.showAlert('error', 'Flute', 'There was issue with your withdrawal. Please try again.')
              setErrorModal(true);
            } finally {
              setLoading(false);
            }
          },
        },
      ]);
    }
  };

  const onPressHelp = () => {
    setShowing(true);
    setTimeout(() => setShowing(false), 5000);
  };

  const onPressOk = () => {
    console.log('onPressOk');
    setErrorModal(false);
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
        <KeyboardAvoidingView
          style={{flex: 1, marginHorizontal: 0, marginBottom: 0, justifyContent: 'flex-end'}}
          behavior="padding">
          <Space onPress={_onPressClose} />
          <TouchableHighlight
            activeOpacity={1}
            onPress={() => {
              Keyboard.dismiss();
              setShowTooltip(false);
            }}
            style={{height: '50%'}}>
            <Container>
              {isShowing && (
                <Tooltip style={{shadowOffset: {width: 0, height: 4}}} position={-Sizes.hScale(57)}>
                  <TooltipBody>
                    <TooltipTitle>YOU CAN ONLY WITHDRAW FUNDS ASSOCIATED WITH PRODUCT SPECIALS.</TooltipTitle>
                  </TooltipBody>
                  <Arrow source={Images.ic_triangle} width={Sizes.hScale(20)} height={Sizes.hScale(7)} />
                </Tooltip>
              )}
              <Header>
                <Title>WITHDRAW REBATE</Title>
                <Help onPress={onPressHelp}>
                  <HelpText>?</HelpText>
                </Help>
              </Header>
              <Desc>REBATE MONEY{'\n'}AVAILABLE FOR WITHDRAW</Desc>
              <PriceView as={TouchableOpacity} activeOpacity={1} onPress={() => setInput(true)}>
                <Price style={{fontSize: 24, marginRight: 6}}>$</Price>
                {!isInput && <Price style={{fontSize: 40, marginVertical: -6}}>{formatCurrencyDec(value, '0')}</Price>}
                {!isInput && <Price style={{fontSize: 22, marginLeft: 2}}>{formatCurrencyUnd(value)}</Price>}
                {isInput && (
                  <PriceInput
                    keyboardType="decimal-pad"
                    value={value}
                    onChangeText={(v) => {
                      setValue(v);
                      setOptions([
                        {
                          title: 'Instant Deposit',
                          description: 'Fees: $' + calculateInstantFee(v),
                          type: 'instant',
                        },
                        {
                          title: '3-5 Business Days',
                          description: 'Fees: $' + (v * 0.0025 + 0.25 + baseFee).toFixed(2),
                          type: 'normal',
                        },
                      ]);
                      setMessage(null);
                    }}
                    onBlur={() => setInput(false)}
                  />
                )}
              </PriceView>
              {message && <Message>{message}</Message>}
              <Desc style={{marginTop: 5}}>MAX. AMOUNT ${state.currentUser.balance?.toFixed(2)}</Desc>
              <Desc style={{marginTop: 27}}>TRANSPERRING TO{'\n'}DEBIT CARD ENDING IN</Desc>
              <View>
                <Digit>
                  --{' '}
                  {
                    state.currentUser.paymentMethods.find((p) => p.type === 'rebate' && p && p.isValid && p.isDefault)
                      ?.last4
                  }
                </Digit>
                <IconBtn onPress={onPressRebate}>
                  <Feather name="edit" size={22} color={'#d6b839'} />
                </IconBtn>
              </View>
              <Options>
                {isShowTooltip ? (
                  <Tooltip
                    style={{shadowOffset: {width: 0, height: 5}, right: 'auto', left: 10, top: -50, width: '87.5%'}}>
                    <TooltipBody>
                      <TooltipTitle>Stripe's $2 fee for the 1st transaction of each month</TooltipTitle>
                    </TooltipBody>
                    <Arrow
                      source={Images.ic_triangle}
                      width={Sizes.hScale(20)}
                      height={Sizes.hScale(7)}
                      style={{marginRight: '52%'}}
                    />
                  </Tooltip>
                ) : null}
                {options.map((o, i) => (
                  <OptionView as={TouchableOpacity} onPress={() => setIndex(i)} key={i}>
                    <CheckOption selectedIndex={index} index={i}>
                      {index === i && <Feather name={'check'} size={15} color={'white'} />}
                    </CheckOption>
                    <OptionContent>
                      <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <OptionTitle isSelected={index === i}>{o.title}</OptionTitle>
                        {i === 0 && (
                          <TouchableOpacity onPress={() => setShowTooltip(true)} style={{paddingHorizontal: 5}}>
                            <CheckOption style={{backgroundColor: 'black', width: 15, height: 15}}>
                              <OptionTitle style={{color: 'white'}}>?</OptionTitle>
                            </CheckOption>
                          </TouchableOpacity>
                        )}
                      </View>
                      <OptionDescription isSelected={index === i}>{o.description}</OptionDescription>
                    </OptionContent>
                  </OptionView>
                ))}
              </Options>
              <CheckoutButton onPress={onPressWithdraw}>
                {isLoading ? (
                  <MaterialIndicator color={'black'} size={25} trackWidth={2} />
                ) : (
                  <BtnTitle>WITHDRAW</BtnTitle>
                )}
              </CheckoutButton>
              <SubBtn>
                <SubText>POWERED BY</SubText>
                <Image source={Images.logo_stripe} style={{width: 30, height: 30, marginLeft: 5}} />
              </SubBtn>
            </Container>
          </TouchableHighlight>
        </KeyboardAvoidingView>
        <PaymentErrorModal
          showModal={showErrorModal}
          setModal={(isTrue) => (!isTrue ? setErrorModal(isTrue) : onPressOk())}
        />
        <WithdrawErrorModal showModal={isShowWithdraw} setModal={() => setShowWithdraw(false)} />
        <DropDownAlert ref={alertRef} />
      </MainModal>
    </Modal>
  );
};

export default RebateModal;

const Space = styled.TouchableOpacity`
  flex: 1;
  backgroundcolor: transparent;
`;

const Message = styled(MainBoldFont)`
  color: red;
  font-size: 12px;
  margin-top: 10px;
  text-transform: uppercase;
`;

const PriceInput = styled.TextInput`
  font-size: 30px;
  width: 100px;
  margin-top: 3px;
  color: black;
`;

const OptionDescription = styled(MainRegularFont)`
  font-size: 11px;
  color: ${(props) => (props.isSelected ? 'black' : 'gray')};
`;

const OptionTitle = styled(MainBoldFont)`
  font-size: 12px;
  color: ${(props) => (props.isSelected ? 'black' : 'gray')};
`;

const OptionContent = styled.View`
  margin-left: 5px;
`;

const CheckOption = styled.View`
  width: 19px;
  height: 19px;
  border-radius: 14px;
  ${Styles.center}
  background-color: ${(props) => (props.selectedIndex === props.index ? 'black' : '#DCDCDC')}
`;

const OptionView = styled.View`
  flex: 1;
  flex-direction: row;
  padding-horizontal: 13px;
  ${Styles.center}
`;

const Options = styled.View`
  ${Styles.between_center}
  flex-direction: row;
  margin-top: 20px;
`;

const SubText = styled(StyledText)`
  font-weight: 500;
  font-size: 11px;
  line-height: 13px;
  color: #5c5c5c;
`;

const SubBtn = styled.View`
  margin-bottom: 10px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const IconBtn = styled.TouchableOpacity`
  position: absolute;
  right: -50px;
  top: 6px;
`;

const Digit = styled(StyledText)`
  font-weight: 500;
  font-size: 22px;
  line-height: 35px;
  color: black;
`;

const Price = styled(MainMediumFont)`
  font-size: 10px;
  color: black;
`;

const PriceView = styled.View`
  width: 147px;
  height: 52px;
  ${Styles.center_start}
  border-width: 1px;
  border-color: #e6e6e6;
  margin-top: 6px;
  flex-direction: row;
  padding-top: 5px;
`;

const Arrow = styled.Image`
  width: ${Sizes.hScale(30)}px;
  height: ${Sizes.hScale(7)}px;
  resize-mode: contain;
  align-self: flex-end;
  margin-right: 5px;
  margin-top: -1px;
`;
const TooltipTitle = styled(MainMediumFont)`
  color: white;
  font-size: 10px;
  line-height: 15px;
  letter-spacing: 1px;
`;
const TooltipBody = styled.View`
  background-color: black;
  border-radius: 8px;
  padding-vertical: 11px;
  padding-horizontal: 15px;
`;
const Tooltip = styled.View`
  position: absolute;
  top: ${(props) => (props.position ? props.position : 0)}px;
  right: 5px;
  shadow-opacity: 0.2;
  shadow-radius: 1px;
  shadow-color: black;
  z-index: 1000000;
  width: 75%;
`;

const Desc = styled(StyledText)`
  font-weight: 500;
  font-size: 10px;
  line-height: 12px;
  text-align: center;
  margin-top: 16px;
  color: black;
`;

const HelpText = styled(StyledText)`
  font-size: 16px;
  font-weight: 500;
  margin-top: -1px;
  color: black;
`;

const Help = styled.TouchableOpacity`
  position: absolute;
  right: 15px;
  align-items: center;
  align-self: center;
  width: 19px;
  height: 19px;
  border-radius: 10px;
  border-width: 1px;
  border-color: black;
`;

const BtnTitle = styled(MainRegularFont)`
  font-size: 10px;
  line-height: 30px;
  color: white;
  letter-spacing: 4.7px;
`;

const CheckoutButton = styled.TouchableOpacity`
  background-color: #d6b839;
  border-radius: 2px;
  align-items: center;
  justify-content: center;
  padding-vertical: 9px;
  margin-horizontal: 7px;
  margin-top: 18px;
  align-self: stretch;
  height: 45px;
`;
const Title = styled(StyledText)`
  font-weight: 500;
  font-size: 14px;
  line-height: 17px;
  color: black;
`;
const Header = styled.View`
  background-color: #dddddd;
  height: 50px;
  width: 100%;
  border-width: 1px;
  border-color: #cacaca;
  border-bottom-color: black;
  ${Styles.center}
`;
const Container = styled.SafeAreaView`
  height: 100%;
  background-color: white;
  border-radius: 5px;
  align-items: center;
`;

const MainModal = styled.View`
  flex: 1;
  width: 100%;
  height: 100%;
  margin-horizontal: 0;
  margin-bottom: 0;
  justify-content: flex-end;
  background-color: #00000080;
`;
