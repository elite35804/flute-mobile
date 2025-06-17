import React, {useState} from 'react';
import {Modal} from 'react-native';
import styled from 'styled-components';
import FIcon from 'react-native-vector-icons/FontAwesome';
import SLIcon from 'react-native-vector-icons/SimpleLineIcons';
import {KeyboardAvoidingView, View} from 'react-native';
import {Sizes} from '@/styles';
import {MainBoldFont} from '@/views/Components';

const Location = (props) => {
  const [isInitial, setInitial] = useState(props.initial);
  const _onModalHide = () => {
    setTimeout(() => {
      props.setModal(false);
    }, 50);
  };

  const _onPressClose = () => {
    setInitial(true);
    props.setModal(false);
  };

  const handleChange = (text) => {
    setInitial(false);
    // setTimeout(() => addressInput.focus(), 300);
  };
  return (
    <Modal
      visible={props.showModal}
      onRequestClose={_onPressClose}
      transparent={true}
      animationType={'slide'}
      statusBarTranslucent={true}>
      <MainModal>
        <KeyboardAvoidingView behavior="padding" style={{flex: 1, width: '100%', justifyContent: 'flex-end'}}>
          {isInitial ? (
            <Modal1>
              <Header>
                <Description
                  placeholder="Enter your delivery address"
                  placeholderTextColor="#676767"
                  autoCapitalize={false}
                  onChangeText={(text) => handleChange(text)}
                />
              </Header>
              <Content>
                <ContentTitle>H O W I T W O R K S</ContentTitle>
              </Content>
              <Body>
                <Dash />
                <Item>
                  <CircleView>
                    <Id>1</Id>
                  </CircleView>
                  <Detail>Enter delivery address above</Detail>
                </Item>
                <Item>
                  <CircleView>
                    <Id>2</Id>
                  </CircleView>
                  <Detail>Confirm Payment</Detail>
                </Item>
                <Item>
                  <CircleView>
                    <Id>3</Id>
                  </CircleView>
                  <View>
                    <Detail>Sign for delivery</Detail>
                    <SubDetail>(next day for CA only)</SubDetail>
                  </View>
                </Item>
              </Body>
            </Modal1>
          ) : (
            <Modal2>
              <Search>
                {props?.isAd ? (
                  <FIcon size={16} color={'#9b9b9b'} style={{marginLeft: 20}} name="truck" />
                ) : (
                  <SLIcon name="cursor" size={16} color="#9b9b9b" style={{marginLeft: 20}} />
                )}
                <SearchInput
                  placeholder={props?.isAd ? 'Delivery Address' : 'Search Location'}
                  placeholderTextColor="#929292"
                  returnKeyType="done"
                  value={props.address}
                />
              </Search>
            </Modal2>
          )}
        </KeyboardAvoidingView>
      </MainModal>
    </Modal>
  );
};

export default Location;

const SearchInput = styled.TextInput`
  align-self: stretch;
  flex: 1;
  font-family: Montserrat-Medium;
  color: #676767;
  font-size: 12px;
  padding-left: 5px;
`;

const Search = styled.View`
  flex-direction: row;
  align-self: stretch;
  justify-content: center;
  align-items: center;
  margin-top: 5px;
  height: 50px;
`;

const Modal2 = styled.View`
  height: 75%;
  width: 100%;
  margin-bottom: 5px;
  border-radius: 8px;
  background-color: #f6f6f6;
`;

const Detail = styled(MainBoldFont)`
  padding-left: ${Sizes.hScale(27)}px;
  font-size: 14px;
  line-height: 17px;
  color: #959595;
`;

const SubDetail = styled(Detail)`
  font-size: 10px;
  line-height: 15px;
  color: black;
`;

const Id = styled(MainBoldFont)`
  font-size: 20px;
  line-height: 24px;
  color: #959595;
`;

const CircleView = styled.View`
  width: ${Sizes.hScale(49)}px;
  height: ${Sizes.hScale(49)}px;
  border-radius: ${Sizes.hScale(25)}px;
  border-width: 1px;
  border-color: #9b9b9b;
  align-items: center;
  justify-content: center;
  background-color: white;
  z-index: 200000;
`;

const Item = styled.View`
  padding-horizontal: ${Sizes.hScale(37)}px;
  flex-direction: row;
  align-items: center;
  padding-bottom: ${Sizes.hScale(32)}px;
  z-index: 1000;
`;

const Dash = styled.View`
  width: 1px;
  height: ${Sizes.hScale(150)}px;
  border-style: dashed;
  border-width: 0.5;
  border-color: #a3a3a3;
  position: absolute;
  bottom: ${Sizes.hScale(63)}px;
  left: ${Sizes.hScale(60)}px;
`;

const Body = styled.View`
  margin-top: ${Sizes.hScale(47)}px;
`;

const Content = styled.View`
  padding-top: ${Sizes.hScale(42)}px;
  justify-content: center;
`;

const ContentTitle = styled(MainBoldFont)`
  font-size: 15px;
  line-height: 18px;
  color: #676767;
  text-align: center;
`;

const Description = styled.TextInput`
  font-family: Montserrat-Regular;
  font-size: 12px;
  line-height: 15px;
  color: #676767;
`;
const Header = styled.View`
  padding-horizontal: ${Sizes.hScale(16)}px;
  padding-top: ${Sizes.hScale(27)}px;
  padding-bottom: ${Sizes.hScale(20)}px;
  border-bottom-width: 4px;
  border-bottom-color: #ededed;
`;

const Modal1 = styled.View`
  height: 55%;
  width: 100%;
  border-radius: ${Sizes.hScale(8)}px;
  background-color: #f6f6f6;
`;

const MainModal = styled.View`
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  height: 100%;
  flex: 1;
  background-color: #00000080;
`;
