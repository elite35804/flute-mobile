import React, {useRef, useState} from 'react';
import {Image, Platform, TouchableOpacity, View} from 'react-native';
import styled from 'styled-components';
import {json} from 'overmind';
import {useOvermind} from '@/store';
import {Styles} from '@/styles';
import FTIcon from 'react-native-vector-icons/Feather';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import {MainMediumFont, MainRegularFont, MainSemiBoldFont} from '@/views/Components';
import LottieView from 'lottie-react-native';
import {get} from 'lodash';
import WebModal from '@/views/Modals/WebModal';

const WalletAd = (props) => {
  const {state, actions} = useOvermind();
  const [flute, setFlute] = useState(json(state.ad.fluteAd));
  const [isHowItWorksVisible, setIsHowItWorksVisible] = useState(false);
  const [isUniversalVisible, setIsUniversalVisible] = useState(false);
  const howItWorkView = useRef(null);
  const universalView = useRef(null);
  const [showWebModal, setShowWebModal] = useState(false);
  const [url, setUrl] = useState(null);
  const onPressCloseRedeem = () => {
    setIsHowItWorksVisible(false);
    setIsUniversalVisible(false);
  };

  const onPressRecipe = () => {
    console.log(flute);
    setUrl(flute?.ad?.recipeUrl);
    setShowWebModal(true);
  };

  const _showUniversal = () => {
    setIsUniversalVisible(true);
    setIsHowItWorksVisible(false);

    const view = universalView.current;

    view && view.reset();
    view && view.play();
  };

  const _showHowItWorks = () => {
    setIsUniversalVisible(false);
    setIsHowItWorksVisible(true);
    const view = howItWorkView.current;

    view && view.reset();
    view && view.play();
  };

  const _onPressRedeem = () => {
    setIsHowItWorksVisible(true);

    const view = howItWorkView.current;

    view && view.reset();
    view && view.play();
  };

  const onPressReceipt = async () => {
    try {
      const result = await actions.ad.adRedeemeds({where: {rebateWalletPayment: {id: flute.id}}});
      console.log(result.adRedeemeds[0].universalData.image);
      props.navigation.navigate('Preview', {image: result?.adRedeemeds[0].universalData.image});
    } catch (e) {
      console.log(e);
    }
  };

  const onPressAddress = async () => {
    let placeId = null;
    // await this._locPopup.open({
    //   address: gs.location.search.address2.long,
    //   isAd: true,
    //   onGetId: async (id) => {
    //     placeId = id;
    //     try {
    //       await this._requestAccept(placeId, this.flute.campaign.id, this.flute.ad.id, this.flute.campaign.site.id);
    //     } catch (e) {
    //       console.log(e, 'Accept failed')
    //     }
    //     // await this._typePopup.open({
    //     //   onConfirm: (type) => {
    //     //     if (type === 0) navigation.navigate({ name: routes.names.app.paymentAddBankAccount })
    //     //     else if (type === 1) navigation.navigate({ name: routes.names.app.paymentAddPayPalAccount })
    //     //     else if (type === 2) navigation.navigate({ name: routes.names.app.paymentAddZelleAccount })
    //     //     else if (type === 3) this._onPressFluteWallet()
    //     //   }
    //     // });
    //   },
    // });
  };
  // const isDelivery = get(flute, 'campaign.isDelivery', false);
  const isDelivery = !!(flute?.campaign && flute?.campaign?.isDelivery);
  const isSent = get(flute, 'sentFrom.id', '') === state.currentUser.id;
  const isCampaign = flute?.isCampaign;
  const isDebit = !isCampaign && (flute?.usedOnTab || flute?.usedForGift || flute?.usedForSplit);
  const isFlute = !isCampaign && !isDebit;
  const isAccepted = flute?.isAccepted;
  console.log(isHowItWorksVisible, isUniversalVisible, isDelivery);
  return (
    <Container>
      <Image
        source={flute?.ad?.images?.iPhone ? {uri: flute?.ad?.images?.iPhone} : null}
        style={{flex: 1, alignSelf: 'stretch', marginBottom: 100, resizeMode: 'stretch'}}
      />
      <BackBtn onPress={() => props.navigation.pop()}>
        <BackButton onPress={() => props.navigation.pop()}>
          <BackText>
            {Platform.OS === 'ios' ? (
              <FTIcon name="arrow-left" size={20} color="black" />
            ) : (
              <FAIcon name="arrow-left" size={20} color="black" />
            )}
          </BackText>
        </BackButton>
      </BackBtn>
      {(isHowItWorksVisible || isUniversalVisible) && (
        <BackBtn onPress={onPressCloseRedeem}>
          <TouchableOpacity style={{alignSelf: 'flex-start', marginLeft: 5, zIndex: 9999}} onPress={onPressCloseRedeem}>
            <BackTitle>
              {Platform.OS === 'ios' ? (
                <FTIcon name="x" size={20} color="black" />
              ) : (
                <FAIcon name="x" size={20} color="black" />
              )}
            </BackTitle>
          </TouchableOpacity>
        </BackBtn>
      )}
      {!isDelivery && (
        <View>
          <WorkView isVisible={isHowItWorksVisible}>
            <SubView>
              <View style={{flex: 1}}>
                <View style={{flex: 1}} />
                <LotView style={{shadowOffset: {width: 0, height: 3}}}>
                  <LottieView ref={howItWorkView} loop={false} speed={2} source={require('./supplier.json')} />
                </LotView>
              </View>
            </SubView>
          </WorkView>
        </View>
      )}
      {!isDelivery && (
        <View>
          <WorkView isVisible={isUniversalVisible}>
            <SubView>
              <View style={{flex: 1}}>
                <View style={{flex: 1}} />
                <LotView style={{shadowOffset: {width: 0, height: 3}}}>
                  <LottieView
                    ref={universalView}
                    loop={false}
                    speed={2}
                    source={require('./universal-redemption.json')}
                  />
                </LotView>
              </View>
            </SubView>
          </WorkView>
        </View>
      )}
      {isDelivery && (
        <Bottom>
          {flute?.isRedeemed && (
            <ReBtn onPress={onPressAddress}>
              <ReText>PURCHASE / GIFT</ReText>
            </ReBtn>
          )}
          {isFlute && !isSent && isAccepted && flute.isRebate ? (
            <ReBtn style={{backgroundColor: 'white', borderWidth: 1, borderColor: '#ccc'}} onPress={onPressReceipt}>
              <ViewText>VIEW RECEIPT</ViewText>
            </ReBtn>
          ) : (
            <ReBtn style={{backgroundColor: 'white', borderWidth: 1, borderColor: '#ccc'}} onPress={onPressRecipe}>
              <ViewText>VIEW WEBSITE</ViewText>
            </ReBtn>
          )}
        </Bottom>
      )}

      {!isDelivery &&
        (isHowItWorksVisible ? (
          <Bottom>
            {flute?.isRedeemed && (
              <ReBtn onPress={_showUniversal}>
                <ReText>REDEEM ANYWHERE</ReText>
              </ReBtn>
            )}
            <ReBtn style={{backgroundColor: 'white', borderWidth: 1, borderColor: '#ccc'}} onPress={onPressRecipe}>
              <ViewText>VIEW DRINK RECIPES</ViewText>
            </ReBtn>
          </Bottom>
        ) : isUniversalVisible ? (
          <Bottom>
            {flute?.isRedeemed && (
              <ReBtn onPress={_showHowItWorks}>
                <ReText>REDEEM IN-APP</ReText>
              </ReBtn>
            )}
            <ReBtn style={{backgroundColor: 'white', borderWidth: 1, borderColor: '#ccc'}} onPress={onPressRecipe}>
              <ViewText>VIEW DRINK RECIPES</ViewText>
            </ReBtn>
          </Bottom>
        ) : (
          <Bottom>
            {flute?.isRedeemed && (
              <ReBtn onPress={_onPressRedeem}>
                <ReText>REDEEM OFFER</ReText>
              </ReBtn>
            )}
            <ReBtn style={{backgroundColor: 'white', borderWidth: 1, borderColor: '#ccc'}} onPress={onPressRecipe}>
              <ViewText>VIEW DRINK RECIPES</ViewText>
            </ReBtn>
          </Bottom>
        ))}
      <WebModal showModal={showWebModal} setModal={setShowWebModal} title="" url={url} />
    </Container>
  );
};

