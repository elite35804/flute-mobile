import React, {useEffect, useState} from 'react';
import {Image, Platform, StatusBar, View} from 'react-native';
import styled from 'styled-components';
import {Styles} from '@/styles';
import {Images} from '@/styles/Images';
import SLIcon from 'react-native-vector-icons/SimpleLineIcons';
import {MainMediumFont, MainSemiBoldFont, StyledText} from '@/views/Components';
import {useOvermind} from '@/store';
import numeral from 'numeral';
import {json} from 'overmind';
import {get} from 'lodash';
import moment from 'moment';
import {formatCurrencyDec, formatCurrencyUnd} from '@/utils/NumberUtil';
import {defaultAvatar} from '@/utils/Utils';
import {ModalHeader} from '@/views/Components/ModalHeader';
import RebateModal from '@/views/Modals/RebateModal';

const Wallet = (props) => {
  const {state, actions} = useOvermind();
  const {user, currentUser} = state;
  const [keyword, setKeyword] = useState('');
  const [filtered, setFiltered] = useState([]);
  const [showModal, setModal] = useState(false);
  const [balance, setBalance] = useState(state.currentUser?.balance);

  useEffect(() => {
    setTimeout(() => _filterWallets(''), 1000);
  }, []);

  useEffect(() => {
    if (balance !== state.currentUser?.balance) {
      setBalance(state.currentUser?.balance);
    }
  }, [state.currentUser]);

  const _filterWallets = (keyword) => {
    if (keyword.length === 0) {
      setFiltered(json(user.transactions));
    } else {
      keyword = keyword.trim().toLowerCase();
      setFiltered(
        user.transactions.filter((c) => {
          if (c.ad !== null) return c.ad.drinkName.toLowerCase().indexOf(keyword) >= 0;

          if (c && c.split && c.split.fullName.toLowerCase().indexOf(keyword) >= 0) return true;
          if (c && c.sentTo && c.sentTo.fullName.toLowerCase().indexOf(keyword) >= 0) return true;
          if (c && c.sentFrom && c.sentFrom.fullName.toLowerCase().indexOf(keyword) >= 0) return true;
          return !!(c && c.flute && c.flute.sentTo && c.flute.sentTo.fullName.toLowerCase().indexOf(keyword) >= 0);
        })
      );
    }
  };

  const _onChangeKeyword = (key) => {
    setKeyword(key);
    _filterWallets(key);
  };

  const onPressWallet = (item) => {
    if (item.isCampaign || item.isRebate) {
      actions.ad.setFluteAd(item);
      props.navigation.navigate('WalletAd');
    }
  };

  const Item = ({item, index, currentUser}) => {
    const isSent = get(item, 'sentFrom.id', '') === currentUser.id;
    const isCampaign = item.isCampaign;
    const isDebit = !isCampaign && (item.usedOnTab || item.usedForGift || item.usedForSplit);
    const isFlute = !isCampaign && !isDebit;
    const isAccepted = item.isAccepted;
    const isExpired = item.isExpired;
    const isPending = !isAccepted && !isExpired && item.isPending;
    const isDeclined = !isAccepted && !isExpired && !isPending;
    const isRedeemed = item.numberOfItemsRedeemed >= item.numberOfItems && item.numberOfItems;
    const user = isSent ? item.sentTo : item.sentFrom;
    const mcreate = moment(item.createdAt);
    const amount = isDebit || item?.isWithdrawal ? item.totalCost : item.dueToReceiver;
    const remainderDrinks = item.numberOfItems - item.numberOfItemsRedeemed;
    const isDelivery = !!(item.campaign && item.campaign.isDelivery);
    const isWithdrawal = item.isWithdrawal;

    var itemLabel = 'Drink';
    var itemLabelPlural = 'Drinks';

    if (item.campaign && item.campaign.itemLabel && item.campaign.itemLabelPlural) {
      itemLabel = item.campaign.itemLabel;
      itemLabelPlural = item.campaign.itemLabelPlural;
    }

    let sign = '';
    if (item?.isWithdrawal) sign = '- ';
    else if (!isCampaign && isFlute && (!isSent || !isAccepted) && !isPending && !isDeclined) sign = '+ ';
    else if (item.isRebate) sign = '+ ';
    else if (!isCampaign && isFlute && isSent && isAccepted) sign = '- ';
    else if (isDebit) sign = '- ';
    // if(!isDebit && isSent) return null; // its new one d
    if (isRedeemed) return null;

    if (isCampaign && !isDelivery) return null;
    // if (isFlute && !isSent && isAccepted && !item.isRebate) return null;

    return (
      <ItemBtn onPress={() => onPressWallet(item)}>
        <LogoView>
          {isDebit && <Image source={Images.logo_wallet} style={{width: 50, height: 50}} />}
          {!isDebit && !isSent && isWithdrawal && (
            <Image
              source={defaultAvatar(get(item, 'sentTo', ''))}
              style={{width: 35, height: 35, borderRadius: 20, backgroundColor: '#ddd'}}
            />
          )}
          {!isDebit && isSent && (
            <Image
              source={defaultAvatar(get(item, 'sentFrom', ''))}
              style={{width: 35, height: 35, borderRadius: 20, backgroundColor: '#ddd'}}
            />
          )}
          {!isDebit && isSent && (
            <Image
              source={Images.ic_wallet_sent}
              style={{position: 'absolute', right: 0, bottom: 0, width: 34, height: 34}}
            />
          )}

          {!isDebit && !isSent && !isWithdrawal && (
            <Image
              source={
                isCampaign || item.isRebate
                  ? {uri: get(item, 'ad.images.iPhone')}
                  : isFlute && !isSent && isAccepted && item.isRebate
                  ? Images.ic_no_user
                  : defaultAvatar(get(item, 'sentFrom', ''))
              }
              style={{width: 35, height: 35, borderRadius: 20, backgroundColor: '#ddd'}}
            />
          )}
        </LogoView>
        <ItemBody>
          <Name>
            {isFlute &&
              !item.isRebate &&
              (item?.isWithdrawal ? `Deposited to •••• ${item?.rebateMethod?.last4}` : `${user?.firstName || ''}`)}
            {isFlute && !isSent && isAccepted && item.isRebate && !isDelivery && item.campaign && item.campaign.title}
            {isFlute && !isSent && isAccepted && item.isRebate && isDelivery && item.campaign && item.campaign.title}
            {isCampaign && `${get(item, 'campaign.title', '')}`}
            {isDebit && 'Flute Wallet'}
          </Name>
          <Desc>
            {isDebit && item.usedOnTab && `${get(item, 'venue.name', '')} @ ${mcreate.format('h:mma')}`}
            {isDebit && item.usedForGift && `Flute for ${get(item, 'flute.sentTo.firstName', '')}`}
            {isDebit && item.usedForSplit && `Split tab with ${get(item, 'split.fullName', '')}`}
            {isFlute && isPending && `Pending...`}
            {isFlute && isSent && isAccepted && 'Accepted your offer'}
            {isFlute && isSent && isDeclined && 'Declined your offer'}
            {isFlute && isSent && isExpired && 'Offer Expired'}
            {/* {isFlute && !isSent && isAccepted && !item.isRebate && 'You accepted'} */}
            {isFlute && !isSent && isAccepted && item.isRebate && !isDelivery && 'Instant Rebate'}
            {isFlute && !isSent && isAccepted && item.isRebate && isDelivery && item.usedOnOrder && 'Flute Rebate'}
            {isFlute && !isSent && isAccepted && item.isRebate && isDelivery && 'Manual Redemption Rebate'}
            {isFlute && !isSent && isDeclined && 'You declined'}
            {item?.isWithdrawal && 'Wallet Withdrawal'}

            {/* {isCampaign &&
              !isExpired &&
              item.numberOfItemsRedeemed === 0 &&
              item.numberOfItems === 1 &&
              !isDelivery &&
              `Good for ${item.numberOfItems} ${itemLabel}`} */}
            {/* {isCampaign &&
              !isExpired &&
              item.numberOfItemsRedeemed === 0 &&
              item.numberOfItems > 1 &&
              !isDelivery &&
              `Good for ${item.numberOfItems} ${itemLabelPlural}`} */}
            {/* {isCampaign &&
              !isExpired &&
              item.numberOfItemsRedeemed > 0 &&
              item.numberOfItems === 1 &&
              !isDelivery &&
              `Redeemed ${item.numberOfItemsRedeemed} of ${item.numberOfItems} ${itemLabel}`}
            {isCampaign &&
              !isExpired &&
              item.numberOfItemsRedeemed > 0 &&
              item.numberOfItems > 1 &&
              !isDelivery &&
              `Redeemed ${item.numberOfItemsRedeemed} of ${item.numberOfItems} ${itemLabelPlural}`} */}
            {isCampaign && isExpired && 'Drink Offer Expired'}
          </Desc>
        </ItemBody>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start'}}>
            {isCampaign && !isDelivery && remainderDrinks === 0 && (
              <Detail>
                {remainderDrinks} {itemLabelPlural}
              </Detail>
            )}
            {isCampaign && !isDelivery && remainderDrinks === 1 && (
              <Detail>
                {remainderDrinks} {itemLabel}
              </Detail>
            )}
            {isCampaign && !isDelivery && remainderDrinks > 1 && (
              <Detail>
                {remainderDrinks} {itemLabelPlural}
              </Detail>
            )}
            {sign && <Detail style={{fontSize: 15, marginTop: -2}}>{sign}</Detail>}
            {!isCampaign && <Detail style={{fontSize: 10}}>$</Detail>}
            {!isCampaign && <Detail style={{fontSize: 15, marginTop: -2}}>{formatCurrencyDec(amount, '0,0')}</Detail>}
            {!isCampaign && <Detail style={{fontSize: 9, marginLeft: 3}}>{formatCurrencyUnd(amount)}</Detail>}
          </View>
          {!isDelivery && <Desc style={{fontSize: 14}}>{mcreate.format('MM/DD')}</Desc>}
          {/* {isDelivery && !isRedeemed && (
            <View style={{paddingHorizontal: 16, paddingVertical: 4, borderWidth: 1, borderColor: 'black', borderRadius: 20}}>
              <Detail style={{fontSize: 9}}>ORDER</Detail>
            </View>
          )} */}
          {isDelivery && isRedeemed && <Desc style={{fontSize: 12}}>ORDERED</Desc>}
          {isDelivery && isRedeemed && <Desc style={{fontSize: 14}}>{mcreate.format('MM/DD')}</Desc>}
        </View>
      </ItemBtn>
    );
  };

  const renderList = () => {
    if (typeof user.transactions === 'undefined') actions.hud.show();
    else actions.hud.hide();

    let transactions = !filtered ? json(user.transactions) : filtered;
    if (transactions.length > 0) {
      transactions = transactions.filter((item) => {
        const isAccepted = item.isAccepted;
        const isExpired = item.isExpired || false;
        const isSent = get(item, 'sentFrom.id', '') === currentUser.userId;
        const isCampaign = item.isCampaign;
        const isDebit = !isCampaign && (item.usedOnTab || item.usedForGift || item.usedForSplit);
        const isFlute = !isCampaign && !isDebit;
        const isPending = !isAccepted && !isExpired && item.isPending;
        const isDeclined = !isAccepted && !isExpired && !isPending;

        return ((isAccepted || isExpired) && !isPending && !isDeclined) || (isDebit && isSent);
      });

      return (
        <WalletList
          removeClippedSubviews
          data={transactions}
          initialNumToRender={10}
          keyExtractor={(item, index) => `wallets_${index}`}
          renderItem={(props) => <Item {...props} currentUser={currentUser} />}
          ListEmptyComponent={() => (
            <NoView>
              <NoText>No results found</NoText>
            </NoView>
          )}
        />
      );
    }
  };
  return (
    <Container>
      <Bg source={Images.bg_setting} />
      <ModalHeader title={'Wallet'} description={'Funds available to you'} {...props} />
      <Balance>
        <BgView>
          <Image source={Images.btn_wallet_price} style={{width: '100%', height: 120}} />
        </BgView>
        <Title>AVAILABLE NOW</Title>
        <BBody>
          <Title style={{fontSize: 24}}>$</Title>
          <Title style={{fontSize: 48, marginVertical: -8}}>{formatCurrencyDec(balance, '0')}</Title>
          <Title style={{fontSize: 24, marginLeft: 5}}>{formatCurrencyUnd(balance)}</Title>
        </BBody>
        <RebateBtn onPress={() => (balance > 1 ? setModal(true) : {})} isClickable={balance > 1}>
          <RebateText isClickable={balance > 1}>WITHDRAW REBATE</RebateText>
        </RebateBtn>
      </Balance>
      <Search>
        <SearchInput
          placeholder="Search Wallet"
          placeholderTextColor="#929292"
          returnKeyType="done"
          value={keyword}
          onChangeText={_onChangeKeyword}
        />
        <SLIcon name="magnifier" color="#929292" size={22} style={{marginRight: 10}} />
      </Search>
      {renderList()}
      <RebateModal showModal={showModal} setModal={setModal} />
    </Container>
  );
};

