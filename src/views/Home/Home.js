import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import {Animated, Dimensions, Image, Platform, View} from 'react-native';
import SLIcon from 'react-native-vector-icons/SimpleLineIcons';
import Swiper from 'react-native-swiper';
import {Colors, Sizes, Styles} from '@/styles';
import {MainBoldFont, MainMediumFont, MainRegularFont, MainSemiBoldFont} from '@/views/Components';
import {Images} from '@/styles/Images';
import {useNavigation} from '@react-navigation/native';
import {useOvermind} from '@/store';
import DeliverModal from '@/views/Modals/DeliverModal';
import WebModal from '@/views/Modals/WebModal';
import {isAddItem} from '@/utils/MiscUtil';
import {json} from 'overmind';
import GoodModal from '@/views/Modals/GoodModal';
import Promo from '@/views/Modals/Promo';
import {formatCurrencyDec, formatCurrencyUnd} from '@/utils/NumberUtil';
import {get, isEmpty} from 'lodash';
import {
  PERMISSION,
  PERMISSIONS,
  RESULTS,
  requestMultiple,
  checkMultiple,
  openSettings,
  check,
} from 'react-native-permissions';
import HowModal from '@/views/Modals/HowModal';
import {LogLevel, OneSignal} from 'react-native-onesignal';

