import React, {useState, useEffect, useCallback, useMemo} from 'react'
import {View, KeyboardAvoidingView, FlatList, Platform} from 'react-native';
import styled from 'styled-components/native';
import {isNil, isEmpty, get, defaultTo} from 'lodash';

import {Styles, Colors, Images, Sizes} from '@/styles';
import {FontSize, Spacing} from '@/styles/Sizes';
import {StyledText, BaseTextInput, TextButton, CloseButton, ItemContainer, ItemSeparator} from '@/views/Components';
import {useOvermind} from '@/store';

export default SiteSelector = (props) => {

  function filterSchools(schools, keyword) {
    let filtered = defaultTo(schools, []);
    if (isEmpty(keyword)) {
      return filtered;
    }
    keyword = keyword.toLowerCase();
    filtered = filtered.filter(item => {
      return [item.name, item.address2, item.address, item.city, item.state, item.country]
        .filter(item => !isEmpty(item))
        .find(elem => elem.toLowerCase().includes(keyword))
    });
    return filtered;
  }

  const {state, actions} = useOvermind();
  const [keyword, setKeyword] = useState("")

  const onSelect = (site) => {
    if (props.route.params && props.route.params.onSelect) {
      props.route.params.onSelect(site)
    }
    props.navigation.pop()
  }

  return (
    <KeyboardAvoiding behavior="padding" enabled={Platform.OS === "ios"}>
      <Container>
        <InputContainer>
          <FilterInput
            placeholder={"Enter school name..."}
            placeholderTextColor={'black'}
            value={keyword}
            onChangeText={setKeyword}
          />
          <ClearButton onPress={() => setKeyword("")}>CLEAR</ClearButton>
          <CloseButton onPress={() => props.navigation.pop()}/>
        </InputContainer>
        <FlatList
          data={filterSchools(state.sites, keyword)}
          keyExtrator={(item, index) => index.toString()}
          renderItem={(props) => (
            <ItemContainer onPress={() => onSelect(props.item)}>
              <SchoolItem {...props} />
            </ItemContainer>
          )}
          ItemSeparatorComponent={ItemSeparator}
        />
      </Container>
    </KeyboardAvoiding>
  )
}

const SchoolItem = ({item}) => {
  const address = [item.address2, item.address, item.city, item.state, item.country].filter(item => !isEmpty(item)).join(' ');
  return (
    <SchoolItemContainer>
      <SchoolItemTitle>{item.name}</SchoolItemTitle>
      <SchoolItemAddress>{address}</SchoolItemAddress>
    </SchoolItemContainer>
  );
}

const SchoolItemContainer = styled.View`
  flex: 1;
`;

const SchoolItemTitle = styled(StyledText)`
  fontSize: ${FontSize.Medium}px;
  color: ${Colors.darkText};
`;

const SchoolItemAddress = styled(StyledText)`
  fontSize: ${FontSize.Small}px;
  color: ${Colors.lightText};
`;

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
  font-size: ${FontSize.Large}px;
  flex: 1;
  color: black;
`;

const ClearButton = styled(TextButton)`
  font-size: ${FontSize.Small}px;
  color: ${Colors.darkText};
`;
