import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { isNil, isEmpty, get, defaultTo } from 'lodash';

import { Spacing, FontSize } from '@/styles/Dimension';
import { Sizes, Styles, Images, Colors } from '@/styles';
import { StyledText, MainBoldFont, UserAvatar, ThumbnailView, ThumbnailPlaceholder } from '@/views/Components';
import { useOvermind } from '@/store';

export default Component = ({ item, isEvent, onPress }) => {
  const { state, actions } = useOvermind();
  const user = state.currentUser;

  return (
    <Container>
      <UserAvatar avatar={item?.avatar} fullName={defaultTo(item?.fullName, `${item?.firstName || ''} ${item?.middleName || ''} ${item?.lastName || ''}`)} />
      <Body>
        <Title numberOfLines={1}>{item?.fullName}</Title>
        <Description>{item?.title}</Description>
      </Body>
      {isEvent && item?.id === user?.id &&
        <EventView onPress={() => onPress(item)}>
          <EventTitle>Are you attending?</EventTitle>
        </EventView>
      }
    </Container>
  )
}

const Container = styled(View)`
  flex: 1;
  flex-direction:row;
`

const EventView = styled.TouchableOpacity`
  right: 5;
  background-color: #B70000;
  border-radius: 4px;
  margin-vertical: 10px;
  align-items: center;
  justify-content: center;
`

const EventTitle = styled(MainBoldFont)`
  padding-vertical: 3px;
  padding-horizontal: 10px;
  font-size: 12px;
  line-height: 15px;
  color: #FFFFFF;
`

const Title = styled(StyledText)`
  color: black;
  font-size: 14px;
`;

const Description = styled(StyledText)`
  fontSize: 10px;
  color: grey;
`

const Body = styled.View`
  margin-left: 10px;
  flex:1
`