let index = 0;
const Home = (props) => {
  const {state, actions} = useOvermind();
  const [showModal, setModal] = useState(false);
  const [showWebModal, setWebModal] = useState(false);
  const [items, setItems] = useState([]);
  const {height, width} = Dimensions.get('window');
  const [url, setUrl] = useState(null);
  const [address, setAddress] = useState(
    state.currentUser?.site?.id
      ? `${state.currentUser?.site?.address}, ${state.currentUser?.site?.city}, ${state.currentUser?.site?.state}`
      : ''
  );
  const [animOpacity, setAnimOpacity] = useState(new Animated.Value(1));
  const [animHeight, setHeight] = useState(new Animated.Value(height - 277));
  const [animWidth, setWidth] = useState(new Animated.Value(width - 44));
  const [isShow, setShow] = useState(true);
  const [isShowPromo, setShowPromo] = useState(false);
  const [showGoodModal, setGoodModal] = useState(false);
  const [isShowHow, setShowHow] = useState(false);
  const isGuest = props.route.params?.isGuest;
  const navigation = useNavigation();
  useEffect(() => {
    // if (!state.currentUser?.sites || state.currentUser?.sites?.length === 0) {
    //   setModal(true);
    // }
    getPlayerId();
    setAddress(
      state.currentUser?.site?.id
        ? `${state.currentUser?.site?.address}, ${state.currentUser?.site?.city}, ${state.currentUser?.site?.state}`
        : ''
    );
  }, []);

  useEffect(() => {
    let oriItems = json(state.ad?.adByLocation);
    console.log(oriItems, 'oriItems', state.user.redeemedCampaigns);
    setItems(
      oriItems
        ?.filter((i) => state.user.redeemedCampaigns?.filter((u) => u.id === i.id)?.length < i?.maxItemsPer)
        .sort((a, b) => (a?.sortOrder > b?.sortOrder ? 1 : -1))
    );
    setTimeout(() => setShow(false), 5000);
  }, [state.user.redeemedCampaigns]);

  // Pending Survey
  useEffect(() => {
    handlePendingSurveys();
  }, [state.userSurvey.userSurveys]);

  const getPlayerId = async () => {
    const id = await OneSignal.User.pushSubscription.getIdAsync();
    console.log(id, 'id');
    if (id) {
      await actions.user.updateUser({
        where: {id: state.currentUser?.id},
        data: {playerId: id},
      });
    }
  };

  const handlePendingSurveys = () => {
    console.log('handlePendingSurveys ===============', state.userSurvey.userSurveys);
    const surveys = state.currentUser?.pendingSurveys?.filter(
      (s) => !state.userSurvey.userSurveys?.find((us) => us?.survey?.id === s?.id)
    );
    if (surveys?.length > 0) {
      navigation.navigate('Survey', {survey: surveys[0]});
    }
  };

  const onPressAvatar = () => {
    if (checkForRegister()) {
      navigation.navigate('ProfileCheck');
    } else {
      navigation.navigate('Menu');
    }
  };

  const onPressLocation = () => {
    navigation.navigate('GooglePlaceSelector', {
      address,
      onSelect: async (address) => {
        actions.hud.show();
        console.log(address, 'address');
        try {
          await actions.ad.checkForQualifiedAdsByLocation({
            userId: state.currentUser.id,
            ad: {lat: address?.details?.geometry?.location?.lat, lon: address?.details?.geometry?.location?.lng},
          });
          setAddress(address.address);
          let oriItems = json(state.ad?.adByLocation);
          setItems(oriItems);
        } catch (e) {
          console.log(e);
        } finally {
          actions.hud.hide();
        }
      },
    });
  };

  const onPressOk = async () => {
    setGoodModal(false);
    await saveCart();
  };

  const saveCart = async () => {
    actions.hud.show();
    try {
      const adItem = state.ad?.showAds?.find((s) => s.campaign?.id === items[index]?.id);
      if (adItem?.id) {
        const params = {
          userId: state.currentUser?.id,
          impressionId: adItem?.id,
          campaignId: adItem?.campaign?.id,
          adId: adItem?.ad?.id,
          accepted: true,
        };
        await actions.ad.dismissAd(params);
      }

      let saveCartParams = null;
      const itemIndex = state.currentCart?.items?.findIndex((i) => i.product?.id === items[index]?.products[0]?.id);
      if (itemIndex > -1) {
        saveCartParams = {
          findMarketplace: true,
          updateItems: [
            {
              quantity: state.currentCart?.items[itemIndex]?.quantity + 1,
              productId: state.currentCart?.items[itemIndex]?.product?.id,
              originalProductId: state.currentCart?.items[itemIndex]?.product?.id,
              deliverBy: state.currentCart?.items[itemIndex]?.deliverBy,
              deliverTo: {id: state.currentCart?.items[itemIndex]?.deliverTo?.id},
              id: state.currentCart?.items[itemIndex]?.id,
            },
          ],
          cartId: state.currentCart.id,
        };
      } else if (state.currentCart?.id) {
        if (!state.currentCart?.items[0]?.deliverTo?.id) {
          setModal(true);
          return;
        }
        saveCartParams = {
          findMarketplace: true,
          addItems: [
            {
              quantity: 1,
              productId: items[index]?.products[0]?.id,
              originalProductId: items[index]?.products[0]?.id,
              deliverBy: state.currentCart?.items[0]?.deliverBy,
              deliverTo: {id: state.currentCart?.items[0]?.deliverTo?.id},
            },
          ],
          cartId: state.currentCart?.id,
        };
      } else {
        if (!state.currentUser?.site?.id) {
          setModal(true);
          return;
        }
        saveCartParams = {
          findMarketplace: true,
          addItems: [
            {
              quantity: 1,
              productId: items[index]?.products[0]?.id,
              originalProductId: items[index]?.products[0]?.id,
              deliverBy: new Date(),
              deliverTo: {id: state.currentUser?.site?.id},
            },
          ],
        };
      }
      await actions.cart.saveCart(saveCartParams);
      Animated.parallel([
        Animated.timing(animOpacity, {toValue: 0, duration: 1000}),
        Animated.timing(animHeight, {toValue: 0, duration: 1000}),
        Animated.timing(animWidth, {toValue: 0, duration: 1000}),
      ]).start();
      setTimeout(() => {
        setAnimOpacity(new Animated.Value(1));
        setHeight(new Animated.Value(height - 277));
        setWidth(new Animated.Value(width - 44));
      }, 1000);
    } catch (e) {
      console.log(e);
    } finally {
      actions.hud.hide();
    }
  };

  const confirmAdd = async () => {
    if (!items[index]?.products[0]?.id) {
      actions.alert.showError({message: 'Please select product!', title: 'Flute'});
      return;
    }
    if (state.user.redeemedCampaigns.find((r) => r.id === items[index].id)) {
      setGoodModal(true);
      return;
    }
    await saveCart();
  };

  const onPressAdd = async () => {
    if (checkForRegister()) {
      props.navigation.navigate('ProfileCheck');
      return false;
    }
    setShowPromo(true);
    // navigation.navigate('Promo');
    // if (items?.length > 0) {
    //   if (state.currentCart?.id) {
    //     if (await isAddItem()) {
    //       await confirmAdd();
    //     }
    //   } else {
    //     await confirmAdd();
    //   }
    // }
  };

  const _checkEmail = (email) => {
    if (isEmpty(email)) return false;
    const arr = email.toLowerCase().split('@');
    const isNum = /^\d+$/.test(arr[0]);
    if (isNum && arr[1] === 'flutedrinks.com') return false;
    if (isNum && arr[1] === 'local.com') return false;
    return true;
  };

  const onPressRecipes = () => {
    if (checkForRegister()) {
      props.navigation.navigate('ProfileCheck');
      return false;
    }
    if (items.length === 0) {
      setUrl('https://www.instagram.com');
    } else {
      if (items[index]?.ads[0]?.recipeUrl) {
        setUrl(items[index]?.ads[0]?.recipeUrl);
      }
    }
    setTimeout(() => setWebModal(true), 200);
  };

  const onPressPermission = async () => {
    try {
      if (checkForRegister()) {
        props.navigation.navigate('ProfileCheck');
        return false;
      }
      let permission = null;
      if (Platform.OS === 'ios') {
        permission = await checkMultiple([PERMISSIONS.IOS.LOCATION_ALWAYS, PERMISSIONS.IOS.LOCATION_WHEN_IN_USE]);
      } else {
        permission = await checkMultiple([PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION]);
      }

      if (
        Object.values(permission)?.filter((p) => p === RESULTS.DENIED)?.length === Object.values(permission)?.length
      ) {
        let permission1 = null;
        if (Platform.OS === 'ios') {
          permission1 = await requestMultiple([PERMISSIONS.IOS.LOCATION_ALWAYS, PERMISSIONS.IOS.LOCATION_WHEN_IN_USE]);
        } else {
          permission1 = await requestMultiple([PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION]);
        }
        actions.setLocPermission(
          Object.values(permission1)?.find((p) => p === RESULTS.GRANTED)
            ? RESULTS.GRANTED
            : Object.values(permission1)?.[0]
        );
      } else if (
        Object.values(permission)?.filter((p) => p === RESULTS.BLOCKED)?.length === Object.values(permission)?.length
      ) {
        const res = await openSettings();
        console.log(res, 'res');
        let permission1 = null;
        if (Platform.OS === 'ios') {
          permission1 = await requestMultiple([PERMISSIONS.IOS.LOCATION_ALWAYS, PERMISSIONS.IOS.LOCATION_WHEN_IN_USE]);
        } else {
          permission1 = await requestMultiple([PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION]);
        }
        actions.setLocPermission(
          Object.values(permission1)?.find((p) => p === RESULTS.GRANTED)
            ? RESULTS.GRANTED
            : Object.values(permission1)?.[0]
        );
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getSalePrice = (item) => {
    const retailPrice = get(item, 'products[0].pricing[0].retailPrice', 0);
    if (item?.discountType === 'exact') {
      return item?.discountAmount?.toFixed(0);
    } else if (item?.discountType === 'percentage') {
      return (retailPrice - (retailPrice / 100) * parseFloat(item?.discountAmount))?.toFixed(0);
    } else if (item?.discountType === 'dollar') {
      return (retailPrice - item?.discountAmount)?.toFixed(0);
    }
  };

  const onPressMark = () => {
    // if (checkForRegister()) {
    //   navigation.navigate('ProfileCheck');
    // } else {
    setShowHow(true);
    // }
  };

  const checkForRegister = () => {
    return (
      isGuest && (!_checkEmail(state.currentUser?.email) || !state.currentUser?.gender || !state.currentUser?.fullName)
    );
  };

  let balance = state.currentUser?.balance?.toFixed(2);
  if (balance && balance.slice(-2) == '00') {
    balance = state.currentUser?.balance?.toFixed(0);
  }

  return (
    <Container>
      <SafeView>
        <Header>
          <WalletView
            onPress={() => {
              if (checkForRegister()) {
                navigation.navigate('ProfileCheck');
              } else {
                navigation.navigate('Wallet');
              }
            }}>
            <WTitle>WALLET ${balance}</WTitle>
          </WalletView>
          <AvatarView onPress={onPressAvatar}>
            <Avatar source={state.currentUser?.avatar ? {uri: state.currentUser?.avatar} : Images.avatar_female_1} />
          </AvatarView>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'absolute',
              right: 0,
            }}>
            {state.currentCart?.id ? (
              <CheckoutView
                onPress={() => {
                  if (checkForRegister()) {
                    navigation.navigate('ProfileCheck');
                  } else {
                    navigation.navigate('Cart', {cartId: state.currentCart?.id});
                  }
                }}>
                <WTitle>CHECKOUT ${state.currentCart?.total?.toFixed(2)}</WTitle>
              </CheckoutView>
            ) : (
              <ReceiptBtn>
                <ReceiptImage source={Images.ic_receipt} />
              </ReceiptBtn>
            )}
            <AlertMark onPress={onPressMark}>
              <Mark>?</Mark>
            </AlertMark>
          </View>
        </Header>
        {/* <LocationView onPress={() => onPressLocation()}>
          <SLIcon name="cursor" size={14} color="#9b9b9b" />
          <Address>{address ? address?.toUpperCase() : 'PLEASE SELECT YOUR ADDRESS'}</Address>
        </LocationView> */}
        <SliderView>
          <Animated.View
            style={{
              zIndex: 0,
              opacity: animOpacity,
              height: animHeight,
              width: animWidth,
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              transform: [
                {
                  translateY: animOpacity.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-110, 0],
                  }),
                },
                {
                  translateX: animOpacity.interpolate({
                    inputRange: [0, 1],
                    outputRange: [Dimensions.get('window').width - 75, 0],
                  }),
                },
              ],
            }}>
            <Bg source={items?.[index]?.ad?.images?.iPhone ? {uri: items[index]?.ad?.images?.iPhone} : null} />
          </Animated.View>
          {items?.length > 0 && !state.ad.illegalState && (
            <View style={{flex: 1}}>
              <Swiper
                horizontal
                loop={false}
                showButtons={false}
                key={items?.length}
                style={{}}
                activeDotColor="#000"
                dotColor="#D0D0D0"
                paginationStyle={{bottom: -18}}
                onIndexChanged={(i) => {
                  console.log(i, 'i');
                  index = i;
                }}>
                {items?.length > 0 &&
                  items?.map((i, index) => (
                    <Section key={index.toString()}>
                      <TopView>
                        {/* <LeftView>
                          <Name>{i?.products[0]?.name}</Name>
                          <Desc>{i?.products[0]?.blurb}</Desc>
                          <Price
                            style={
                              !get(state, 'user.redeemedCampaigns', []).find((r) => r.id === i.id) && {
                                textDecorationLine: 'line-through',
                                textDecorationColor: 'red',
                              }
                            }>
                            RRP {formatCurrencyDec(get(i, 'products[0].pricing[0].retailPrice', 0))}
                            <MainSemiBoldFont style={{fontSize: 15}}>
                              {formatCurrencyUnd(get(i, 'products[0].pricing[0].retailPrice', 0))}
                            </MainSemiBoldFont>
                          </Price>
                          {!get(state, 'user.redeemedCampaigns', []).find((r) => r.id === i.id) && (
                            <PriceView>
                              <RealPriceSymbol>$</RealPriceSymbol>
                              <RealPrice>{getSalePrice(i)}</RealPrice>
                            </PriceView>
                          )}
                        </LeftView> */}
                        <RemainView>
                          <RemainText>
                            {state.user.redeemedCampaigns?.find((u) => u.id === i.id)
                              ? `ONLY ${(i.allowedParticipants[1] || 0) - (i.redemptionCount || 0)} LEFT!`
                              : `ONLY ${(i.allowedParticipants[1] || 0) - (i.redemptionCount || 0)} LEFT!`}
                          </RemainText>
                        </RemainView>
                        <View style={{justifyContent: 'flex-end', alignItems: 'flex-end'}}>
                          <ReturnBtn
                            onPress={() => {
                              if (checkForRegister()) {
                                navigation.navigate('ProfileCheck');
                              } else {
                                navigation.navigate('Address');
                              }
                            }}>
                            <ReturnIcon source={Images.ic_return} />
                          </ReturnBtn>
                        </View>
                      </TopView>
                      <Bg source={i?.ads[0]?.images?.iPhone ? {uri: i?.ads[0]?.images?.iPhone} : null} />
                    </Section>
                  ))}
              </Swiper>
            </View>
          )}
          {((state.ad.illegalState === 'LEGAL_STATE' && items?.length === 0) ||
            (items?.length === 0 && !state.ad.illegalState)) && (
            <Image
              source={Images.logo_empty_offer}
              style={{
                width: Dimensions.get('window').width - 43,
                height: '100%',
                borderRadius: 10,
              }}
            />
          )}
          {state.ad.illegalState === 'ILLEGAL_STATE' && items?.length === 0 && (
            <View
              style={{
                width: Dimensions.get('window').width - 43,
                height: '100%',
                backgroundColor: 'black',
                borderRadius: 10,
              }}>
              <Image
                source={Images.not_in_your_area}
                style={{
                  width: '100%',
                  height: '70%',
                  borderTopLeftRadius: 10,
                  borderTopRightRadius: 10,
                  resizeMode: 'cover',
                }}
              />
              <NotView>
                <NotTitle>Oh, no!</NotTitle>
                <NotDesc style={{marginTop: 20}}>
                  Flute is not available in your area! {'\n'}Please check the app again if you travel to another state.
                </NotDesc>
                <NotDesc style={{marginTop: 20}}>
                  Apologies for you the inconvenience. {'\n'}We appreciate your patience.
                </NotDesc>
              </NotView>
            </View>
          )}
        </SliderView>
      </SafeView>
      <Bottom>
        {state.locationPermission === RESULTS.GRANTED ? (
          <BtnView>
            <AddButton onPress={onPressRecipes} style={{marginRight: 5, shadowOffset: {width: 0, height: 2}}}>
              <Title>{items?.length === 0 ? 'FOLLOW US' : 'MORE INFO'}</Title>
            </AddButton>
            {items?.length > 0 ? (
              <AddButton onPress={onPressAdd} style={{shadowOffset: {width: 0, height: 2}, backgroundColor: 'black'}}>
                <Title style={{color: 'white'}}>REDEEM</Title>
              </AddButton>
            ) : null}
          </BtnView>
        ) : (
          <BtnView>
            <AddButton onPress={onPressPermission} style={{marginRight: 5, shadowOffset: {width: 0, height: 2}}}>
              <Title>GRANT LOCATION</Title>
            </AddButton>
          </BtnView>
        )}
        {/* <UnderButton onPress={() => navigation.navigate('Gift')}>
          <UnderTitle>Send Flute Gift Card to a Friend</UnderTitle>
        </UnderButton> */}
      </Bottom>
      {items?.length > 1 && isShow && (
        <Tooltip style={{shadowOffset: {width: 0, height: 5}}}>
          <Body>
            <TooltipTitle>SWIPE FOR MORE OFFERS</TooltipTitle>
          </Body>
          <Arrow source={Images.ic_triangle} width={Sizes.hScale(20)} height={Sizes.hScale(7)} />
        </Tooltip>
      )}
      <DeliverModal showModal={showModal} setModal={setModal} />
      <WebModal
        showModal={showWebModal}
        setModal={setWebModal}
        title={items.length !== 0 ? 'View Recipes' : 'Instagram'}
        url={url}
      />
      <GoodModal showModal={showGoodModal} setModal={(isTrue) => (!isTrue ? setGoodModal(isTrue) : onPressOk())} />
      <Promo
        showModal={isShowPromo}
        setModal={() => {
          setShowPromo(false);
          navigation.navigate('Promo', {campaign: items[index]});
        }}
      />
      <HowModal
        showModal={isShowHow}
        setModal={() => {
          setShowHow(false);
        }}
      />
    </Container>
  );
};

