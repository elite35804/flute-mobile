import React, {useEffect, useRef, useState} from 'react';
import styled from 'styled-components';
import Feather from 'react-native-vector-icons/Feather';
import {TextMask} from 'react-native-masked-text';
import {
  MainBoldFont,
  MainMediumFont,
  MainRegularFont,
  MainSemiBoldFont,
  StyledText,
} from '@/views/Components/controls/Text';
import {FlatList, View, Alert, NativeModules, Platform} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {ModalHeader} from '@/views/Components/ModalHeader';
import {useOvermind} from '@/store';
import DeliverModal from '@/views/Modals/DeliverModal';
import {json} from 'overmind';
import {cartItemDeliverTo} from '@/utils/MiscUtil';
import {Images, Sizes, Styles} from '@/styles';
import CartSummary from '@/views/Cart/CartSummary';
import {SwipeListView} from 'react-native-swipe-list-view';
import {ApplePay} from 'react-native-apay';
import moment from 'moment';
import {get} from 'lodash';
import {NetworkInfo} from 'react-native-network-info';

// const {KountBridgeModule} = NativeModules;

const Cart = (props) => {
  const {state, actions} = useOvermind();
  const [cart, setCart] = useState(state.cart.cartList(state.cart).find((c) => c.id === props.route.params?.cartId));
  const [data, setData] = useState(json(state.currentCart)?.items);
  const [addresses, setAddresses] = useState(
    state.currentUser?.sites?.filter((s) => s.name && s.phones?.length > 0)?.slice(0, 3)
  );
  const navigation = useNavigation();

  const [payments, setPayments] = useState([]);
  const [selectedAddressIndex, setAddressIndex] = useState(
    (addresses && addresses.length > 0 && addresses?.find((a) => a.id === data[0]?.deliverTo?.id)?.id) || null
  );
  const [selectedPaymentIndex, setPaymentIndex] = useState(null);
  const [showModal, setModal] = useState(false);
  const [editAddress, setEditAddress] = useState(null);
  const [isShowing, setShowing] = useState(false);
  const [ipAddress, setIpAddress] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const swipe = useRef(null);
  useEffect(() => {
    getSession();
    connectKount();
    NetworkInfo.getIPV4Address().then((ip) => setIpAddress(ip));
  }, []);
  useEffect(() => {
    getPaymentMethods();
    getAddresses();
  }, [state.currentUser]);

  const connectKount = () => {
    if (Platform.OS === 'ios') {
      try {
        console.log('Started');
        // KountBridgeModule.collect();
      } catch (e) {
        console.log(e);
      }
    } else if (Platform.OS === 'android') {
      // KOUNT_MODULE.collect();
    }
  };
  const makeid = (length) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  };

  const getSession = () => {
    setSessionId(makeid(8));
  };

  const getAddresses = () => {
    const addresses = json(state.currentUser?.sites)?.filter((s) => s.name && s.phones?.length > 0);
    const deliverToAddressIndex = addresses?.findIndex(
      (s) => s.id === get(state, 'currentCart.items[0].deliverTo.id', '')
    );
    if (deliverToAddressIndex > -1) {
      setAddressIndex(addresses[deliverToAddressIndex]?.id);
      addresses?.splice(deliverToAddressIndex, 1);
      setAddresses([json(state.currentUser?.sites[deliverToAddressIndex]), ...addresses.slice(0, 2)]);
    } else {
      setAddresses(addresses.slice(0, 3));
      setAddressIndex(addresses[0].id);
    }
  };

  const onChangeAddress = async (index) => {
    actions.hud.show();
    try {
      const updateItems = [];
      state.currentCart?.items?.map((p) =>
        updateItems.push({
          quantity: p?.quantity,
          productId: p?.product?.id,
          deliverBy: isValidDate(p?.deliverBy),
          deliverTo: {id: index},
          id: p?.id,
        })
      );

      const params = {findMarketplace: true, updateItems, cartId: state.currentCart?.id};
      const cart = await actions.cart.saveCart(params);
      setCart(json(cart));
      setData(cart?.items);
      const addresses = json(state.currentUser?.sites);
      const deliverToAddressIndex = addresses?.findIndex(
        (s) => s.id === get(state, 'currentCart.items[0].deliverTo.id', '')
      );
      setAddressIndex(addresses[deliverToAddressIndex]?.id);
    } catch (e) {
      console.log(e);
    } finally {
      actions.hud.hide();
    }
  };

  const onChangeRetailer = async (retailer) => {
    actions.hud.show();
    try {
      const metadata = json({...state.currentCart.metadata});
      metadata.selectedRetailer = json({...retailer});
      const cart = await actions.cart.saveCart({findMarketplace: true, cartId: state.currentCart.id, metadata});
      setCart(json(cart));
      setData(json(cart?.items));
    } catch (e) {
      console.log(e);
    } finally {
      actions.hud.hide();
    }
  };

  const getPaymentMethods = () => {
    const validPayments = state.currentUser.paymentMethods.filter((p) => p.type === 'payment' && p.isValid);
    const defaultPayment = validPayments?.find((p) => p.type === 'payment' && p.isValid && p.isDefault);
    setPaymentIndex(defaultPayment ? defaultPayment?.id : payments[0] ? payments[0]?.id : 1);
    if (defaultPayment) {
      const items = [
        ...json(validPayments.filter((p) => p.id !== defaultPayment.id)?.slice(0, 2)),
        ...[json(defaultPayment)],
      ];
      setPayments(items);
    } else {
      setPayments(validPayments?.slice(0, 3));
    }
  };

  const onPressAddress = () => {
    setEditAddress(null);
    setModal(true);
  };

  const isValidDate = (date) => {
    if (moment(new Date(date)).format('YYYY-MM-DD') < moment(new Date()).format('YYYY-MM-DD')) return new Date();
    else return date;
  };

  const onPressPayment = () => {
    navigation.navigate('AddCard', {
      onAdded: (res) => {
        const methods = res.paymentMethods.filter((p) => p.type === 'payment' && p.isValid);
        setPaymentIndex(methods[methods.length - 1]?.id);
      },
    });
  };

  const onPressCount = async (id, isPlus) => {
    const items = [...data];
    const oriCart = {...cart};
    if (isPlus) {
      actions.hud.show();
      try {
        const item = items?.find((i) => i.id === id);
        const updateItems = [
          {
            quantity: item?.quantity + 1,
            productId: item?.product?.id,
            deliverBy: item?.deliverBy,
            deliverTo: {id: item?.deliverTo?.id},
            id: item?.id,
          },
        ];
        const params = {findMarketplace: true, updateItems, cartId: oriCart.id};
        const saveCart = await actions.cart.saveCart(params);
        setData(json(saveCart.items));
        setCart(json(saveCart));
      } catch (e) {
        console.log(e);
      } finally {
        actions.hud.hide();
      }
    } else if (!isPlus && items?.find((i) => i.id === id).quantity > 0) {
      if (items?.find((i) => i.id === id).quantity === 1) {
        Alert.alert('Remove Cart', 'Do you wish to remove this item from your cart?', [
          {text: 'Cancel', style: 'cancel'},
          {text: 'OK', onPress: () => onPressRemove(id)},
        ]);
      } else {
        actions.hud.show();
        try {
          const item = items?.find((i) => i.id === id);
          const updateItems = [
            {
              quantity: item?.quantity - 1,
              productId: item?.product?.id,
              deliverBy: item?.deliverBy,
              deliverTo: {id: item?.deliverTo?.id},
              id: item?.id,
            },
          ];
          const params = {findMarketplace: true, updateItems, cartId: oriCart.id};
          const saveCart = await actions.cart.saveCart(params);
          setData(json(saveCart.items));
          setCart(json(saveCart));
        } catch (e) {
          console.log(e);
        } finally {
          actions.hud.hide();
        }
      }
    }
  };

  const createOrder = async () => {
    if (!state.currentCart?.metadata?.selectedRetailer?.site?.name) {
      actions.alert.showError({message: 'Sorry, we could not find a marketplace for you. Please try again later'});
      return false;
    }
    actions.hud.show();
    try {
      if (
        JSON.stringify(state.currentCart.items) !== JSON.stringify(data) ||
        selectedAddressIndex !== addresses.find((a) => a.id === data[0]?.deliverTo?.id)?.id
      ) {
        const updateItems = [];
        const removeItems = [];
        if (data.filter((d) => d.quantity !== 0).length === 0) {
          await actions.cart.emptyCart({deleteCart: true, cartId: cart?.id});
          navigation.pop();
          return;
        } else {
          data.map((d) => {
            let deliverBy = isValidDate(new Date(d.deliverBy || new Date()));
            const deliverTo = cartItemDeliverTo(state.currentUser?.sites?.find((s) => s.id === selectedAddressIndex));
            if (d.quantity === 0) {
              removeItems.push({
                quantity: d.quantity,
                id: d.id,
                productId: d.product?.id,
                deliverBy,
                ...deliverTo,
              });
            } else {
              updateItems.push({
                quantity: d.quantity,
                id: d.id,
                productId: d.product?.id,
                deliverBy,
                ...deliverTo,
              });
            }
          });
          const params = {findMarketplace: true, cartId: cart.id, updateItems, removeItems};
          await actions.cart.saveCart(params);
        }
      }
      const orderParams = {
        cartId: cart.id,
        tipType: '$',
        tipAmount: cart.tip,
        paymentMethodId: selectedPaymentIndex,
        sessionId: sessionId,
      };
      if (ipAddress) {
        orderParams.ipAddress = ipAddress;
      }
      if (selectedPaymentIndex === 1) delete orderParams.paymentMethodId;
      const order = await actions.order.createOrder(orderParams);
      const data = state.order.orders[order?.id];
      if (get(data, 'cart.items[0].campaign.survey.questions.length', 0) > 0) {
        navigation.navigate('Survey', {survey: get(data, 'cart.items[0].campaign.survey'), orderId: order?.id});
      } else {
        navigation.navigate('CartSuccess', {orderId: order?.id});
      }
    } catch (e) {
      console.log(e);
    } finally {
      actions.hud.hide();
    }
  };

  const onPressConfirm = async () => {
    if (selectedPaymentIndex === 1) {
      await onPressApple();
      await createOrder();
    } else {
      if (payments.length === 0) {
        onPressPayment();
        return;
      }
      await createOrder();
    }
  };

  const onAddressAdded = (user, isEdit) => {
    // !isEdit && setAddressIndex(user.sites[user.sites.length - 1]?.id);
  };
  const onPressEdit = (item) => {
    setEditAddress(item);
    setTimeout(() => setModal(true), 500);
  };

  const onPressApple = async () => {
    const requestData = {
      merchantIdentifier: 'merchant.com.flute.spreedly',
      supportedNetworks: ['mastercard', 'visa'],
      countryCode: 'US',
      currencyCode: 'USD',
      paymentSummaryItems: [
        {
          label: 'Delivery Order',
          amount: cart.total?.toString(),
        },
      ],
    };

    if (ApplePay.canMakePayments) {
      const paymentData = await ApplePay.requestPayment(requestData);
      setTimeout(async () => {
        const complete = await ApplePay.complete(ApplePay.SUCCESS);
        return true;
      }, 1000);
    }
  };

  const onPressMore = () => {
    props.navigation.navigate('Addresses', {
      index: selectedAddressIndex,
      onSelect: (id) => {
        setAddressIndex(id);
        if (!addresses.find((a) => a.id === id)) {
          const data = [...addresses];
          if (data.length < 5) {
            setAddresses(
              data.push(
                state.currentUser?.sites?.filter((s) => s.name && s.phones?.length > 0).find((s) => s.id === id)
              )
            );
          } else {
            data[data.length - 1] = state.currentUser?.sites
              ?.filter((s) => s.name && s.phones?.length > 0)
              .find((s) => s.id === id);
            setAddresses(data);
          }
        }
      },
    });
  };

  const onPressPaymentMore = () => {
    props.navigation.navigate('Payments', {
      onSelect: () => {},
    });
  };

  const onPressRemove = async (id) => {
    actions.hud.show();
    try {
      if (data.length === 1) {
        await actions.cart.emptyCart({deleteCart: true, cartId: cart.id});
        navigation.pop();
      } else {
        const item = data?.find((d) => d.id === id);
        const removeItems = [
          {
            quantity: 0,
            id: item.id,
            productId: item?.product?.id,
            deliverBy: new Date(item.deliverBy || new Date()),
            deliverTo: {id: item.product?.id},
          },
        ];
        const params = {findMarketplace: true, cartId: cart.id, removeItems};
        const saveCart = await actions.cart.saveCart(params);
        setCart(json(saveCart));
        setData(json(saveCart.items));
      }
    } catch (e) {
      console.log(e);
    } finally {
      actions.hud.hide();
    }
  };

  const getServiceName = () => {
    let names = [],
      returnName = '';
    data?.filter((s) => names.push(s.pickUpFrom?.name?.toUpperCase()));
    names = names.filter((n, i) => names.indexOf(n) === i);
    names.map((n, i) => {
      if (names.length === 1) {
        returnName = n;
        return returnName;
      } else {
        if (i === names.length - 1) {
          returnName += n;
        } else if (i === names.length - 2) {
          returnName += n + '& ';
        } else {
          returnName += n + ', ';
        }
      }
    });
    return returnName;
  };

  const onPressMark = () => {
    setShowing(true);
    setTimeout(() => {
      setShowing(false);
    }, 5000);
  };
  return (
    <Container>
      <ModalHeader title="Delivery" description="Your delivery order" {...props} />
      <Body>
        <SwipeListView
          ref={swipe}
          data={data}
          renderItem={(data, rowMap) => <Item {...data} {...rowMap} onPressCount={onPressCount} />}
          renderHiddenItem={(data, rowMap) => {
            return (
              <DeleteBtn key={`delete_${data.item.userId}`} onPress={() => onPressRemove(data.item?.id)}>
                <DeleteTitle>Remove</DeleteTitle>
              </DeleteBtn>
            );
          }}
          leftOpenValue={0}
          rightOpenValue={-80}
        />
        <Divider />
        <CartSummary data={cart} isCart />
        <AlertView>
          <AlertText>SERVICED BY {state.currentCart?.metadata?.selectedRetailer?.site?.name?.toUpperCase()}</AlertText>
          <AlertMark onPress={onPressMark}>
            <Mark>?</Mark>
          </AlertMark>
          {isShowing && (
            <Tooltip style={{shadowOffset: {width: 0, height: 4}}} position={-145}>
              <TooltipBody>
                <TooltipTitle>
                  Alcohol orders placed via the Flute marketing platform are sold, shipped and fulfilled by a licensed
                  retailer, which is the seller of record and has the right to accept or reject any order in its sole
                  discretion. See full terms and conditions here. Visit https://staging.flutedrinks.com/
                </TooltipTitle>
              </TooltipBody>
              <Arrow source={Images.ic_triangle} width={Sizes.hScale(20)} height={Sizes.hScale(7)} />
            </Tooltip>
          )}
        </AlertView>
        <Card>
          <CardHeader>
            <CardTitle>MARKETPLACE</CardTitle>
          </CardHeader>
          <CardBody>
            <FlatList
              data={json(state.currentCart?.retailers)?.sort((a, b) => (a.total > b.total ? 1 : -1))}
              keyExtractor={(item, index) => `${index}_retailer`}
              renderItem={(prop) => (
                <RetailerItem
                  {...prop}
                  selected={json(state.currentCart?.metadata?.selectedRetailer)}
                  onPress={onChangeRetailer}
                />
              )}
            />
          </CardBody>
          {state.currentCart?.retailers?.length > 3 && (
            <CardFooter>
              <AddButton onPress={() => navigation.navigate('Retailers')}>
                <AddText>SEE MORE</AddText>
              </AddButton>
            </CardFooter>
          )}
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>DELIVER TO</CardTitle>
          </CardHeader>
          <CardBody>
            <FlatList
              data={addresses}
              keyExtractor={(item, index) => `${index}_address`}
              renderItem={(prop) => (
                <AddressItem
                  {...prop}
                  selectedIndex={selectedAddressIndex}
                  onPress={onChangeAddress}
                  onPressEdit={onPressEdit}
                />
              )}
            />
            {state.currentUser?.sites?.length > 3 && (
              <MoreBtn onPress={onPressMore}>
                <MoreCircle />
                <MoreCircle />
                <MoreCircle />
              </MoreBtn>
            )}
          </CardBody>
          <CardFooter>
            <AddButton onPress={onPressAddress}>
              <AddText>ADD SHIPPING ADDRESS</AddText>
            </AddButton>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>PAYMENT METHOD</CardTitle>
          </CardHeader>
          <CardBody>
            <FlatList
              data={payments.length > 0 ? [...payments, {id: 1}] : [{id: 1}]}
              keyExtractor={(item, index) => `${index}_address`}
              renderItem={(prop) => (
                <AddressItem
                  {...prop}
                  selectedIndex={selectedPaymentIndex}
                  onPress={setPaymentIndex}
                  isPayment={true}
                />
              )}
            />
            {state.currentUser.paymentMethods.filter((p) => p.type === 'payment' && p.isValid)?.length > 3 && (
              <MoreBtn onPress={onPressPaymentMore}>
                <MoreCircle />
                <MoreCircle />
                <MoreCircle />
              </MoreBtn>
            )}
          </CardBody>
          <CardFooter>
            <AddButton onPress={onPressPayment}>
              <AddText>ADD PAYMENT METHOD</AddText>
            </AddButton>
          </CardFooter>
        </Card>
        <AlertDesc>
          By confirming this order, you agree to sharing your delivery information to our 3rd party courier.
        </AlertDesc>
        <CheckoutButton onPress={onPressConfirm}>
          <BtnTitle>CONFIRM DELIVERY</BtnTitle>
        </CheckoutButton>
        <UnderButton onPress={() => navigation.pop()}>
          <UnderTitle>Continue shopping</UnderTitle>
        </UnderButton>
      </Body>
      <DeliverModal showModal={showModal} setModal={setModal} onAdded={onAddressAdded} data={editAddress} />
    </Container>
  );
};

