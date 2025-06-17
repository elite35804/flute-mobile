import React, {useEffect, useState} from "react";
import styled from 'styled-components';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import SLIcon from 'react-native-vector-icons/SimpleLineIcons';
import {
  MainBoldFont,
  MainMediumFont,
  StyledText
} from "@/views/Components/controls/Text";
import {Sizes} from "@/styles/Sizes";
import {Images} from "@/styles/Images";
import {
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  View, Alert
} from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import {useNavigation} from '@react-navigation/native';
import {ModalHeader} from "@/views/Components/ModalHeader";
import {useOvermind} from "@/store";
import {Search} from "@/views/Components";
import {get} from 'lodash';
import FilterModal from "@/views/Modals/FilterModal";
import numeral from 'numeral';
import {json} from 'overmind';

const Gift = (props) => {
  const {state, actions} = useOvermind();
  const {currentUser, user} = state;
  const [filtered, setFilter] = useState({
    age: [21, 100],
    distance: [0, 50],
    gender: '',
    drinks: [],
    avatar: false,
  });
  const [keyword, setKeyword] = useState('');
  const [filteredUser, setFiltered] = useState([]);
  const [counts, setCounts] = useState({});
  const [showModal, setModal] = useState(false);
  const navigation = useNavigation();
  useEffect(() => {
    initView();
  }, []);

  const initView = () => {
    setFilter(user.socialFilter ? user.socialFilter : filtered);
    filterFlutes(user.socialUsers, true);
  };

  const filterFlutes = async (flutes, update) => {
    try {
      const filter = JSON.parse(await AsyncStorage.getItem("filter"));
      let filtered = [];
      if (filter) {
        filtered = flutes.filter((el) => {
          const age = actions.user.getAge(el?.dateOfBirth | new Date());
          const dist = el?.metadata?.distanceAway | 0;
          const avatar = el?.avatar | 0;
          const keyword = (keyword || '').trim().toLowerCase();
          if (!el.firstName) return false;
          if (keyword.length) {
            if (el.firstName && el.firstName.toLowerCase().indexOf(keyword) === -1)
              if (el.lastName && el.lastName.toLowerCase().indexOf(keyword) === -1)
                return false;
          }
          if (age < filter.age[0] || age > filter.age[1]) return false;
          if (dist < filter.distance[0]) return false;
          if (filter.distance[1] < 50 && dist > filter.distance[1]) return false;
          if (filter.gender) {
            const gender = el.gender;
            if (gender !== filter.gender) return false;
          }
          if (filter.openTabs) {
            const isOpen = el?.openedTab?.id?.length > 2;
            if (filter.openTabs === 'true' && !isOpen) {
              return false;
            } else if (filter.openTabs === 'false' && isOpen) {
              return false;
            }
          }
          if (filter.avatar === true && !avatar && !avatar.length) {
            return false;
          }
          if (filter.drinks.length) {
            let drinks = el?.settings?.drinkOfChoice;
            if (drinks) {
              drinks = [drinks];
            } else if (!drinks || !drinks.length) {
              drinks = [];
            }
            const index = filter.drinks.findIndex(d => drinks.findIndex(d1 => d1 === d) >= 0);
            if (index < 0) return false;
          }
          return true;
        });
      } else if (keyword) {
        const key = (keyword || '').trim().toLowerCase();
        filtered = flutes.filter((el) => (el.firstName && el.firstName.includes(key)) || (el.lastName && el.lastName.includes(key)))
      } else {
        filtered = flutes.filter((el) => {

          if (el.firstName && el.firstName.length > 0) return true;
          return false;
        });
      }
      console.log(json(filtered));
      setFiltered(filtered);
      await AsyncStorage.setItem("flutes", JSON.stringify(filtered));
      // if (update) forceUpdate();
    } catch (e) {
      console.log(e);
    }

  };

  const [layoutSend, setLayoutSend] = useState(0);
  const [layoutPic, setLayoutPic] = useState(0);
  const [isShow, setShow] = useState(true);
  const _expiredTooltip = () => {
    setShow(false);
  };

  const onPressCount = (item, index, count) => {
    let oriCounts = {...counts};
    oriCounts[item.id] = (oriCounts[item.id] || 0) + count;
    setCounts(oriCounts)
  };

  const drinkCount = () => {
    let count = 0;
    user.socialUsers.forEach(el => count += (counts[el.id] || 0));
    return count;
  };

  const drinkCost = () => {
    let cost = 0;
    user.socialUsers.forEach((el) => {
      cost += (counts[el.id] || 0) * get(el.openedTab, 'perCost.totalCostToSender', 15.20);
    });
    return cost?.toFixed(2);
  };

  const onChangeKeyword = (text) => {
    setKeyword(text);
    filterFlutes(user.socialUsers, true);
  };

  const onFilter = async (data) => {
    console.log(data);
    try {
      await AsyncStorage.setItem("filter", JSON.stringify(data));
    } catch (e) {
      console.log(e);
    }
    setFilter(data);
    filterFlutes(user.socialUsers, true);
  };

  const getFilter = async () => {
    return JSON.parse(await AsyncStorage.getItem('filter'));
  };

  const _onPressSend = () => {
    if (!drinkCount()) {
      actions.alert.showError({message: 'Please add drinks to send', title: 'Flute'});
      return;
    }
    // if (g.isNull(gs.openTab)) {
    //   Alert.alert('Send Drink', 'You must have a tab open to send drinks', [{ text: 'OK' }]);
    //   return;
    // }
    _confirmSend();
  }

  const _confirmSend = () => {
    const balance = currentUser.balance;
    const cost = drinkCost();
    if (balance > 0) {
      const charged = balance > cost ? cost : balance;
      Alert.alert('Confirm Payment', `If accepted, your account will be charged ${numeral(cost).format('$0,0.00')}. Includes non-refundable service charge. We've used ${numeral(charged).format('$0,0.00')} from your wallet and charged the balance on your primary payment method.`, [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Confirm', onPress: () => {
            _requestConfirm(true)
          }
        },
        /*{ text: 'No', onPress: () => { this._requestConfirm(false) } },*/
      ]);
    } else {
      Alert.alert('Confirm Payment', `If accepted, your account will be charged ${numeral(cost).format('$0,0.00')}. Includes non-refundable service charge.`, [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'OK', onPress: () => {
            _requestConfirm(false)
          }
        },
      ]);
    }
  };

  const _requestConfirm = async (useWallet) => {
    actions.hud.show();
    const balance = currentUser.balance;
    let payments = get(currentUser, 'paymentMethods');
    if (payments.length) payments = payments.filter(payment => payment.type === "payment" && payment.isValid === true);
    if (payments.length || balance >= drinkCost()
    ) {
      await confirmProcess(useWallet);
    } else {
      // navigation.navigate({name: routes.names.app.paymentAddCard,  params: {handler: () => this.validSendDrink(useWallet)} })
    }
    actions.hud.hide();
  };

  const confirmProcess = async (useWallet) => {
    try {
      const flutes = user.socialUsers.filter(el => (counts[el.id] || 0) > 0);

      const toFlutes = flutes.map(el => {
        if (get(el, 'openedTab.id').length > 2) {
          return {
            receiverUserId: el.id,
            receiverTabId: el.openedTab.id,
            quantity: counts[el.id]
          }
        }
        return {
          receiverUserId: el.id,
          quantity: counts[el.id]
        }
      });

      const info = await actions.user.sendFlutes({fromUserId: currentUser.id, toFlutes, useWallet});

      const res2 = get(info, 'data.sendFlutes');

      if (res2 && res2?.paymentFailed) {
        navigation.navigate('Payments');
      } else {
        props.navigation.navigate('SentDrink');
      }
      // _updateTooltip();
      // this._confirmSend(res);
    } catch (ex) {
      console.log(ex);
      actions.alert.showError({message: 'Failed to send drinks', title: 'Flute'});
    }
  }

  console.log(filteredUser, 'filteredUser')

  return (
    <Container>
      <ModalHeader title="Send Gift" description="People you may know" {...props}/>
      <Search value={keyword} onChange={(text) => onChangeKeyword(text)}/>
      <View onLayout={(e) => setLayoutPic(e.nativeEvent.layout.y)}/>
      {isShow && <Tooltip style={{shadowOffset: {width: 0, height: 4}}} position={layoutPic - 45 + 20}>
        <TooltipBody><TooltipTitle>TAP ON PICTURE TO ADD DRINKS</TooltipTitle></TooltipBody>
        <Arrow source={Images.ic_triangle} width={Sizes.hScale(20)} height={Sizes.hScale(7)}/>
      </Tooltip>}
      <FlatList
        onScrollEndDrag={_expiredTooltip}
        onScrollBeginDrag={_expiredTooltip}
        data={filteredUser}
        initialNumToRender={100}
        keyExtractor={(item, index) => `flutes_${index}`}
        ListEmptyComponent={() => <Empty><EmptyText>No results found</EmptyText></Empty>}
        ListFooterComponent={() => <View style={{height: 200}}></View>}
        renderItem={prop => {
          return <UserItem {...prop} onPress={() => {
          }} count={counts[prop.item?.id] || 0} onPressCount={onPressCount}/>
        }}/>
      <Bottom>
        <SendBtn onLayout={(e) => setLayoutSend(e.nativeEvent.layout.y)} onPress={_onPressSend}>
          <SendImage source={Images.btn_social_send}/>
        </SendBtn>
        {isShow && <Tooltip style={{shadowOffset: {width: 0, height: 4}}} position={layoutSend - 45}>
          <TooltipBody><TooltipTitle>TAP HERE TO SEND DRINKS NOW</TooltipTitle></TooltipBody>
          <Arrow source={Images.ic_triangle} width={Sizes.hScale(20)} height={Sizes.hScale(7)}/>
        </Tooltip>}
        <BtmView pointerEvents="box-none">
          <Left>
            <LeftBtn onPress={() => setModal(true)}>
              <FontAwesome color="gray" name="filter" size={24}/>
              <FilterText>Filter</FilterText>
            </LeftBtn>
          </Left>
          <Middle>
            <MidImage source={Images.bg_social_bottom}/>
            <MidView>
              <MidText>{drinkCount()} Drinks{'\n'}Total ${drinkCost()}</MidText>
            </MidView>
          </Middle>
          <Right>
            <LeftBtn onPress={() => {
              navigation.pop();
              navigation.navigate('Address');
            }}>
              <FontAwesome color="gray" name="address-book-o" size={24}/>
              <FilterText>Invite</FilterText>
            </LeftBtn>
          </Right>
        </BtmView>
      </Bottom>
      <FilterModal showModal={showModal} setModal={setModal} {...getFilter()} onFilter={onFilter}/>
    </Container>
  )
};

