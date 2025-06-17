import React from 'react'
import {View} from 'react-native'
import styled from 'styled-components/native'
import {MainBoldFont} from './Text';

export default Step = ({value, increase, decrease}) => {
  function _inc() {
    increase()
  }

  function _dec() {
    if (Math.abs(value - 0) < 0.001) {
      return
    }
    decrease()
  }

  return (
    <QuantityContainer>
      <MinusButton onPress={_dec}>
        <Quantity>-</Quantity>
      </MinusButton>
      <Quantity>{value || 0}</Quantity>
      <PlusButton onPress={_inc}>
        <Quantity>+</Quantity>
      </PlusButton>
    </QuantityContainer>
  )
}

const QuantityContainer = styled.View`
  width: 90px;
  height:27px;
  border-radius: 5px;
  border-color: #F2F2F2;
  border-width: 1px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

const Quantity = styled(MainBoldFont)`
  color: black;
  font-size: 14px;
  line-height: 17px;
  flex: 1;
  color: black;
  textAlign: center;
`

const MinusButton = styled.TouchableOpacity`
  width: 20px;
  height: 20px;
  align-items: center;
  justify-content: center;
`

const PlusButton = styled(MinusButton)`
`
