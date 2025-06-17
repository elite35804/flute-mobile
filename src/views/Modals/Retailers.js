import React, {useEffect, useState} from "react";
import {FlatList, View} from "react-native";
import styled from "styled-components";
import {ModalHeader} from "@/views/Components/ModalHeader";
import {MainBoldFont, MainMediumFont, MainRegularFont, Search} from "@/views/Components";
import {useOvermind} from "@/store";
import {Styles} from "@/styles";
import Feather from "react-native-vector-icons/Feather";
import DeliverModal from "@/views/Modals/DeliverModal";
import {SwipeListView} from "react-native-swipe-list-view";
import {TextMask} from "react-native-masked-text";
import {json} from "overmind";

const Retailers = (props) => {
  const {state, actions} = useOvermind();
  const [keyword, setKeyword] = useState(null);
  const [data, setData] = useState(json(state.currentCart.retailers)?.sort((a, b) => a.total > b.total ? 1 : -1));
  const onChangeValue = (key) => {
    setKeyword(key);
    const items = json(state.currentCart.retailers)?.sort((a, b) => a.total > b.total ? 1 : -1);
    if (key) {
      setData(items.filter(i => i.retailerLabel?.toLowerCase()?.includes(key.toLowerCase())))
    } else {
      setData(items);
    }
  }

  useEffect(() => {
    onChangeValue(keyword);
  }, [state.currentCart])

  const onPressContinue = () => {
    props.navigation.pop();
  };

  const onChangeRetailer = async (retailer) => {
    actions.hud.show();
    try {
      const metadata = json({...state.currentCart.metadata});
      metadata.selectedRetailer = json({...retailer})
      await actions.cart.saveCart({findMarketplace: true, cartId: state.currentCart.id, metadata})
    } catch (e) {
      console.log(e)
    } finally {
      actions.hud.hide();
    }
  }

  return (<Container>
    <ModalHeader title={'MARKETPLACES'} description={'Market places'} {...props}/>
    <Search value={keyword} onChange={onChangeValue} style={{backgroundColor: '#fbfbfb'}}/>
    <FlatList
      data={data}
      renderItem={({item, index}) => {
        return <Address onPress={() => onChangeRetailer(data)}>
          <Check isSelect={state.currentCart?.metadata?.selectedRetailer?.retailerLabel === item?.retailerLabel}>
            <Feather name="check" color={'white'} size={14}/>
          </Check>
          <Content>
            <Logo source={{uri: item?.retailerLogo}}/>
            <Title
              isSelect={state.currentCart?.metadata?.selectedRetailer?.retailerLabel === item?.retailerLabel}>{item.retailerLabel}</Title>
          </Content>
          <EditText>${item?.total?.toFixed(2)}</EditText>
        </Address>
      }}
    />
    <BottomBtn onPress={onPressContinue}>
      <BottomText>CONTINUE</BottomText>
    </BottomBtn>
  </Container>)
};

export default Retailers;

const Logo = styled.Image`
  width: 20px;
  height: 20px;
  margin-right: 10px;
`

const BottomText = styled(MainRegularFont)`
  font-size: 10px;
  line-height: 30px;
  letter-spacing: 4.7px;
  color: black;
`;

const BottomBtn = styled.TouchableOpacity`
  align-self: stretch;
  margin-horizontal: 10px;
  padding-vertical: 10px;
  background-color: #D6B839;
  ${Styles.center}
  border-radius: 2px;
`

const EditText = styled(MainBoldFont)`
  font-size: 8px;
  color: #727272;
`

const Title = styled(MainBoldFont)`
  font-size: 10px;
  color: ${props => props.isSelect ? 'black' : 'rgba(0,0,0,0.4)'}
`

const Content = styled.View`
  width: 80%;
  flex-direction: row;
  align-items: center;
`

const Check = styled.View`
  width: 15px;
  height: 15px;
  border-radius: 8px;
  background-color: ${props => props.isSelect ? 'black' : '#e0e0e0'};
  margin-right: 10px;
`

const Container = styled.SafeAreaView`
  background-color: white;
  flex: 1;
  `

const Address = styled.TouchableOpacity`
  flex-direction: row;
  padding-horizontal: 20px;
  ${Styles.start_center}
  padding-vertical: 10px;
  background-color: white;
`