const Empty = styled.View`
  align-items: center;
  justify-content: center;
  padding-top: 30px;
`;

const EmptyText = styled(MainMediumFont)`
  font-size: 20px;
  color: #929292;
`

const Arrow = styled.Image`
  width: ${Sizes.hScale(30)}px;
  height: ${Sizes.hScale(7)}px;
  resize-mode: contain;
  align-self: center;
`

const TooltipTitle = styled(MainMediumFont)`
  color: white;
  font-size: 10px;
  line-height: 12px;
  letter-spacing: 1.5px;
`
const TooltipBody = styled.View`
  background-color: black;
  border-radius: 8px;
  padding-vertical: 11px;
  padding-horizontal: 30px;
  height: 35px;
`
const Tooltip = styled.View`
  position: absolute;
  top: ${props => props.position ? props.position : 0}px;
  shadow-opacity: 0.2;
  shadow-radius: 1px;
  shadow-color: black;
  align-self: center;
  z-index: 100;
`;

const MidText = styled(StyledText)`
  font-size: 12px;
  text-align: center;
  color: black;
`;

const MidView = styled.View`
  position: absolute;
  left: 0; right: 0; top: 0; bottom: 0;
  align-items: center;
  justify-content: center;
  top: 42;
`

const MidImage = styled.Image`
  width: 139px;
  height: 76px;
  resize-mode: stretch;
`

