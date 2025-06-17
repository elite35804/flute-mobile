import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import styled from 'styled-components/native';
import Feather from 'react-native-vector-icons/Feather';

import {MainRegularFont} from '@/views/Components';

export default RadioOptions = ({style, items, selected, onChange}) => {
  return (
    <View style={style}>
      {
        items.map((title, index) => (
          <TipRow onPress={() => onChange(index)}>
            <OptionBox style={{backgroundColor: selected == index ? "black" : "#DBDBDB"}}>
              <Feather name="check" size={16} color={selected == index ? "white" : "#DBDBDB"}/>
            </OptionBox>
            <TipTitle>{title}</TipTitle>
          </TipRow>
        ))
      }
    </View>
  )
}

const TipRow = styled.TouchableOpacity`
  flex-direction: row;
  height: 30px;
  align-items: center;
`

const OptionBox = styled.View`
  width: 20px;
  height: 20px;
  border-radius: 20px;
  align-items: center;
  justify-content: center;
`

const TipTitle = styled(MainRegularFont)`
  color: black;
  font-size: 12px;
  line-height: 15px;
  margin-left: 8px;
  flex: 1;
`
