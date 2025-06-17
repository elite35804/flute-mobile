import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import numeral from 'numeral';
import RangeSlider from '@ptomasroos/react-native-multi-slider';
import {MainMediumFont} from '@/views/Components';
import {Dimensions, Image, StyleSheet, Text, View, Modal} from 'react-native';
import {Images} from '@/styles/Images';
import RadioPicker from '@/views/Modals/RadioPicker';
import {Sizes} from '@/styles';
const FilterModal = (props) => {
  console.log(props);
  let cancelled = false;
  const [gender, setGender] = useState('');
  const [distance, setDistance] = useState([0, 50]);
  const [age, setAge] = useState([21, 100]);
  const [drinks, setDrinks] = useState([]);
  const [openTabs, setOpenTabs] = useState('');
  const [avatar, setAvatar] = useState(false);
  const [isRender, setRender] = useState(false);
  const [showModal, setModal] = useState(false);
  const _onModalHide = () => {
    setTimeout(() => {
      props.onModalHide && props.onModalHide();
      !cancelled && props.onFilter && props.onFilter({gender, distance, age, drinks, openTabs, avatar});
      setRender(false);
    }, 50);
  };

  const _onModalShow = () => {};

  const _onPressCancel = () => {
    cancelled = true;
    close();
  };

  const _onPressFilter = () => {
    cancelled = false;
    close();
  };

  const _onPressGender = (gender) => {
    setGender(gender);
  };

  const _onPressOpenTabs = (openTabs) => {
    setOpenTabs(openTabs);
  };

  const _onPressAvatar = () => {
    setAvatar(!avatar);
  };

  const close = () => {
    props.setModal(false);
  };

  const _onPressRemoveDrink = (drink) => {
    const items = drinks.slice(0);
    const index = items.findIndex((el) => el === drink);
    if (index >= 0) {
      items.splice(index, 1);
      setDrinks(items);
    }
  };

  const _renderGenderButton = (gen, text) => (
    <GenderBtn isSet={gen === gender} onPress={() => setGender(gen)}>
      <GenderTitle isSet={gen === gender}>{text}</GenderTitle>
    </GenderBtn>
  );

  const _renderOpenTabsButton = (tabs, text) => (
    <GenderBtn isSet={tabs === openTabs} onPress={() => setOpenTabs(tabs)}>
      <GenderTitle isSet={tabs === openTabs}>{text}</GenderTitle>
    </GenderBtn>
  );

  const drinkItems = drinks.map((drink) => (
    <ItemView>
      <ItemTitle>{drink}</ItemTitle>
      <RemoveItem onPress={() => _onPressRemoveDrink(drink)}>
        <ItemTitle>X</ItemTitle>
      </RemoveItem>
    </ItemView>
  ));

  const _onPressDrink = () => {
    setModal(true);
  };
  return (
    <Modal
      visible={props.showModal}
      onRequestClose={_onModalHide}
      transparent={true}
      animationType={'slide'}
      statusBarTranslucent={true}>
      <MainModal>
        <Container>
          <Header />
          <Content>
            <Gender>
              <Title>GENDER</Title>
              <GenderContent>
                {_renderGenderButton('', 'Any')}
                <Border />
                {_renderGenderButton('MALE', 'Male')}
                <Border />
                {_renderGenderButton('FEMALE', 'Female')}
              </GenderContent>
            </Gender>

            <Age>
              <Title>AGE</Title>
              {_renderSlider(21, 100, 1, age, (values) => setAge(values), _renderAgeMarker)}
            </Age>
            {/*<Tabs>*/}
            {/*  <Title>OPEN TABS</Title>*/}
            {/*  <TabView>*/}
            {/*    {_renderOpenTabsButton('', 'All')}*/}
            {/*    <Border/>*/}
            {/*    {_renderOpenTabsButton('true', 'Opened')}*/}
            {/*    <Border/>*/}
            {/*    {_renderOpenTabsButton('false', 'Closed')}*/}
            {/*  </TabView>*/}
            {/*</Tabs>*/}
            <Tabs>
              <Title>DRINK PREFERENCE</Title>
              <DrinkBtn onPress={_onPressDrink}>
                {drinks.length !== 0 ? drinkItems : <InitTitle>All Drinks</InitTitle>}
              </DrinkBtn>
            </Tabs>
            <Age>
              <Title>DISTANCE (MILES)</Title>
              {_renderSlider(0, 50, 1, distance, (values) => setDistance(values), _renderDistanceMarker)}
            </Age>
            <AvatarView onPress={_onPressAvatar}>
              {avatar ? (
                <FontAwesome name="check-square-o" color={'black'} size={20} />
              ) : (
                <FontAwesome name="square-o" color={'black'} size={20} />
              )}
              <Title style={{marginLeft: 5, marginTop: 2}}>HAS PROFILE PICTURE</Title>
            </AvatarView>

            <FilterBtn onPress={_onPressFilter}>
              <Image
                source={Images.btn_split}
                style={[StyleSheet.absoluteFillObject, {width: '100%', height: 45, resizeMode: 'stretch'}]}
              />
              <FilterTitle>FILTER</FilterTitle>
            </FilterBtn>
          </Content>
        </Container>
        <RadioPicker
          showModal={showModal}
          setModal={setModal}
          onSelected={(selected) => {
            setDrinks(selected);
            console.log(selected);
          }}
        />
      </MainModal>
    </Modal>
  );
};