const Middle = styled.View`
  align-items: center;
  justify-content: center;
`

const FilterText = styled(StyledText)`
  font-size: 10px;
  margin-top: 5px;
  color: black;
`;

const LeftBtn = styled.TouchableOpacity`
  padding-vertical: 15px; padding-horizontal: 15px;
  align-items: center;
`
const Left = styled.View`
  background-color: white;
  flex: 1; justify-content: center; align-items: center; border-top-left-radius: 15px;
  border-bottom-left-radius: 30px; height: 76px;
`;

const Right = styled(Left)`
border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border-top-right-radius: 15px;
  border-bottom-right-radius: 30px;
`

const BtmView = styled.View`
  flex-direction: row;
  align-self: stretch; margin-bottom: 10px; margin-horizontal: 15px;
  shadowColor: rgba(0,0,0,0.1); shadowOpacity: 1; shadowRadius: 4px; elevation: 3;
`

const SendImage = styled.Image`
  width: 64px; height: 64px;
`

export default Gift;

const SendBtn = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  shadowColor: rgba(0,0,0,0.5); shadowRadius: 6; zIndex: 100; marginBottom: -35; elevation: 3;
`

const Bottom = styled.View`
  position: absolute; bottom: 0; left: 0; right: 0;
  justify-content: center; align-items: center;
