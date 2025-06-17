import React, {useState} from 'react';
import styled from 'styled-components';

import {MainBoldFont, MainMediumFont} from '@/views/Components';
import {useOvermind} from '@/store';

const FilterTab = ({titles, onPress, selected, isOrder, style, showBadge}) => {
  const {state} = useOvermind();
  const {currentUser} = state;

  return (
    <Container style={{zIndex: 20, backgroundColor: isOrder ? "#eaeaea" : 'white', ...style}}>
      <TabBar style={{
        zIndex: 20,
      }}>
        {titles.map((title, index) =>
          <ItemContainer
            key={index}
            onPress={() => {
              onPress(index)
            }}
            style={{
              backgroundColor: index === selected ? "black" : "#373737",
            }}>

            {index === selected ? <BoldText>{title}</BoldText> : <NormalText>{title}</NormalText>}
          </ItemContainer>
        )}
        {showBadge && currentUser?.unreadNotifications?.length > 0 && <BadgeContainer>
          <TopBadgeNumber>
            <BadgeText>{currentUser?.unreadNotifications?.length}</BadgeText>
          </TopBadgeNumber>
        </BadgeContainer>}
      </TabBar>
    </Container>
  )
}

export default FilterTab;

const Container = styled.View`
  background-color: white;
  align-items: center;
`

const TabBar = styled.View`
  marginTop: 10px;
  flex-direction: row;
  width: 312px;
  background-color: #373737;
  border-radius: 5px;
  height: 26px;
  padding:2px;
`

const ItemContainer = styled.TouchableOpacity`
  flex: 1;
  align-items: center;
  justify-content: center;
  border-radius: 3px;
`

const BoldText = styled(MainBoldFont)`
  font-size: 10px;
   color: #F3E322;
`

const NormalText = styled(MainMediumFont)`
  font-size: 10px;
  color: white;
  opacity: 0.3;
`

const BadgeContainer = styled.View`
  width: 100%;
  top: -10px;
  position: absolute;
`

const TopBadgeNumber = styled.View`
  position:absolute;
  right:-10px;
  top: 3px;
  width: 20px;
  height: 20px;
  border-radius: 10px;
  background-color: red;
  align-items: center;
  justify-content: center;
`

const BadgeText = styled(MainBoldFont)`
  font-size: 14px;
  color: white;
`