const ViewText = styled(MainMediumFont)`
  font-size: 12px;
  color: black;
`;

const ReText = styled(MainRegularFont)`
  font-size: 12px;
  color: white;
  letter-spacing: 3;
  align-self: stretch;
  text-align: center;
`;

const ReBtn = styled.TouchableOpacity`
  background-color: #c3922c;
  height: 35px;
  border-radius: 2px;
  margin-horizontal: 10px;
  margin-bottom: 10px;
  align-items: center;
  justify-content: center;
  align-self: stretch;
`;

const Bottom = styled.View`
  ${Styles.absolute_bottom};
  padding-bottom: 20px;
  ${Styles.end_center};
  height: 120px;
`;

const LotView = styled.View`
  background-color: white;
  flex: 9;
  ${Styles.content_center};
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
  shadow-opacity: 0.7;
  shadow-radius: 7px;
  shadow-color: black;
`;

const SubView = styled.View`
  margin-top: 80px;
  flex: 1;
  margin-horizontal: 10px;
  background-color: transparent;
`;

const WorkView = styled.View`
  ${Styles.absolute_full}
  bottom: 85px;
  opacity: ${(props) => (props.isVisible ? 1 : 0)}
  margin-bottom: 20px;
`;

const BackTitle = styled(MainSemiBoldFont)`
  font-size: 12px;
  color: black;
`;

const BackText = styled(MainSemiBoldFont)`
  font-size: 12px;
  color: black;
`;

const BackBtn = styled.TouchableOpacity`
  position: absolute;
  paddingtop: 6px;
  paddingleft: 3px;
  borderradius: 25px;
  height: 35px;
  width: 35px;
  top: 50px;
  left: 20px;
  zindex: 100;
  backgroundcolor: white;
`;

const BackButton = styled.TouchableOpacity`
  align-self: flex-start;
  margin-left: 5px;
  z-index: 9999;
  width: 35px;
  height: 35px;
  border-radius: 20px;
  ${Styles.center}
  background-color: white;
  margin-top: -20px;
`;
const Container = styled.SafeAreaView`
  ${Styles.match_parent}
  ${Styles.end_center}
  background-color: white;
`;

export default WalletAd;
