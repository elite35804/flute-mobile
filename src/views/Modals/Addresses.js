import React, {useEffect, useState} from "react";
import styled from "styled-components";
import {ModalHeader} from "@/views/Components/ModalHeader";
import {MainBoldFont, MainMediumFont, MainRegularFont, Search} from "@/views/Components";
import {useOvermind} from "@/store";
import {Styles} from "@/styles";
import Feather from "react-native-vector-icons/Feather";
import DeliverModal from "@/views/Modals/DeliverModal";
import {SwipeListView} from "react-native-swipe-list-view";
import {TextMask} from "react-native-masked-text";

const Addresses = (props) => {
  const {state, actions} = useOvermind();
  const [keyword, setKeyword] = useState(null);
  const [selectedIndex, setIndex] = useState(props.route.params?.index);
  const [data, setData] = useState(state.currentUser.sites?.filter(s => s.name && s.phones?.length > 0));
  const [showModal, setModal] = useState(false);
  const [editAddress, setEditAddress] = useState(null);

  const onChangeValue = (key) => {
    setKeyword(key);
    const items = state.currentUser.sites.filter(s => s.name && s.phones?.length > 0);
    if (key) {
      setData(items.filter(i =>
        i.name?.toLowerCase()?.includes(key.toLowerCase()) ||
        i.address?.toLowerCase()?.includes(key.toLowerCase()) ||
        i.address2?.toLowerCase()?.includes(key.toLowerCase()) ||
        i.city?.toLowerCase()?.includes(key.toLowerCase()) ||
        i.state?.toLowerCase()?.includes(key.toLowerCase()) ||
        i.postalCode?.toLowerCase()?.includes(key.toLowerCase())
      ))
    } else {
      setData(items);
    }
  }

  useEffect(() => {
    onChangeValue(keyword);
  }, [state.currentUser])

  const onPressEdit = (item) => {
    setEditAddress(item);
    setTimeout(() => setModal(true), 500)
  }
  const onPressContinue = () => {
    props.navigation.pop();
    props.route.params.onSelect(selectedIndex);
  };

  const onPressRemove = async (item) => {
    console.log(item);
    actions.hud.show();
    try {
      await actions.user.deleteUserAddress({siteId: item.id, userId: state.currentUser.id});
    } catch (e) {
      console.log(e);
    } finally {
      actions.hud.hide();
    }
  }
  return (<Container>
    <ModalHeader title={'Delivery Address'} description={'Previous delivery information'} {...props}/>
    <Search value={keyword} onChange={onChangeValue} style={{backgroundColor: '#fbfbfb'}}/>
    <SwipeListView
      data={data}
      renderItem={(data, rowMap) => <Address onPress={() => setIndex(data.item.id)}>
        <Check isSelect={selectedIndex === data.item.id}>
          <Feather name="check" color={'white'} size={14}/>
        </Check>
        <Content>
          <Title isSelect={selectedIndex === data.item.id}>{data.item.name}</Title>
          <Description isSelect={selectedIndex === data.item.id}
                       numberOfLines={1}>{`${data.item.address}. ${data.item.address2 || ''} ${data.item.city}, ${data.item.state} ${data.item.postalCode}`}</Description>
          {data?.item.phones?.length > 0 && data?.item.phones[0]?.number && <Phone
            type={'cel-phone'}
            options={{
              maskType: 'BRL',
              withDDD: true,
              dddMask: '(999) 999-9999'
            }}
            value={data?.item.phones[0]?.number}
            isSelected={selectedIndex === data?.item.id}
          />}
        </Content>
        {data.item.id === selectedIndex && <EditBtn onPress={() => onPressEdit(data.item)}>
          <EditText>EDIT</EditText>
        </EditBtn>}
      </Address>}
      renderHiddenItem={(data, rowMap) => (
        <DeleteBtn key={`delete_${data.item.userId}`} onPress={() => onPressRemove(data.item)}>
          <DeleteTitle>Remove</DeleteTitle>
        </DeleteBtn>
      )}
      leftOpenValue={0}
      rightOpenValue={-70}
    />
    <BottomBtn onPress={onPressContinue}>
      <BottomText>CONTINUE</BottomText>
    </BottomBtn>
    <DeliverModal showModal={showModal} setModal={setModal} onAdded={() => {
    }} data={editAddress}/>
  </Container>)
};

export default Addresses;

const Phone = styled(TextMask)`
  font-family: Montserrat-Regular;
  font-size: 10px;
  line-height: 13px;
  width: 75%;
  color: ${props => props.isSelected ? 'black' : 'rgba(0,0,0,0.4)'};
`

const DeleteTitle = styled(MainMediumFont)`
  color: white;
  font-size: 14px;
`

const DeleteBtn = styled.TouchableOpacity`
  background-color: #f00;
  width: 70px; height: 100%;
  align-self: flex-end;
  ${Styles.center}
`;

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

const EditBtn = styled.TouchableOpacity`
  position: absolute;
  right: 20px;
  width: 50px;
  height: 21px;
  ${Styles.center}
  border-width: 1px;
  border-color: #e0e0e0;
  border-radius: 2px;
`

const Description = styled(MainRegularFont)`
  font-size: 10px;
    color: ${props => props.isSelect ? 'black' : 'rgba(0,0,0,0.4)'}
`

const Title = styled(MainBoldFont)`
  font-size: 10px;
  color: ${props => props.isSelect ? 'black' : 'rgba(0,0,0,0.4)'}
`

const Content = styled.View`
  width: 73%;
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