`

const UserItem = ({item, onPress, count, onPressCount, index, ...props}) => {
  const random_avatar = Math.random() >= 0.5;
  let thumb = "", resize = false;
  if (item.avatar) {
    thumb = {uri: item?.avatar};
    resize = true;
  } else {
    if (get(item, 'gender', 'MALE') === "MALE") {
      thumb = random_avatar ? Images.avatar_male_1 : Images.avatar_male_2;
    } else {
      thumb = random_avatar ? Images.avatar_female_1 : Images.avatar_female_2;
    }
  }
  const name = `${item.username || ''}`;
  const drink = get(item, 'settings.drinkOfChoice', '');
  const distanceAway = Math.round(get(item, 'metadata.distanceAway', 0));
  let away = drink ? `${drink}, ${distanceAway || '0'} mi` : `${distanceAway || '0'} mi`;
  const birthMonth = new Date(item.dateOfBirth).getMonth();
  const birthDay = new Date(item.dateOfBirth).getDate();
  const recentMonth = new Date().getMonth();
  const recentDay = new Date().getDate();
  if (birthMonth === recentMonth && birthDay === recentDay) {
    away = (drink ? `${drink}, ${distanceAway || '0'} mi` : `${distanceAway || '0'} mi`) + " • It's My Birthday!";
  }
  if (item.openedTab && item.openedTab.id && item.openedTab.id.length === 2) var isOpened = false;
  else var isOpened = true;
  return (
    <ItemContainer style={{shadowOffset: {width: 0, height: 0}}}>
      <TouchableOpacity onPress={() => onPressCount(item, index, 1)}>
        <Border>
          <Bg source={thumb} resize={resize}/>
          <Fixed/>
        </Border>
      </TouchableOpacity>
      <Content>
        <DescView>
          <Name>{name}</Name>
          <Description>{away}</Description>
        </DescView>
        {item.settings?.instagramUsername && <TouchableOpacity>
          <FontAwesome name="instagram" size={30} color="black"/>
        </TouchableOpacity>}
      </Content>

      {count > 0 && <CountView>
        <CountBtn onPress={() => onPressCount(item, index, -1)}><CountText>-</CountText></CountBtn>
        <CountBody><CountText style={{color: 'black', textAlign: 'center'}}>{count}</CountText></CountBody>
        <CountBtn onPress={() => onPressCount(item, index, 1)}><CountText
          style={{fontSize: 50}}>+</CountText></CountBtn>
      </CountView>}

      {isOpened && <OpenView>
        <OpenText>TAB OPEN</OpenText>
        <OpenBadge/>
      </OpenView>}
    </ItemContainer>
  )
};

const OpenBadge = styled.View`
  border-radius: 7.5px; background-color: #00CE50; margin-right: 10px; margin-top: 10px;
  width: 10px; height: 10px;
`

const OpenText = styled(MainBoldFont)`
  font-size: 11px; color: #00CE50;
  margin-right: 5px; margin-top: 8px;
`

const OpenView = styled.View`
  position: absolute; top: 0;left: 0;
  right: 0; align-items: flex-end; justify-content: center;
  flex-direction: row;
`;

const CountBody = styled.View`
  width: 120px; height: 120px;
  border-radius: 60px; background-color: white; align-self: center; justify-content: center;
`;

const CountText = styled(MainBoldFont)`
  color: white; font-size: 70px;
`

const CountBtn = styled.TouchableOpacity`
  flex: 1;
  align-self: stretch;
  justify-content: center; align-items: center;
`

const CountView = styled.View`
  ${StyleSheet.absoluteFillObject}
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: #000000d0;
`

const Fixed = styled.View`
  ${StyleSheet.absoluteFillObject};
  background-color: #00000040;
`

const Border = styled.View`
  border-radius: 10px;
  overflow: hidden;
`

const Description = styled(StyledText)`
  font-weight: 300;
  font-size: 10px;
  line-height: 12px;
  margin-top: 3px;
  color: black;
`;

const Name = styled(StyledText)`
  font-weight: 500;
  font-size: 15px;
  line-height: 18px;
  color: black;
`;
const DescView = styled.View`
`;

const Content = styled.SafeAreaView`
  background-color: rgba(255, 255, 255, 0.6);
  align-items: flex-end;
  justify-content: flex-end;
  padding-horizontal: 20px;
  border-radius: 22px;
  padding-vertical: 5px;
  margin-horizontal: 20px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  position: absolute;
  bottom: 10;
  left: 0; right: 0;
`;

const Container = styled.View`
  flex: 1;
  background-color: #f5f5f5;
`;

const Bg = styled.Image`
  width: ${Dimensions.get('window').width - 30}px;
  height: 200px;
  resize-mode: ${props => props.resize ? 'cover' : 'contain'};
  background-color: #eeeeee;
`;

const ItemContainer = styled.View`
  margin-horizontal: 15px;
  height: 200px;
  border-radius: 10px;
  margin-vertical: 5px;
  shadowColor: rgba(0,0,0,0.25);
    shadowOpacity: 1;
    shadowRadius: 4;
    elevation: 3;
`