export default Cart;

const Arrow = styled.Image`
  width: ${Sizes.hScale(30)}px;
  height: ${Sizes.hScale(7)}px;
  resize-mode: contain;
  align-self: flex-end;
  margin-right: 8px;
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
  right: 0;
  shadow-opacity: 0.2;
  shadow-radius: 1px;
  shadow-color: black;
  width: 80%;
  z-index: 15;
`;

const MoreCircle = styled.View`
  height: 4px;
  width: 4px;
  border-radius: 2px;
  background-color: #c4c4c4;
`;

const MoreBtn = styled.TouchableOpacity`
  align-self: center;
  align-items: center;
  justify-content: space-between;
  width: 47px;
  height: 12px;
  background-color: white;
  border-radius: 2px;
  padding-horizontal: 14px;
  flex-direction: row;
`;

const DeleteTitle = styled(MainMediumFont)`
  color: white;
  font-size: 14px;
`;

const DeleteBtn = styled.TouchableOpacity`
  background-color: #f00;
  width: 80px;
  height: 100%;
  align-self: flex-end;
  ${Styles.center}
`;

const Divider = styled.View`
  height: 1px;
  background-color: black;
  margin-horizontal: 17px;
`;

const AlertText = styled(StyledText)`
  font-weight: 600;
  font-size: 11px;
  line-height: 13px;
  color: white;
`;

