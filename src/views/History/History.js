import React, { useEffect, useState } from 'react';
import { Image, View } from 'react-native';
import styled from 'styled-components';
import { Styles } from '@/styles';
import { Images } from '@/styles/Images';
import SLIcon from 'react-native-vector-icons/SimpleLineIcons';
import { MainMediumFont, MainSemiBoldFont } from '@/views/Components';
import { useOvermind } from '@/store';
import { json } from 'overmind';
import { get, isEmpty } from 'lodash';
import moment from 'moment';
import { formatCurrencyDec, formatCurrencyUnd } from '@/utils/NumberUtil';
import md_venue from '@/model/md_venue';
import { defaultAvatar } from '@/utils/Utils';
import { SwipeListView } from 'react-native-swipe-list-view';
import { ModalHeader } from '@/views/Components/ModalHeader';

const History = (props) => {
  const { state, actions } = useOvermind();
  const { user, currentUser, order } = state;
  const [keyword, setKeyword] = useState('');
  const [filteredTabs, setTabs] = useState(null);
  const [filteredFlutes, setFlutes] = useState(null);
  const [mounted, setMounted] = useState(true);
  const [tab, setTab] = useState(props.route.params?.isFlute ? 'flutes' : 'tabs');
  const [orders, setOrders] = useState(order.formattedOrders);
  let tabs = [];
  let flutes = [];

  useEffect(() => {
    setMounted(true);
    requestTabs(json(state.user.tabs));
    requestFlutes(json(state.user.transactions));
  }, []);

  const _onPressTab = (clickedTab) => {
    if (tab === clickedTab) return;
    setTab(clickedTab);
  };

  const requestTabs = async (data) => {
    try {
      tabs = data;
      if (tabs) tabs.forEach((el) => md_venue(el.venue));
      tabs = tabs.concat(orders);
      setTabs(tabs);
    } catch (ex) {
      console.log(ex);
      tabs = [];
    }
    // if (mounted) setTabs(_filterTabs(keyword));
  };

  const _filterTabs = (keyword) => {
    keyword = (keyword || '').trim().toLowerCase();
    if (isEmpty(keyword)) return json(state.user.tabs);

    return tabs.filter((tab) => {
      const item = tab.venue;
      if (item && item.name && item.name.toLowerCase().indexOf(keyword) >= 0) return true;
      if (
        item &&
        item.address &&
        item.address.streetAddress1 &&
        item.address.streetAddress1.toLowerCase().indexOf(keyword) >= 0
      )
        return true;
      return false;
    });
  };
  const requestFlutes = async (data) => {
    try {
      if (!data) return;
      data = data.filter((item) => {
        const isAccepted = item.isAccepted;
        const isExpired = item.isExpired;
        const isPending = !isAccepted && !isExpired && item.isPending;
        const isDeclined = !isAccepted && !isExpired && !isPending;
        return (isAccepted || isExpired) && !isPending && !isDeclined;
      });
      flutes = data;
      if (flutes) flutes.forEach((el) => md_venue(el.venue));
      setFlutes(flutes);
    } catch (ex) {
      console.log(ex);
      flutes = [];
    }
    if (mounted) setFlutes(_filterFlutes(this.state.keyword));
  };

  const _filterFlutes = (keyword) => {
    keyword = (keyword || '').trim().toLowerCase();
    if (isEmpty(keyword)) return json(state.user.transactions);

    return flutes.filter((flute) => {
      const isSent = flute.sentFrom === state.currentUser.id;
      const user = isSent ? flute.sentToUser : flute.sentFromUser;
      const name = `${user.firstName}`.toLowerCase();
      return name.indexOf(keyword) >= 0;
    });
  };

  const _onChangeKeyword = (key) => {
    setKeyword(key);
    setTabs(_filterTabs(key).concat(_filterOrders(key)));
    setFlutes(_filterFlutes(key));
  };

  const _filterOrders = (value) => {
    if (value.length > 0) {
      const filteredItems = order.formattedOrders.filter(
        (i) =>
          i.data.findIndex(
            (d) =>
              d?.product?.name?.toLowerCase().includes(value?.toLowerCase()) ||
              d?.deliverBy?.toString()?.includes(value)
          ) > -1
      );
      setOrders(filteredItems);
      return filteredItems;
    } else {
      setOrders(order.formattedOrders);
      return order.formattedOrders;
    }
  };

  const onPressTabItem = (item) => {
    // gs.context.tab = item;
    // navigation.navigate({ name: routes.names.app.tabDetail });
  };

  const onPressFluteItem = (item) => {
    if (item.isCampaign || item.isRebate) {
      actions.ad.setFluteAd(item);
      props.navigation.navigate('WalletAd');
    }
  };

  const onPressItem = (item) => props.navigation.navigate('CartSuccess', { orderId: item?.id, isReceipt: true });

  const TabItem = ({ item, index, currentUser }) => {
    console.log(item);
    const mcreate = moment(item?.closedAt);
    return item?.raw ? (
      <ItemContainer onPress={() => onPressItem(item.raw)}>
        <Logo
          source={item.data[0]?.product?.images[0]?.url ? { uri: item.data[0]?.product?.images[0]?.url } : null}
          defaultSource={Images.ic_placeholder}
        />
        <Title>{item.deliverBy}</Title>
        <Right>
          <SLIcon name="arrow-right" color={'black'} size={14} />
        </Right>
      </ItemContainer>
    ) : (
      <ItemBtn onPress={() => onPressTabItem(item)}>
        <Image
          source={item?.venue?.avatar ? { uri: item?.venue?.avatar } : null}
          style={{ width: 50, height: 50, borderRadius: 25 }}
        />
        <View style={{ marginLeft: 20, flex: 1 }}>
          <ItemText>
            {get(item, 'venue.name', '')}
            {item?.splitWith && item?.splitWith.length > 0 && ' (Split)'}
          </ItemText>
          <ItemText style={{ fontSize: 12, color: '#999' }}>{get(item, 'venue.address', '')}</ItemText>
        </View>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ justifyContent: 'flex-start', alignItems: 'flex-start', flexDirection: 'row' }}>
            <Price style={{ fontSize: 11 }}>$</Price>
            <Price style={{ fontSize: 15, marginTop: -2 }}>{formatCurrencyDec(item?.total, '0,0')}</Price>
            <Price style={{ fontSize: 11, marginLeft: 2 }}>{formatCurrencyUnd(item?.total)}</Price>
          </View>
          <ItemText style={{ color: '#999', fontSize: 12 }}>{mcreate.format('MM/DD')}</ItemText>
        </View>
      </ItemBtn>
    );
  };
  const FluteItem = ({ item, index, currentUser }) => {
    const isSent = get(item, 'sentFrom.id', '') === currentUser.id;
    const isCampaign = item.isCampaign;
    const isDebit = !isCampaign && (item.usedOnTab || item.usedForGift || item.usedForSplit);
    const isFlute = !isCampaign && !isDebit;
    const isAccepted = item.isAccepted;
    const isExpired = item.isExpired;
    const isPending = !isAccepted && !isExpired && item.isPending;
    const isDeclined = !isAccepted && !isExpired && !isPending;
    const isRedeemed = item.isRedeemed;
    const user = isSent ? item.sentTo : item.sentFrom;
    const mcreate = moment(item.createdAt);
    const amount = isDebit ? item.totalCost : item.dueToReceiver;
    const remainderDrinks = item.numberOfItems - item.numberOfItemsRedeemed;
    const isDelivery = !!(item.campaign && item.campaign.isDelivery);

    let itemLabel = 'Drink';
    let itemLabelPlural = 'Drinks';

    if (item.campaign && item.campaign.itemLabel && item.campaign.itemLabelPlural) {
      itemLabel = item.campaign.itemLabel;
      itemLabelPlural = item.campaign.itemLabelPlural;
    }

    let sign = '';
    if (!isCampaign && isFlute && (!isSent || !isAccepted) && !isPending && !isDeclined) sign = '+ ';
    else if (!isCampaign && isFlute && isSent && isAccepted) sign = '- ';
    else if (isDebit) sign = '- ';

    if (!isDebit && isSent) return null;

    return (
      <ItemBtn onPress={() => onPressFluteItem(item)} activeOpacity={1}>
        <LogoView>
          {isDebit && <Image source={Images.logo_wallet} style={{ width: 50, height: 50 }} />}
          {!isDebit && isSent && (
            <Image
              source={defaultAvatar(get(item, 'sentFrom', ''))}
              style={{ width: 35, height: 35, borderRadius: 20, backgroundColor: '#ddd' }}
            />
          )}
          {!isDebit && isSent && (
            <Image
              source={Images.ic_wallet_sent}
              style={{ position: 'absolute', right: 0, bottom: 0, width: 34, height: 34 }}
            />
          )}

          {!isDebit && !isSent && (
            <Image
              source={
                isCampaign || item.isRebate
                  ? { uri: get(item, 'ad.images.iPhone') }
                  : isFlute && !isSent && isAccepted && item.isRebate
                    ? Images.ic_no_user
                    : defaultAvatar(get(item, 'sentFrom', ''))
              }
              style={{ width: 35, height: 35, borderRadius: 20, backgroundColor: '#ddd' }}
            />
          )}
        </LogoView>
        <ItemBody>
          <Name>
            {isFlute && !item.isRebate && `${user.firstName}`}
            {isFlute && !isSent && isAccepted && item.isRebate && !isDelivery && item.campaign && item.campaign.name}
            {isCampaign && `${get(item, 'campaign.name', '')}`}
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
            {isFlute && !isSent && isAccepted && !item.isRebate && 'You accepted'}
            {isFlute && !isSent && isAccepted && item.isRebate && 'Instant Rebate'}
            {isFlute && !isSent && isDeclined && 'You declined'}
            {isDelivery && 'Delivery'}
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
            {isCampaign &&
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
              `Redeemed ${item.numberOfItemsRedeemed} of ${item.numberOfItems} ${itemLabelPlural}`}
            {isCampaign && isExpired && 'Drink Offer Expired'}
          </Desc>
        </ItemBody>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
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
            {sign && <Detail style={{ fontSize: 15, marginTop: -2 }}>{sign}</Detail>}
            {!isCampaign && <Detail style={{ fontSize: 10 }}>$</Detail>}
            {!isCampaign && <Detail style={{ fontSize: 15, marginTop: -2 }}>{formatCurrencyDec(amount, '0,0')}</Detail>}
            {!isCampaign && <Detail style={{ fontSize: 9, marginLeft: 3 }}>{formatCurrencyUnd(amount)}</Detail>}
          </View>
          {!isDelivery && <Desc style={{ fontSize: 14 }}>{mcreate.format('MM/DD')}</Desc>}
          {isDelivery && !isRedeemed && (
            <View
              style={{
                paddingHorizontal: 16,
                paddingVertical: 4,
                borderWidth: 1,
                borderColor: 'black',
                borderRadius: 20,
              }}>
              <Detail style={{ fontSize: 9 }}>ORDER</Detail>
            </View>
          )}
          {isDelivery && isRedeemed && <Desc style={{ fontSize: 12 }}>ORDERED</Desc>}
          {isDelivery && isRedeemed && <Desc style={{ fontSize: 14 }}>{mcreate.format('MM/DD')}</Desc>}
        </View>
      </ItemBtn>
    );
  };

  console.log(filteredTabs, tabs);

  const renderTabList = () => {
    return (
      <ItemList
        removeClippedSubviews
        data={
          filteredTabs
            ? filteredTabs.sort((a, b) =>
              (a.raw ? a.raw.deliverBy : a.closedAt) > (b.raw ? b.raw.deliverBy : b.closedAt) ? 1 : -1
            )
            : tabs.sort((a, b) =>
              (a.raw ? a.raw.deliverBy : a.closedAt) > (b.raw ? b.raw.deliverBy : b.closedAt) ? 1 : -1
            )
        }
        initialNumToRender={10}
        keyExtractor={(item, index) => `wallets_${index}`}
        renderItem={(props) => <TabItem {...props} currentUser={currentUser} />}
        ListEmptyComponent={() => (
          <NoView>
            <NoText>No results found</NoText>
          </NoView>
        )}
      />
    );
  };

  const renderFluteList = () => {
    const data = filteredFlutes ? filteredFlutes : flutes;

    if (data.length > 0) {
      return (
        <SwipeListView
          data={data}
          renderItem={(data, rowMap) => <FluteItem {...data} currentUser={currentUser} />}
          renderHiddenItem={(data, rowMap) => (
            <DeleteBtn key={`delete_${data.item.userId}`} onPress={() => { }}>
              <View style={{ justifyContent: 'center', alignItems: 'center', width: 100 }}>
                <DeleteTitle>Remove</DeleteTitle>
              </View>
            </DeleteBtn>
          )}
          leftOpenValue={0}
          rightOpenValue={-100}
          style={{ width: '100%' }}
        />
      );
    } else {
      return (
        <NoView>
          <NoText>No results found</NoText>
        </NoView>
      );
    }
  };
  return (
    <Container>
      <ModalHeader title={'Transactions'} description={'Your account history'} {...props} />
      <TabBar>
        <TabBtn onPress={() => _onPressTab('tabs')} isSet={tab === 'tabs'}>
          <TabText>TABS</TabText>
        </TabBtn>
        <TabBtn onPress={() => _onPressTab('flutes')} isSet={tab === 'flutes'}>
          <TabText>FLUTES</TabText>
        </TabBtn>
      </TabBar>
      <Body>
        <Search style={{ shadowOffset: { width: 0, height: -2 } }}>
          <SearchView>
            <SearchInput
              placeholder="Search"
              placeholderTextColor="#929292"
              returnKeyType="done"
              value={keyword}
              onChangeText={_onChangeKeyword}
            />
            <SLIcon name="magnifier" color="#929292" size={22} style={{ alignSelf: 'center' }} />
          </SearchView>
        </Search>
        {tab === 'tabs' ? renderTabList() : renderFluteList()}
      </Body>
    </Container>
  );
};

