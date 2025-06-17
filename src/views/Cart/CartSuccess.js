import React, {useState} from 'react';
import styled from 'styled-components';
import {
  MainBoldFont,
  MainMediumFont,
  MainRegularFont,
  MainSemiBoldFont,
  StyledText,
} from '@/views/Components/controls/Text';
import {Images} from '@/styles/Images';
import {FlatList, View} from 'react-native';
import {ModalHeader} from '@/views/Components/ModalHeader';
import {useOvermind} from '@/store';
import CartSummary from '@/views/Cart/CartSummary';
import {Styles} from '@/styles';

const CartSuccess = (props) => {
  const {state} = useOvermind();
  const {isReceipt, orderId} = props.route.params;
  const order = state.order.orders[orderId];
  const [pos, setPos] = useState(0);
  const users = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];

  const getPosition = (e) => setPos(e.nativeEvent?.layout?.y);

  const onPressUser = () => props.navigation.navigate('Gift');
  return (
    <Container>
      <ModalHeader
        title={isReceipt ? 'Receipt' : 'Success'}
        description={isReceipt ? 'Your order receipt' : 'Your order is on the way'}
        {...props}
      />
      <Body style={{shadowOffset: {width: 0, height: 2}}}>
        <BorderImage
          defaultSource={Images.bg_opentab_detail_top}
          source={order.pickUpFrom?.avatar ? {uri: order.pickUpFrom?.avatar} : null}
        />
        <View style={{backgroundColor: 'white', paddingTop: 10}}>
          <Main>
            <FluteIcon source={Images.ic_flute} />
            <Detail>
              <TitleView>
                <TitleText>{order?.pickUpFrom?.name}</TitleText>
                <InfoView>
                  <IText>?</IText>
                </InfoView>
              </TitleView>
              <Address>
                {order?.pickUpFrom?.address} {order?.pickUpFrom?.address2 || ''}
                {'\n'}
                {order?.pickUpFrom?.city} {order?.pickUpFrom?.state} {order?.pickUpFrom?.postalCode}
              </Address>
            </Detail>
          </Main>
          <FlatList
            data={order?.items}
            keyExtractor={(item, index) => `${index}_cart`}
            renderItem={(prop) => <Item {...prop} />}
          />
          <Divider />
          <CartSummary data={order} getPosition={getPosition} pos={pos} isReceipt={isReceipt} />
          <AddressView>
            <AddressTitle>RETAILER</AddressTitle>
            <AddressInfo>
              {order?.cart?.metadata?.selectedRetailer?.site?.name + '\n'}
              {order?.cart?.metadata?.selectedRetailer?.site?.address}{' '}
              {order?.cart?.metadata?.selectedRetailer?.site?.address2}
              {'\n'}
              {order?.cart?.metadata?.selectedRetailer?.site?.city},{' '}
              {order?.cart?.metadata?.selectedRetailer?.site?.state}{' '}
              {order?.cart?.metadata?.selectedRetailer?.site?.postalCode}
            </AddressInfo>
          </AddressView>
          {order.deliverTo && (
            <AddressView style={{marginTop: 10}}>
              <AddressTitle>DELIVER TO</AddressTitle>
              <AddressInfo>
                {order?.deliverTo?.name + '\n'}
                {order?.deliverTo?.address} {order?.deliverTo?.address2}
                {'\n'}
                {order?.deliverTo?.city}, {order?.deliverTo?.state} {order?.deliverTo?.postalCode}
                {'\n'}
                {order?.cart?.items[0].deliverTo?.phones[0].number}
              </AddressInfo>
            </AddressView>
          )}
          {order.paymentMethod && (
            <AddressView style={{marginTop: 10}}>
              <AddressTitle>PAYMENT METHOD</AddressTitle>
              <View style={{flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-end'}}>
                <CardIcon source={order.paymentMethod?.image ? {uri: order.paymentMethod?.image} : null} />
                <AddressInfo>Card ending in {order.paymentMethod?.last4}</AddressInfo>
              </View>
            </AddressView>
          )}
          <FluteLogo source={Images.logo_opentab} />
        </View>
        <BorderImage source={Images.bg_opentab_detail_bottom} />
      </Body>
      {!isReceipt && (
        <View style={{marginTop: 20, marginHorizontal: 14}}>
          <GiftTitle>GIFT A FRIEND</GiftTitle>
          <GiftDesc>People you may know</GiftDesc>
        </View>
      )}
      {!isReceipt && (
        <FlatList
          data={users}
          horizontal
          keyExtractor={(item, index) => `${index}_user`}
          style={{marginLeft: 14, marginTop: 12}}
          renderItem={(prop) => <UserItem {...prop} onPress={onPressUser} />}
        />
      )}
    </Container>
  );
};

export default CartSuccess;

const GiftDesc = styled(StyledText)`
  font-weight: 500;
  font-size: 10px;
  line-height: 15px;
  color: #8c8c8c;
`;

const GiftTitle = styled(MainBoldFont)`
  fontsize: 12px;
  lineheight: 15px;
`;

const FluteLogo = styled.Image`
  width: 140px;
  height: 45px;
  resize-mode: contain;
  align-self: center;
  margin-top: 30px;
`;
const CardIcon = styled.Image`
  width: 30px;
  height: 20px;
  resize-mode: contain;
  margin-right: 4px;
`;

const AddressTitle = styled(MainBoldFont)`
  text-align: right;
  font-size: 11px;
  line-height: 23px;
  color: black;
`;

const AddressInfo = styled(StyledText)`
  text-align: right;
  font-size: 10px;
  line-height: 14px;
  margin-top: -2px;
  color: black;
`;

const AddressView = styled.View`
  margin-horizontal: 20px;
`;

const Address = styled(StyledText)`
  fontweight: 300;
  fontsize: 10px;
  lineheight: 13px;
  textalign: center;
  color: #9a9a9a;
`;

const IText = styled(MainBoldFont)`
  font-size: 12px;
  lineheight: 15px;
  color: white;
`;

const InfoView = styled.View`
  width: 18px;
  height: 18px;
  borderradius: 9px;
  backgroundcolor: #d9d9d9;
  margin-left: 9px;
  align-items: center;
`;

const TitleText = styled(StyledText)`
  font-weight: 600;
  font-size: 13px;
  line-height: 16px;
  color: black;
`;

const TitleView = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const Detail = styled.View`
  justify-content: center;
  align-items: center;
  margin-left: 40px;
`;

const FluteIcon = styled.Image`
  width: 50px;
  height: 50px;
  resize-mode: contain;
`;

const Main = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-bottom: 25px;
`;

const BorderImage = styled.Image`
  width: 100%;
  height: 13px;
  resize-mode: cover;
`;

const Divider = styled.View`
  height: 1px;
  background-color: black;
  margin-horizontal: 17px;
`;

const Price = styled(MainMediumFont)`
  font-size: 14px;
  line-height: 25px;
  color: ${(props) => (props.isPromo ? '#038B00' : 'black')};
`;
const Count = styled(MainSemiBoldFont)`
  margin-horizontal: 8px;
  font-size: 15px;
  line-height: 23px;
  color: black;
`;

const ItemCount = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: -17px;
`;

const ItemDetail = styled.View`
  flex-direction: row;
  margin-top: -5px;
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
  ${Styles.center}
`;

const CartHeader = styled.View`
  flex-direction: row;
  align-self: center;
  ${Styles.center}
`;

const CartDesc = styled.View`
  margin-left: 10px;
  ${Styles.center}
`;

const CartItem = styled.View`
  margin-horizontal: 8px;
  padding-horizontal: 11px;
  flex-direction: row;
  align-items: center;
`;

const Body = styled.View`
  margin-horizontal: 13px;
  shadow-color: black;
  shadowopacity: 0.1;
  shadowradius: 1;
`;

const Container = styled.View`
  flex: 1;
  background-color: #f5f5f5;
`;

const Item = ({item, index}) => (
  <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
    <CartItem>
      <ItemCount>
        <Count>{item?.quantity}</Count>
      </ItemCount>
      <CartDesc>
        <CartHeader>
          {index === 0 && (
            <Promo>
              <PromoText>PROMO</PromoText>
            </Promo>
          )}
          <CartTitle numberOfLines={1} ellipsizeMode="tail" isPromo={index === 0}>
            {item?.product?.name}
          </CartTitle>
        </CartHeader>
        <CartDescription>{item?.product?.description || ''}</CartDescription>
      </CartDesc>
    </CartItem>
    <ItemDetail>
      <Price isPromo={index === 0}>${item?.product?.pricing[0]?.retailPrice}</Price>
    </ItemDetail>
  </View>
);

const UserItem = ({item, onPress, ...props}) => (
  <UserView onPress={onPress}>
    <AvatarImage source={Images.ic_flute} />
    <Name>Ashley</Name>
  </UserView>
);

const Name = styled(StyledText)`
  font-weight: 500;
  font-size: 9px;
  line-height: 10px;
  text-align: center;
  color: #525252;
  margin-top: 5px;
`;

const UserView = styled.TouchableOpacity`
  margin-right: 15px;
  align-items: center;
`;

const AvatarImage = styled.Image`
  width: 43px;
  height: 43px;
  border-radius: 23px;
  resizemode: contain;
`;