const AlertMark = styled.TouchableOpacity`
  width: 16px;
  height: 16px;
  border-radius: 8px;
  background-color: white;
  align-items: center;
`;

const Mark = styled(MainBoldFont)`
  font-size: 11px;
  line-height: 15px;
  color: black;
`;

const AlertView = styled.View`
  margin-horizontal: 14px;
  margin-bottom: 7px;
  background-color: black;
  border-radius: 3px;
  padding-horizontal: 15px;
  padding-vertical: 9px;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
`;

const UnderButton = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  margin-top: 8px;
  margin-bottom: 50px;
`;

const UnderTitle = styled(MainBoldFont)`
  font-size: 10px;
  line-height: 12px;
  text-decoration: underline;
  color: #797979;
  text-decoration-color: #797979;
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
`;

const AlertDesc = styled(MainMediumFont)`
  font-size: 11px;
  line-height: 13px;
  text-align: center;
  padding-horizontal: 18px;
  color: #c1c1c1;
  margin-top: 13px;
`;

const AddButton = styled.TouchableOpacity`
  padding-horizontal: 32px;
  padding-vertical: 7px;
  align-items: center;
  background-color: #e9e9e9;
  border-radius: 2px;
  align-self: stretch;
  margin-horizontal: 80px;
`;

const AddText = styled(MainBoldFont)`
  font-size: 8px;
  color: #727272;
