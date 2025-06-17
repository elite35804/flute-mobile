import React, {useEffect, useRef, useState} from 'react';
import styled from 'styled-components';
import WheelOfFortune from '@/views/Components/WheelOfFortune'
import CaptureAgeModal from "@/views/Modals/CaptureAgeModal";
import {useOvermind} from "@/store";
import {json} from "overmind";

const Game = (props) => {
  const {state, actions} = useOvermind();
  const [showModal, setModal] = useState(false);
  const [user, setUser] = useState(null);
  const child = useRef(null);
  const afterDone = (user) => {
    setUser(user);
    child.current._onPress()
  }

  const confirmAdd = async (item) => {
    actions.hud.show();
    try {
      const adItem = state.ad?.showAds?.find(s => s.campaign?.id === item?.id);
      if (adItem?.id) {
        const params = {
          userId: state.currentUser?.id,
          impressionId: adItem?.id,
          campaignId: adItem?.campaign?.id,
          adId: adItem?.ad?.id,
          accepted: true,
        };
        console.log('Dismiss Params', params);
        await actions.ad.dismissAd(params);
      }

      let saveCartParams = null;
      const itemIndex = state.currentCart?.items?.findIndex(i => i.product?.id === item?.products[0]?.id);
      if (itemIndex > -1) {
        saveCartParams = {
          findMarketplace: true,
          updateItems: [{
            quantity: state.currentCart?.items[itemIndex]?.quantity + 1,
            productId: state.currentCart?.items[itemIndex]?.product?.id,
            deliverBy: state.currentCart?.items[itemIndex]?.deliverBy,
            deliverTo: {id: state.currentCart?.items[itemIndex]?.deliverTo?.id},
            id: state.currentCart?.items[itemIndex]?.id
          }], cartId: state.currentCart.id
        }
      } else if (state.currentCart?.id) {
        saveCartParams = {
          findMarketplace: true,
          addItems: [{
            quantity: 1,
            productId: item?.products[0]?.id,
            deliverBy: state.currentCart?.items[0]?.deliverBy,
            deliverTo: {id: state.currentCart?.items[0]?.deliverTo?.id},
          }], cartId: state.currentCart?.id
        }
      } else {
        saveCartParams = {
          findMarketplace: true,
          addItems: [{
            quantity: 1,
            productId: item?.products[0]?.id,
            deliverBy: new Date(),
            deliverTo: {id: state.currentUser?.site?.id}
          }]
        }
      }
      await actions.cart.saveCart({findMarketplace: true}, ...saveCartParams);
      props.navigation.navigate('Main');
    } catch (e) {
      console.log(e);
    } finally {
      actions.hud.hide();
    }
  }

  console.log(state, 'state')
  return (
    <Container>
      <WheelOfFortune
        onRef={child}
        rewards={json(state.ad?.adByLocation).filter(o => !json(state.user.redeemedCampaigns).find(r => r.id === o.id))}
        knobSize={20}
        borderWidth={3}
        borderColor={"#FFF"}
        backgroundColor={'red'}
        innerRadius={5}
        textColor={'#FFF'}
        getWinner={async (value, index) => {
          console.log(value, index);
          await confirmAdd(value);

          // if (!this.state.user?.fullName || !this.state.user?.email || !this.state.user?.gender) {
          //   this.props.navigation.navigate('ProfileCheck')
          // } else {
          //   this.props.navigation.navigate('Main')
          // }
        }}
      />
      <CaptureAgeModal showModal={showModal} setModal={() => setModal(false)} done={afterDone}/>
    </Container>)
};

export default Game;

const Container = styled.SafeAreaView`
  flex: 1;
    alignItems: center;
    justifyContent: center;
  background-color: rgba(0,0,0,0.5)
`