export default Home;

const AlertMark = styled.TouchableOpacity`
  width: 20px;
  height: 20px;
  border-radius: 10px;
  background-color: black;
  align-items: center;
  margin-left: 20px;
`;

const Mark = styled(MainBoldFont)`
  font-size: 14px;
  line-height: 18px;
  color: white;
`;

const NotDesc = styled(MainMediumFont)`
  color: #ddd;
  font-size: 15px;
`;

const NotTitle = styled(MainBoldFont)`
  font-size: 40px;
  color: white;
`;

const NotView = styled.View`
  padding-horizontal: 20px;
  padding-bottom: 20px;
  margin-top: -80px;
`;

const RealPrice = styled(MainBoldFont)`
  color: white;
  font-size: 60px;
  margin-top: -10px;
`;

const PriceView = styled.View`
  flex-direction: row;
  align-items: flex-start;
  margin-top: 5px;
`;

const RealPriceSymbol = styled(MainBoldFont)`
  color: white;
  font-size: 30px;
`;

const Price = styled(MainSemiBoldFont)`
  font-size: 22px;
  color: white;
`;

const Desc = styled(MainMediumFont)`
  color: white;
  font-size: 14px;
`;

const LeftView = styled.View`
  margin-left: 10px;
`;

const Name = styled(MainSemiBoldFont)`
  font-size: 20px;
  color: white;
`;