const RebateText = styled(StyledText)`
  font-weight: 500;
  font-size: 12px;
  color: ${(props) => (props.isClickable ? 'white' : '#80808050')};
  align-self: center;
  margin-top: 1px;
`;

const RebateBtn = styled.TouchableOpacity`
  width: 158px;
  height: 20px;
  border-width: 1px;
  border-color: ${(props) => (props.isClickable ? 'white' : '#80808050')};
  border-radius: 20px;
  margin-bottom: 11px;
  margin-top: 12px;
`;

const Detail = styled(MainSemiBoldFont)`
  font-size: 13px;
  color: black;
`;

const Desc = styled(MainMediumFont)`
  font-style: italic;
  color: #888;
  font-size: 13px;
`;

const Name = styled(MainMediumFont)`
  font-size: 14px;
  color: black;
`;
const ItemBody = styled.View`
  flex: 1;
  ${Styles.start_start}
  margin-left: 20px;
`;

const LogoView = styled.View`
  ${Styles.center_start}
  width: 50px;
  height: 50px;
`;

const ItemBtn = styled.TouchableOpacity`
  padding-horizontal: 20px;
  padding-vertical: 15px;
  border-bottom-width: 1px;
  border-color: #e1e1e1;
  flex-direction: row;
  align-items: center;
`;

