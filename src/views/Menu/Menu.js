import React, { useEffect, useState } from 'react';
import { ScrollView } from "react-native";
import SLIcon from 'react-native-vector-icons/SimpleLineIcons';
import MTIcon from 'react-native-vector-icons/MaterialIcons';
import styled from 'styled-components';
import { useOvermind } from "@/store";
import { MainBoldFont, MainRegularFont } from "@/views/Components";
import { Sizes } from "@/styles";
import { useNavigation } from "@react-navigation/native";
import WebModal from "@/views/Modals/WebModal";

const Menu = props => {
  const { state, actions } = useOvermind();
  const navigation = useNavigation();
  const [showModal, setModal] = useState(false);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');

  const _onPressHistory = () => {
    navigation.navigate('History')
  }

  const _renderMenuButton = (title, onPress, desc) => (
    <Btn onPress={onPress}>
      <Left>
        <LTitle>{title}</LTitle>
        {desc && <Desc>{desc}</Desc>}
      </Left>
      <Right>
        <SLIcon style={{ alignSelf: 'flex-end' }} name="arrow-right" size={15} color={'#585858'} />
      </Right>
    </Btn>
  );

  const _renderMenuSubButton = (title, onPress) => (
    <Btn onPress={onPress}>
      <SmLeft>
        <SmLTitle>{title}</SmLTitle>
      </SmLeft>
      <SmRight>
        <SLIcon style={{ alignSelf: 'flex-end' }} name="arrow-right" size={15} color={'#585858'} />
      </SmRight>
    </Btn>
  );
  const _onPressPromo = () => {
    navigation.navigate('Promo');
  };

  const _onPressWallet = () => {
    navigation.navigate('Wallet');
  };

  const _onPressPayment = () => {
    navigation.navigate('Payments');
  };

  const _onPressRebate = () => {
    navigation.navigate('Payments', { isRebate: true });
  }

  const _onPressSetting = () => {
    navigation.navigate('Profile');
  };

  const _onPressShare = () => {
    navigation.navigate('Address');
  };

  const _openWebView = (url, title) => {
    const mainUrl = 'https://app.flutedrinks.com/#';
    setTitle(title);
    setUrl(`${mainUrl}/${url}?m=true`);
    setModal(true)
  };

  const _onPressHelp = () => {

    navigation.navigate('Help');
  };

  const _onPressLogout = async () => {
    try {
      await actions.logout();
      navigation.navigate('SignIn');
    } catch (e) {
      console.log(e);
    }
  };
  return (

    <Container>
      <ScrollView>
        <Header>
          <Title>Account Menu</Title>
        </Header>
        {/* {_renderMenuButton('Redeem Anywhere', _onPressPromo, "Redeem drink invitations")} */}
        {_renderMenuButton('Profile Settings', _onPressSetting, "Update your profile information")}
        {_renderMenuButton('Wallet', _onPressWallet, "Check your Flute balance")}
        {/* {_renderMenuButton('Transactions', _onPressHistory, "History of tabs and Flutes")} */}
        {/*{_renderMenuButton('Delivery Orders', _onPressDeliveryOrder, "History of your delivery orders")}*/}
        {/*{_renderMenuButton('Payments', _onPressPayment, "Manage your payment methods")} */}
        {/*{_renderMenuButton('Rebates', _onPressRebate, "Manage your rebate methods")}*/}
        {_renderMenuButton('Share', _onPressShare, "Share with your friends")}
        {/*{_renderMenuButton('Drink Offers', () => {*/}
        {/*  _openWebView('offers-guide', 'Drink Offers Guide')*/}
        {/*}, "Learn how offer redemptions work")}*/}
        <SubHeader>
          <Title>Policies</Title>
        </SubHeader>
        {_renderMenuSubButton('Terms of Use', () => {
          _openWebView('terms', 'Terms of use')
        })}
        {_renderMenuSubButton('Privacy Policy', () => {
          _openWebView('privacy', 'Privacy Policy')
        })}
        {_renderMenuSubButton('Rebate & Promo Code', () => {
          _openWebView('rebate_policy', 'Rebate & Promo Code')
        })}
        {_renderMenuSubButton('Code of Conduct', () => {
          _openWebView('code_conduct', 'Code of Conduct')
        })}
        {/*{_renderMenuSubButton('Frequently Asked Questions', () => {*/}
        {/*  _openWebView('faq', 'Frequently Asked Questions')*/}
        {/*})}*/}
        <SubHeader>
          <Title>Support</Title>
        </SubHeader>
        {_renderMenuSubButton('Help', _onPressHelp)}
        {_renderMenuSubButton('Logout', _onPressLogout)}
      </ScrollView>
      <Bottom onPress={() => navigation.pop()}>
        <MTIcon name="close" size={25} color="white" style={{ alignSelf: 'center', paddingTop: 2 }} />
      </Bottom>
      <WebModal showModal={showModal} setModal={setModal} title={title} url={url} />
    </Container>
  )
};

export default Menu;

const Bottom = styled.TouchableOpacity`
  margin-bottom: 10px;
  align-self: center;
  width: 30px;
  height: 30px;
  border-radius: 15px;
  background-color: black;
  margin-top: 10px;
`

const Right = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  height: 70px;
`

const Desc = styled(MainRegularFont)`
  color: #585858;
  font-size: 14px;
`

const LTitle = styled(MainBoldFont)`
  color: black;
  font-size: 17px;
`

const Left = styled.View`
  flex: 9;
  height: ${Sizes.hScale(70)}px;
  justify-content: center;
  align-items: flex-start;
`;

const SmLeft = styled(Left)`
  height: ${Sizes.hScale(50)}px;
`;

const SmLTitle = styled(LTitle)`
  font-size: 15px;
  color: black;
`;

const SmRight = styled(Right)`
  height: ${Sizes.hScale(50)}px;
`

const Btn = styled.TouchableOpacity`
  justify-content: space-between;
  flex-direction: row;
  align-items: flex-start;
  padding-horizontal: 10px;
  border-bottom-color: #8b8b8b;
  border-bottom-width: 0.3px;
`;

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: white;
`;

const Header = styled.View`
  padding-horizontal: 10px;
  justify-content: flex-start;
  align-items: flex-start;
  margin-top: 30px;
  padding-bottom: 10px;
`;

const SubHeader = styled(Header)`
  padding-top: 20px;
`

const Title = styled(MainBoldFont)`
  color: black;
  font-size: 23px;
  text-align: left;
`