const ReceiptBtn = styled.TouchableOpacity``;

const ReceiptImage = styled.Image`
  width: 25px;
  height: 25px;
`;

const NoAdText = styled(MainRegularFont)`
  font-size: 35px;
  line-height: 50px;
  text-align: center;
  color: #aaa9a9;
`;

const NoAdView = styled.View`
  flex: 1;
  background-color: white;
  border-radius: 5px;
  ${Styles.center};
`;

const BtnView = styled.View`
  flex-direction: row;
  margin-bottom: 20px;
`;

const ReturnBtn = styled.TouchableOpacity``;

const ReturnIcon = styled.Image`
  width: 30px;
  height: 20px;
  resize-mode: contain;
`;

const TopView = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-horizontal: 8px;
  margin-top: 5px;
  ${Styles.absolute_top}
  top: 15px;
  z-index: 10;
  flex: 1;
  width: 100%;
`;

const Arrow = styled.Image`
  width: ${Sizes.hScale(30)}px
  height: ${Sizes.hScale(7)}px
  resize-mode: contain;
  align-self: center;
`;

const TooltipTitle = styled(MainMediumFont)`
  color: white;
  font-size: 10px;
  line-height: 12px;
  letter-spacing: 1px;
`;
const Body = styled.View`
  background-color: black;
  border-radius: 8px;
  padding-vertical: 11px;
  padding-horizontal: 30px;
