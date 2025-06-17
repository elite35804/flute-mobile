import React, {useState, useEffect} from 'react';
import {KeyboardAvoidingView, FlatList, Platform} from 'react-native';
import styled from 'styled-components';
import {isEmpty} from 'lodash';
import Geolocation from '@react-native-community/geolocation';
import FAIcon from 'react-native-vector-icons/FontAwesome';

import {Styles, Colors, Sizes} from '@/styles';
import {FontSize, Spacing} from '@/styles/Sizes';
import {
  BaseTextInput,
  TextButton,
  MainSemiBoldFont,
  CloseButton,
  ItemContainer,
  ItemSeparator,
  MainRegularFont
} from '@/views/Components';

import {useDelay} from '@/hooks/Utils';
import {useOvermind} from '@/store';
import {themeProp as theme} from '@/utils/CssUtil';
import {addressNoCountry} from '@/utils/MiscUtil';

const GooglePlaceSelector = (props) => {
  const params = props.route.params;
  const [keyword, setKeyword] = useState(params?.address || '');
  const [unit, setUnit] = useState(null);

  const [id, setId] = useState(null);
  const {state, actions} = useOvermind();
  const {google} = state;
  const {placeResults} = google;

  const delayedSearch = useDelay(actions.google.searchGooglePlaces)

  useEffect(() => {
    delayedSearch({keyword});
  }, [keyword])

  const finish = (place) => {
    params.onSelect && params.onSelect(place)
    props.navigation.pop()
  }

  const onSelect = (place) => {
    finish({
      name: place.name,
      address: place.formatted_address,
      address2: unit,
      details: place
    })
  }

  const onSelectMyLocation = async () => {
    Geolocation.getCurrentPosition(
      async (info) => {
        const place = await actions.user.getPlaceFromCoordinates({
          gps: {
            lat: info.coords.latitude,
            lon: info.coords.longitude
          }
        });
        finish({
          name: place.name,
          address: place.formatted_address,
          address2: unit,
          details: place
        })
      },
      error => {
      })
  }

  const addresses = placeResults.filter(p => !isEmpty(p.formatted_address) && p.formatted_address.split(", ").length >= 4);

  return (
    <KeyboardAvoiding behavior="padding" enabled={Platform.OS === "ios"}>
      <Container>
        <InputContainer>
          <FilterInput
            placeholder={"Enter location..."}
            placeholderTextColor={'grey'}
            value={keyword}
            onChangeText={setKeyword}
          />
          <ClearButton onPress={() => setKeyword("")}>CLEAR</ClearButton>
          <CloseButton onPress={() => props.navigation.pop()}/>
        </InputContainer>
        <FlatList
          data={addresses}
          keyExtrator={(item, index) => index.toString()}
          ListHeaderComponent={(<MyLocation onPress={onSelectMyLocation}/>)}
          renderItem={({item}) => (
            <PlaceItem
              onPress={() => onSelect(item)}
              item={item}
              id={id}
              onPressUnit={(id) => setId(id)}
              changeUnit={(val) => setUnit(val)}
            />
          )}
          ItemSeparatorComponent={ItemSeparator}
        />
      </Container>
    </KeyboardAvoiding>
  )
}

const MyLocation = ({onPress}) => {
  return (
    <MyLocationContainer onPress={onPress}>
      <FAIcon name='location-arrow' color="#9b9b9b" size={16}/>
      <ItemTitle>
        Current Location
      </ItemTitle>
    </MyLocationContainer>
  )
};

const PlaceItem = ({item, onPress, onPressUnit, id, changeUnit}) => {
  return (
    <ItemContainer onPress={onPress}>
      <ItemTitle numberOfLines={4}>{addressNoCountry(item.formatted_address)}</ItemTitle>
      {/*<UnitView>*/}
      {/*  {item.id !== id && <UnitButton onPress={() => onPressUnit(item.id)}>*/}
      {/*    <UnitText>ADD UNIT #</UnitText>*/}
      {/*  </UnitButton>}*/}
      {/*  {item.id === id && <UnitTitle>*/}
      {/*    ENTER UNIT #*/}
      {/*  </UnitTitle>}*/}
      {/*  {item.id === id && <UnitInputView>*/}
      {/*    <UnitInput*/}
      {/*      onChangeText={(value) => changeUnit(value)}*/}
      {/*    />*/}
      {/*    <TouchableOpacity onPress={() => onPress(item)}>*/}
      {/*      <FAIcon name='angle-right' size={20} color="#676767"/>*/}
      {/*    </TouchableOpacity>*/}
      {/*  </UnitInputView>}*/}
      {/*</UnitView>*/}
    </ItemContainer>
  );
}

const UnitView = styled.View`
  align-items: center;
  justify-content: center;
`;

const UnitInput = styled.TextInput`
  border-radius: 5px;
  border-width: 1px;
  padding-vertical: 5px;
  padding-horizontal: 5px;
  border-color: ${theme('colorListDivider')}
  margin-right: 10px;
  margin-top: 2px;
  flex: 1;
  font-size: 11px;
  color: black;
`;

const UnitInputView = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  width: 150%;
  margin-left: 20px;
`;

const UnitText = styled(MainRegularFont)`
  font-size: 11px;
  color: lightgrey;
`;

const UnitTitle = styled(MainRegularFont)`
  font-size: 10px;
  color:#676767;
  text-align: center;
`;

const UnitButton = styled.TouchableOpacity`
  border-radius: 5px;
  border-width: 1px;
  padding-vertical: 5px;
  padding-horizontal: 10px;
  border-color: lightgrey
`;
const MyLocationContainer = styled(ItemContainer)`
  border-bottom-color: ${theme('colorListDivider')};
  border-bottom-width:${theme('szListDivider')};
`

const KeyboardAvoiding = styled(KeyboardAvoidingView)`
  flex: 1;
`;

const Container = styled.View`
  background-color:white;
  flex: 1;
`;

const InputContainer = styled.View`
  ${Styles.start_center}
  border-bottom-width: 1px;
  border-bottom-color: #bbb;
  flex-direction: row;
  height: ${Sizes.scale(60)}px;
  padding-left:${Spacing.LG}px;
  padding-right:${Spacing.XS}px;
`;

const FilterInput = styled(BaseTextInput)`
  font-size: ${FontSize.Medium}px;
  flex: 1;
  color: black;
`;

const ClearButton = styled(TextButton)`
  font-size: ${FontSize.Small}px;
  color: ${Colors.darkText};
`;

const ItemTitle = styled(MainSemiBoldFont)`
  color:#676767;
  font-size:14px;
  margin-left: 15px;
  margin-right: 10px;
  width: 65%;
`;

export default GooglePlaceSelector;