`;

const CardFooter = styled.View`
  padding-bottom: 15px;
  padding-top: 5px;
`;

const CheckView = styled.View`
  width: 8%;
  justify-content: center;
`;

const AddressView = styled.TouchableOpacity`
  flex-direction: row;
  margin-bottom: 10px;
`;
const Name = styled(MainBoldFont)`
  font-size: 10px;
  line-height: 13px;
  color: ${(props) => (props.isSelected ? 'black' : 'rgba(0,0,0,0.4)')};
`;
const Phone = styled(TextMask)`
  font-family: Montserrat-Regular;
  font-size: 10px;
  line-height: 13px;
  width: 75%;
  color: ${(props) => (props.isSelected ? 'black' : 'rgba(0,0,0,0.4)')};
`;
const AddressText = styled(MainRegularFont)`
  font-size: 10px;
  line-height: 13px;
  width: 75%;
  color: ${(props) => (props.isSelected ? 'black' : 'rgba(0,0,0,0.4)')};
`;
const Address = styled.View`
  width: 100%;
`;
const Check = styled.View`
  width: 15px;
  height: 15px;
  border-radius: 7.5px;
  background-color: black;
  margin-right: 12px;
`;
const CardBody = styled.View`
  padding-vertical: 9px;
  padding-horizontal: 12px;