`;
const Tooltip = styled.View`
  position: absolute;
  bottom: 123px;
  shadow-opacity: 0.2;
  shadow-radius: 1px;
  shadow-color: black;
  align-self: center;
`;

const RemainView = styled.View`
  border-radius: 7px;
  background-color: white;
  padding-vertical: 4px;
  padding-horizontal: 14px;
`;

const RemainText = styled(MainBoldFont)`
  font-size: 8px;
  line-height: 12px;
  color: #040404;
`;

const Bg = styled.Image`
  border-radius: 5px;
  height: 100%;
  width: ${Dimensions.get('window').width - 44}px;
  resize-mode: stretch;
`;

const Section = styled.View`
  shadow-opacity: 0.1;
  shadow-radius: 20px;
  shadow-color: black;
  width: ${Dimensions.get('window').width - 44}px;
`;

const UnderButton = styled.TouchableOpacity`
  margin-bottom: ${Platform.OS === 'ios' ? 0 : 10};
`;

const SliderView = styled.View`
  margin-top: 12px;
  margin-bottom: 23px;
  flex: 1;
`;

const UnderTitle = styled(MainBoldFont)`
  text-decoration: underline;
  text-decoration-color: #797979;
  color: #797979;
  font-size: 10px;
  line-height: 12px;
  margin-top: 8px;