const FilterTitle = styled(MainMediumFont)`
  color: white;
  font-size: 14px;
`;

const FilterBtn = styled.TouchableOpacity`
  height: 45px;
  border-radius: 2px;
  margin-vertical: 20px;
  overflow: hidden;
  align-items: center;
  justify-content: center;
`;

const AvatarView = styled.TouchableOpacity`
  align-self: flex-start;
  flex-direction: row;
  margin-top: 15px;
`;

const InitTitle = styled(MainMediumFont)`
  font-size: 12px;
  margin-top: 10px;
  padding-left: 10px;
  color: black;
`;

const DrinkBtn = styled.TouchableOpacity`
  flex-direction: row;
  background-color: #ebebeb;
  border-radius: 4px;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  padding-horizontal: 5px;
  padding-bottom: 5px;
`;

const RemoveItem = styled.TouchableOpacity`
  align-self: stretch;
  justify-content: center;
  align-items: center;
  margin-left: 5px;
  padding-horizontal: 10px;
`;

const ItemTitle = styled(MainMediumFont)`
  color: white;
  font-size: 12px;
`;

const ItemView = styled.View`
  flex-direction: row;
  background-color: black;
  border-radius: 4px;
  height: 30px;
  margin-top: 1px;
  align-items: center;
  justify-content: center;
  margin-right: 5px;
  padding-left: 5px;
`;

const TabView = styled.View`
  flex-direction: row;
  background-color: #ebebeb;
  border-radius: 8px;
  height: 40px;
  overflow: hidden;
`;

const Tabs = styled.View`
  align-self: stretch;
  margin-top: 30px;
`;

const _renderAgeMarker = (value) => (
  <View>
    <Image source={Images.ic_slider_tick} style={{width: 52, height: 37}} />
    <MarkerView>
      <MarkerText>{value}</MarkerText>
    </MarkerView>
  </View>
);

const _renderDistanceMarker = (value) => {
  let text = numeral(value).format('0.0');
  if (value <= 0) text = numeral(0).format('0');
  else if (value >= 50) text = numeral(50).format('0+');
  return (
    <View>
      <Image source={Images.ic_slider_tick} style={{width: 52, height: 37}} />
      <MarkerView>
        <MarkerText>{text}</MarkerText>
      </MarkerView>
    </View>
  );
};

const _renderSlider = (min, max, step, value, onChange, renderMarker) => (
  <Contain>
    <LineView>
      <Line />
    </LineView>
    <RangeSlider
      isMarkersSeparated
      snapped
      min={min}
      max={max}
      step={step}
      allowOverlap={false}
      sliderLength={Dimensions.get('window').width - 133}
      containerStyle={{alignSelf: 'stretch', marginHorizontal: Sizes.hScale(26)}}
      trackStyle={{height: 5, borderRadius: 2.5, marginTop: -3}}
      selectedStyle={{backgroundColor: 'D8D8D8'}}
      unselectedStyle={{backgroundColor: 'D8D8D8'}}
      customMarkerLeft={({currentValue}) => renderMarker(currentValue)}
      customMarkerRight={({currentValue}) => renderMarker(currentValue)}
      values={value}
      onValuesChangeFinish={onChange}
    />
  </Contain>
);

const MarkerText = styled(MainMediumFont)`
  font-size: 14px;
  color: black;
`;

const Contain = styled.View`
  background-color: transparent;
  align-self: stretch;
`;

const MarkerView = styled.View`
  ${StyleSheet.absoluteFillObject}
  justify-content: center;
  align-items: center;
`;

const LineView = styled.View`
  ${StyleSheet.absoluteFillObject}
  justify-content: center;
  align-items: center;
  background-color: transparent;
`;

const Line = styled.View`
  background-color: #d8d8d8;
  height: 5px;
  border-radius: 2.5px;
  align-self: stretch;
  margin-top: -3px;
`;

const Age = styled.View`
  align-self: stretch;
  margin-top: 30px;
`;

const Border = styled.View`
  border-width: 1px;
  border-color: #c0c0c0;
`;

const GenderTitle = styled(MainMediumFont)`
  color: ${(props) => (props.isSet ? 'white' : 'black')};
`;

const GenderBtn = styled.TouchableOpacity`
  background-color: ${(props) => (props.isSet ? 'black' : 'transparent')};
  align-self: stretch;
  align-items: center;
  justify-content: center;
  flex: 1;
`;

const GenderContent = styled.View`
  flex-direction: row;
  background-color: #ebebeb;
  border-radius: 8px;
  height: 40px;
  overflow: hidden;
`;

const Title = styled(MainMediumFont)`
  font-size: 12px;
  color: black;
`;

const Gender = styled.View`
  align-self: stretch;
`;

const Content = styled.View`
  padding-left: 30px;
  padding-right: 30px;
  padding-top: 35px;
  padding-bottom: 10px;
`;

const Header = styled.View`
  background-color: #d8d8d8;
  height: 8px;
  border-radius: 4px;
  width: 190px;
  margin-top: 10px;
  align-self: center;
`;

const Container = styled.View`
  margin-bottom: 10px;
  overflow: hidden;
  background-color: white;
  border-radius: 20px;
  align-self: stretch;
`;

const MainModal = styled.View`
  justify-content: flex-end;
  align-items: center;
  padding-bottom: 10px;
  padding: 10px;
  flex: 1;
  height: 100%;
  width: 100%;
  background-color: #00000080;
`;
export default FilterModal;
