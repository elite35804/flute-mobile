import React, {useState, useEffect} from 'react';
import {KeyboardAvoidingView, FlatList, Platform, TouchableOpacity} from 'react-native';
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
} from '@/views/Components';
import {Modal} from 'react-native';
import {useDelay} from '@/hooks/Utils';
import {useOvermind} from '@/store';
import {themeProp as theme} from '@/utils/CssUtil';
import {addressNoCountry} from '@/utils/MiscUtil';

const LocationModal = (props) => {
  const [keyword, setKeyword] = useState(props?.address || '');

  const {state, actions} = useOvermind();
  const {google} = state;
  const {placeResults} = google;

  const delayedSearch = useDelay(actions.google.searchGooglePlaces);

  useEffect(() => {
    delayedSearch({keyword});
  }, [keyword]);

  const finish = (place) => {
    props.onSelect(place);
    close();
  };

  const onSelect = (place) => {
    finish({
      name: place.name,
      address: place.formatted_address,
      details: place,
    });
  };

  const onSelectMyLocation = () => {
    Geolocation.getCurrentPosition(
      (info) => {
        const loc = `${info.coords.latitude.toFixed(3)}, ${info.coords.longitude.toFixed(3)}`;
        finish({
          name: `Use current location`,
          address: loc,
          details: info,
        });
      },
      (error) => {}
    );
  };

  const addresses = placeResults.filter(
    (p) => !isEmpty(p.formatted_address) && p.formatted_address.split(', ').length >= 4
  );

  const close = () => {
    props.setModal(false);
  };

  const _onPressClose = () => {
    close();
  };

  return (
    <Modal
      visible={props.showModal}
      onRequestClose={_onPressClose}
      transparent={true}
      animationType={'slide'}
      statusBarTranslucent={true}>
      <MainModal>
        <KeyboardAvoiding behavior="padding" enabled={Platform.OS === 'ios'}>
          <Container>
            <InputContainer>
              <FilterInput
                placeholder={'Enter location...'}
                placeholderTextColor={'grey'}
                value={keyword}
                onChangeText={setKeyword}
              />
              <ClearButton onPress={() => setKeyword('')}>CLEAR</ClearButton>
              <CloseButton onPress={() => props.setModal(false)} />
            </InputContainer>
            <FlatList
              data={addresses}
              keyExtrator={(item, index) => index.toString()}
              ListHeaderComponent={<MyLocation onPress={onSelectMyLocation} />}
              renderItem={({item}) => <PlaceItem onPress={() => onSelect(item)} item={item} />}
              ItemSeparatorComponent={ItemSeparator}
            />
          </Container>
        </KeyboardAvoiding>
      </MainModal>
    </Modal>
  );
};

const MyLocation = ({onPress}) => {
  return (
    <MyLocationContainer onPress={onPress}>
      <FAIcon name="location-arrow" color="#9b9b9b" size={16} />
      <ItemTitle>Current Location</ItemTitle>
    </MyLocationContainer>
  );
};

const PlaceItem = ({item, onPress}) => {
  return (
    <ItemContainer onPress={onPress}>
      <ItemTitle numberOfLines={4}>{addressNoCountry(item.formatted_address)}</ItemTitle>
    </ItemContainer>
  );
};

const MainModal = styled.View`
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  flex: 1;
  background-color: #00000080;
`;
const MyLocationContainer = styled(ItemContainer)`
  border-bottom-color: ${theme('colorListDivider')};
  border-bottom-width: ${theme('szListDivider')};
`;

const KeyboardAvoiding = styled(KeyboardAvoidingView)`
  flex: 1;
`;

const Container = styled.SafeAreaView`
  background-color: white;
  flex: 1;
`;

const InputContainer = styled.View`
  ${Styles.start_center}
  border-bottom-width: 1px;
  border-bottom-color: #bbb;
  flex-direction: row;
  height: ${Sizes.scale(60)}px;
  padding-left: ${Spacing.LG}px;
  padding-right: ${Spacing.XS}px;
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
  color: #676767;
  font-size: 14px;
  margin-left: 15px;
  margin-right: 10px;
  width: 65%;
`;

export default LocationModal;