`;

const Title = styled(MainRegularFont)`
  font-size: 10px;
  line-height: 30px;
  align-self: center;
  color: #000;
  letter-spacing: 4.7px;
`;

const AddButton = styled.TouchableOpacity`
  flex: 1;
  background-color: white;
  padding-vertical: 9px;
  border-radius: 2px;
  shadow-opacity: 0.1;
  shadow-radius: 2px;
  shadow-color: black;
`;
const Bottom = styled.View`
  justify-content: flex-end;
  margin-horizontal: 22px;
  align-items: center;
  margin-bottom: 20px;
`;

const LocationView = styled.TouchableOpacity`
  height: 57px;
  width: 100%;
  background-color: ${Colors.white};
  margin-top: 8px;
  border-radius: 8px;
  shadow-opacity: 0.1;
  shadow-radius: 8px;
  shadow-color: black;
  align-items: center;
  flex-direction: row;
  padding-horizontal: 14px;
`;

const Container = styled.SafeAreaView`
  margin-top: ${Platform.OS === 'ios' ? 10 : 10}
  background-color: #ECECEC;
  flex: 1;
`;

const Avatar = styled.Image`
  width: 30px;
  height: 30px;
  border-radius: 15px;
  resize-mode: cover;
`;

const AvatarView = styled.TouchableOpacity`
  width: 30px;
  height: 30px;
  border-radius: 15px;
  background-color: #dedede;
`;

const SafeView = styled.View`
  margin-horizontal: 22px;
  flex: 1;
`;

const Header = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const WalletView = styled.TouchableOpacity`
  position: absolute;
  left: 0;
  background-color: #000;
  border-radius: 7px;
  padding-horizontal: 7px;
  padding-vertical: 7px;
`;

const WTitle = styled(MainRegularFont)`
  font-size: 9px;
  line-height: 11px;
  color: #fff;
`;

const CheckoutView = styled.TouchableOpacity`
  background-color: #00ce50;
  border-radius: 7px;
  padding-horizontal: 7px;
  padding-vertical: 7px;
`;

const Address = styled(MainRegularFont)`
  margin-left: 11px;
  font-size: 10px;
  line-height: 12px;
  color: #676767;
`;