`;

const CardTitle = styled(MainBoldFont)`
  font-size: 11px;
  color: black;
`;
const CardHeader = styled.View`
  padding-horizontal: 10px;
  padding-vertical: 5px;
  background-color: #efefef;
`;
const Card = styled.View`
  margin-horizontal: 14px;
  border-width: 1px;
  border-color: #d1d1d1;
  border-radius: 3px;
  margin-bottom: 6px;
`;

const Price = styled(MainMediumFont)`
  font-size: 14px
  color: ${(props) => (props.isPromo ? '#038B00' : 'black')};
`;
const Count = styled(MainSemiBoldFont)`
  margin-horizontal: 8px;
  font-size: 15px;
  margin-top: -3px;
  color: black;
`;
const MinusText = styled(MainRegularFont)`
  font-size: 9px;
  color: black;
`;

const MinusButton = styled.TouchableOpacity`
  width: 14px;
  height: 12px;
  background-color: #e7e7e7;
  border-radius: 2px;
  align-items: center;
  justify-content: center;
`;

const ItemCount = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const ItemDetail = styled.View`
  flex-direction: row;
  margin-right: 20px;
`;

const CartDescription = styled(MainRegularFont)`
  font-size: 10px;
  line-height: 15px;
  color: #8c8c8c;
  margin-top: 2px;