const WalletList = styled.FlatList`
  align-self: stretch;
  background-color: white;
`;

const NoText = styled(MainMediumFont)`
  color: #929292;
  font-size: 20px;
`;

const NoView = styled.View`
  ${Styles.center}
  padding-top: ${StatusBar.currentHeight};
`;

const SearchInput = styled.TextInput`
  margin-right: 10px;
  font-family: Montserrat-Medium;
  color: black;
  font-size: 15px;
  width: 70%;
  margin-left: 10px;
`;

const Search = styled.View`
  flex-direction: row;
  border-top-width: 1px;
  border-bottom-width: 1px;
  border-color: #c8c8c8;
  height: 52px;
  padding-horizontal 10px;
  z-index: 10;
  align-items: center;
  justify-content: space-between;
  background-color: white;
`;

const BBody = styled.View`
  flex-direction: row;
  ${Styles.center_start};
`;

const Title = styled(MainMediumFont)`
  font-size: 10px;
  color: white;
`;

const BgView = styled.View`
  ${Styles.absolute_full}
  overflow: hidden;
  background-color: white;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
`;

const Balance = styled.View`
  align-self: stretch;
  padding-top: 20px;
  z-index: 9;
  margin-horizontal: 35px;
  ${Styles.center}
  height: 120px;
  shadow-color: rgba(0,0,0,0.4);
  shadow-opacity: 1;
  shadow-radius: 8px;
  shadow-offset: {width: 0, height: 0};
  elevation: 6;
`;

const Bg = styled.Image`
  ${Styles.absolute_full}
  width: 100%;
  height: 100%;
`;

const Container = styled.View`
  ${Styles.match_parent}
  background-color: white;
`;
export default Wallet;
