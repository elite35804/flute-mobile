import { AlertStatic as Alert, Image, Platform, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { MainMediumFont, MainRegularFont } from '@/views/Components';
import { useOvermind } from '@/store';
import { Styles } from '@/styles';
import { SwipeListView } from 'react-native-swipe-list-view';
import moment from 'moment';
import { ModalHeader } from '@/views/Components/ModalHeader';
import { Images } from '@/styles/Images';
import { json } from 'overmind';
import { MaterialIndicator } from 'react-native-indicators';

const Payments = (props) => {
  const { state, actions } = useOvermind();
  const isRebate = props.route.params?.isRebate;
  const [isLoading, setLoading] = useState(false);
  console.log(state.currentUser, isRebate);
  const [cards, setCards] = useState(
    json(
      state.currentUser.paymentMethods.filter(
        (p) => (isRebate ? p.type === 'rebate' : p.type === 'payment') && p.isValid === true && p
      )
    )
  );
  const _onPressAdd = () => {
    props.navigation.navigate(isRebate ? 'AddRebate' : 'AddCard');
  };

  useEffect(() => {
    setCards(
      json(
        state.currentUser.paymentMethods.filter(
          (p) => (isRebate ? p.type === 'rebate' : p.type !== 'rebate') && p.isValid === true && p
        )
      )
    );
  }, [state.currentUser]);

  const onPressPaymentDelete = async (isActive, item) => {
    if (item.isDefault) {
      actions.alert.showError({ message: 'Choose another default payment method!' });
    } else {
      if (isLoading) return false;
      // actions.hud.show();
      setLoading(true);
      const methods = [];
      methods.push(item.id);
      try {
        await actions.user.saveUser({ removePaymentMethods: methods });
      } catch (e) {
        console.log(e);
        actions.alert.showError({ message: 'Failed! Make sure your tab is closed first.', title: 'Flute' });
      } finally {
        setLoading(false);
        // actions.hud.hide();
      }
    }
  };

  const onPressItem = async (item) => {
    try {
      console.log(item, '====');
      const oriCards = [...cards];
      const newCard = oriCards.find((e) => e.id === item.id);
      const curCard = oriCards.find((e) => e.isDefault);
      if (curCard && curCard.id === item.id) return;
      if (curCard) curCard.isDefault = false;
      newCard.isDefault = true;
      setCards(oriCards);
      actions.hud.show();
      try {
        await actions.user.updateUserProfile({
          setDefaultPaymentMethodId: item.id,
          defaultPaymentType: isRebate ? 'rebate' : 'payment',
        });
        actions.hud.hide();
        if (isRebate && props.route.params?.updateHandler) {
          props.route.params?.updateHandler();
        }
        if (props.route.params?.onSelect) {
          props.route.params?.onSelect();
          props.navigation.pop();
        }
      } catch (e) {
        console.log(e);
      }
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <Container>
      <ModalHeader
        title={isRebate ? 'Rebate Methods' : 'Payments'}
        description={isRebate ? 'Upload Debit Cards Only' : 'Your payment methods'}
        {...props}
      />
      <Content>
        {cards.length > 0 ? (
          <SwipeListView
            data={cards}
            renderItem={(data, rowMap) => <Item {...data} onPressItem={onPressItem} />}
            renderHiddenItem={(data, rowMap) => (
              <DeleteBtn
                isDefault={data.item.isDefault}
                key={`delete_${data.item.userId}`}
                onPress={() => onPressPaymentDelete(data.item.isDefault, data.item)}>
                <View style={{ justifyContent: 'center', alignItems: 'center', width: 100 }}>
                  {!isLoading ? (
                    <DeleteTitle>Remove</DeleteTitle>
                  ) : (
                    <MaterialIndicator color={'white'} size={25} trackWidth={2} />
                  )}
                </View>
              </DeleteBtn>
            )}
            leftOpenValue={0}
            rightOpenValue={-100}
            style={{ width: '100%', marginBottom: 100 }}
          />
        ) : (
          <NoCardView>
            <NoText>
              {isRebate
                ? 'In order to withdraw rebate cash, please upload a valid U.S. debit card.'
                : 'In order to complete transactions, please upload at least one payment method.'}
            </NoText>
          </NoCardView>
        )}
        <Bottom>
          <AddBtn onPress={_onPressAdd}>
            <AddTitle>ADD {isRebate ? 'DEBIT CARD' : 'PAYMENT METHOD'}</AddTitle>
          </AddBtn>
        </Bottom>
      </Content>
    </Container>
  );
};

const Item = ({ item, index, onPressItem }) => {
  const cardType = item.cardType === 'american_express' ? 'American Express' : item.cardType;
  return (
    <ItemBtn onPress={() => onPressItem(item)} activeOpacity={1}>
      <Image source={item.image ? { uri: item.image } : null} style={{ width: 50, height: 30, resizeMode: 'contain' }} />
      <ItemBody>
        <Last4>•••• •••• •••• {item.last4}</Last4>
        <Date>
          {cardType} added {moment(item.created).format('MM/DD/YY')}
        </Date>
      </ItemBody>
      <Check source={item.isDefault ? Images.ic_check_gold : Images.ic_uncheck} />
    </ItemBtn>
  );
};

const Check = styled.Image`
  position: absolute;
  right: 15;
`;

const DeleteTitle = styled(MainMediumFont)`
  color: white;
  font-size: 16px;
`;

const DeleteBtn = styled.TouchableOpacity`
  background-color: ${(props) => (props.isDefault ? '#ccc' : '#f00')};
  width: 100px;
  height: 100%;
  align-self: flex-end;
  ${Styles.center_start}
`;

const Date = styled(MainRegularFont)`
  font-size: 14px;
  color: #aaa;
`;

const Last4 = styled(MainMediumFont)`
  font-size: 14px;
  color: black;
`;

const ItemBody = styled.View`
  margin-left: 15px;
`;

const ItemBtn = styled.TouchableOpacity`
  flex-direction: row;
  background-color: white;
  justify-content: space-between;
  border-bottom-width: 1px;
  border-bottom-color: #e1e1e1;
  padding-horizontal: 20px;
  padding-vertical: 30px;
  ${Styles.start_center};
`;

const AddTitle = styled(MainRegularFont)`
  font-size: 12px;
  letter-spacing: 3px;
  color: black;
`;

const AddBtn = styled.TouchableOpacity`
  background-color: #d6b839;
  height: 44px;
  border-radius: 2px;
  margin-horizontal: 10px;
  margin-bottom: 30px;
  align-self: stretch;
  align-items: center;
  justify-content: center;
`;

const Bottom = styled.View`
  ${Styles.absolute_bottom};
  ${Styles.end_center};
  height: 120px;
`;

const NoText = styled(MainRegularFont)`
  font-size: 16px;
  text-align: center;
  color: #888;
`;

const NoCardView = styled.View`
  align-self: stretch;
  padding-top: 60px;
  padding-horizontal: 60px;
`;

const Content = styled.View`
  ${Styles.match_parent};
  background-color: white;
  ${Styles.start_center};
`;

const Container = styled.View`
  ${Styles.match_parent};
  background-color: #e6e6e6;
`;

export default Payments;