`;

const CartTitle = styled(MainRegularFont)`
  font-size: 12px;
  line-height: 15px;
  color: ${(props) => (props.isPromo ? '#038B00' : 'black')};
`;

const PromoText = styled(MainBoldFont)`
  font-size: 8px;
  line-height: 15px;
  color: white;
`;

const Promo = styled.View`
  background-color: #038b00;
  border-radius: 3px;
  padding-horizontal: 6px;
  margin-right: 4px;
`;

const CartHeader = styled.View`
  flex-direction: row;
`;

const CartDesc = styled.View`
  margin-left: 20px;
  align-items: flex-start;
  width: 60%;
`;

const CartItem = styled.View`
  margin-horizontal: 8px;
  padding-bottom: 20px;
  padding-horizontal: 11px;
  flex-direction: row;
  margin-bottom: 4px;
`;

const Body = styled.ScrollView``;

const Container = styled.View`
  flex: 1;
  background-color: #f5f5f5;
`;

const Item = ({item, onPressCount, index, ...props}) => {
  const isToday = moment(new Date(item?.deliverBy)).format('YYYY-MM-DD') === moment(new Date()).format('YYYY-MM-DD');
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#f5f5f5',
        alignItems: 'flex-start',
      }}>
      <CartItem>
        <ItemCount>
          <MinusButton onPress={() => onPressCount(item?.id, false)}>
            <MinusText>-</MinusText>
          </MinusButton>
          <Count>{item?.quantity}</Count>
          <MinusButton onPress={() => onPressCount(item?.id, true)}>
            <MinusText>+</MinusText>
          </MinusButton>
        </ItemCount>
        <CartDesc>
          <CartHeader>
            {item?.isPromo && (
              <Promo>
                <PromoText>PROMO</PromoText>
              </Promo>
            )}
            <CartTitle numberOfLines={1} ellipsizeMode="tail" isPromo={item?.isPromo}>
              {item?.product?.name?.toUpperCase()}
            </CartTitle>
          </CartHeader>
          {item?.product?.description && <CartDescription>{item?.product?.description}</CartDescription>}
          <CartDescription>{`${isToday ? 'Same' : 'Next'} day delivery`}</CartDescription>
        </CartDesc>
      </CartItem>
      <ItemDetail>
        <Price isPromo={item?.isPromo}>${item?.product?.pricing[0]?.retailPrice?.toFixed(2) || 0}</Price>
      </ItemDetail>
    </View>
  );
};

const AddressItem = ({item, index, selectedIndex, onPress, isPayment, onPressEdit}) => (
  <AddressView onPress={() => onPress(item.id)}>
    <CheckView>
      {selectedIndex === item.id && (
        <Check>
          <Feather name="check" color={'white'} size={14} />
        </Check>
      )}
    </CheckView>
    {!isPayment ? (
      <Address>
        <Name isSelected={selectedIndex === item.id}>{item.name}</Name>
        <AddressText numberOfLines={1} isSelected={selectedIndex === item.id}>{`${item.address}. ${
          item.address2 ? `Unit # ${item.address2},` : ''
        } ${item.city}, ${item.state} ${item.postalCode} \n ${
          (item.phones?.length > 0 && item.phones[0]?.number) || ''
        }`}</AddressText>
        {item.phones?.length > 0 && item.phones[0]?.number && (
          <Phone
            type={'cel-phone'}
            options={{
              maskType: 'BRL',
              withDDD: true,
              dddMask: '(999) 999-9999',
            }}
            value={item.phones?.length > 0 && item.phones[0]?.number}
            isSelected={selectedIndex === item.id}
          />
        )}
      </Address>
    ) : (
      <Payment>
        <CardIcon source={item.id === 1 ? Images.ic_apple_pay : item.image ? {uri: item?.image} : null} />
        <AddressText isSelected={selectedIndex === item.id}>
          {item.id === 1 ? 'Pay with Apple Pay' : `Card ending in ${item.last4}`}
        </AddressText>
      </Payment>
    )}
    {!isPayment && selectedIndex === item.id && (
      <EditBtn onPress={() => onPressEdit(item)}>
        <EditText>EDIT</EditText>
      </EditBtn>
    )}
  </AddressView>
);

const RetailerItem = ({item, selected, onPress}) => (
  <AddressView onPress={() => onPress(item)}>
    <CheckView>
      {selected?.retailerLabel === item.retailerLabel && (
        <Check>
          <Feather name="check" color={'white'} size={14} />
        </Check>
      )}
    </CheckView>
    <Payment>
      <CardIcon source={{uri: item.retailerLogo}} />
      <AddressText isSelected={selected?.retailerLabel === item.retailerLabel}>{item?.retailerLabel}</AddressText>
    </Payment>
    <EditText>${item?.total?.toFixed(2)}</EditText>
  </AddressView>
);

const EditText = styled(MainBoldFont)`
  font-size: 8px;
  color: #727272;
`;

const EditBtn = styled.TouchableOpacity`
  height: 21px;
  width: 50px;
  position: absolute;
  right: 0;
  ${Styles.center}
  align-self: center;
  border-width: 1px;
  border-color: #e0e0e0;
  border-radius: 2px;
`;

const CardIcon = styled.Image`
  width: 30px;
  height: 20px;
  resize-mode: contain;
  margin-right: 4px;
`;

const Payment = styled.View`
  flex-direction: row;
  align-items: center;
`;