const Title = styled(MainSemiBoldFont)`
  font-size: 14px;
  line-height: 13px;
  color: black;
  margin-left: 21px;
`;

const Logo = styled.Image`
  width: 51px;
  height: 51px;
`;

const Right = styled.View`
  position: absolute;
  right: 15px;
`;

const ItemContainer = styled.TouchableOpacity`
  flex-direction: row;
  padding-horizontal: 25px;
  height: 90px;
  align-items: center;
`;

const DeleteTitle = styled(MainMediumFont)`
  color: white;
  font-size: 14px;
`;

const DeleteBtn = styled.TouchableOpacity`
  background-color: #f00;
  width: 100px;
  height: 100%;
  align-self: flex-end;
  ${Styles.center_start}
`;

const ItemText = styled(MainMediumFont)`
  font-size: 14px;
  color: black;
`;

const Price = styled(MainSemiBoldFont)``;

const SearchView = styled.View`
  flex-direction: row;
  border-bottom-color: #c8c8c8;
  border-bottom-width: 1px;
  height: 56px;
  padding-horizontal: 15px;
`;

const Body = styled.View`
  ${Styles.match_parent}
  background-color: white;
  ${Styles.start_center}
`;

const TabBtn = styled.TouchableOpacity`
  border-bottom-width: 1px;
  border-bottom-color: ${(props) => (props.isSet ? '#000' : 'rgba(0,0,0,0)')};
  ${Styles.match_parent};
  ${Styles.center}
`;

const TabText = styled(MainSemiBoldFont)`
  font-size: 13px;
  color: black;
`;

const TabBar = styled.View`
  flex-direction: row;
  height: 52px;
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
  padding-vertical: 20px;
  border-bottom-width: 1px;
  border-color: #e1e1e1;
  flex-direction: row;
  align-items: center;
  background-color: white;
`;

const ItemList = styled.FlatList`
  ${Styles.match_parent}
`;

const NoText = styled(MainMediumFont)`
  color: #929292;
  font-size: 20px;
`;

const NoView = styled.View`
  ${Styles.center}
  padding-top: 20px;
`;

const SearchInput = styled.TextInput`
  margin-right: 10px;
  ${Styles.match_parent}
  font-family: Montserrat-Medium;
  color: black;
  font-size: 15px;
`;

const Search = styled.View`
  background-color: white;
  align-self: stretch;
  shadow-opacity: 1;
  shadow-radius: 6;
  shadow-color: rgba(0, 0, 0, 0.5);
  elevation: 3;
`;

const Container = styled.View`
  ${Styles.match_parent}
  background-color: #e6e6e6;
`;
export default History;
