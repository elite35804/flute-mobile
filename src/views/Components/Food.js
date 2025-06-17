import React, {useState, useEffect} from 'react';
import styled from 'styled-components/native';
import {FlatList} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

import {Colors} from '@/styles';
import {MainBoldFont, MainRegularFont} from './controls/Text';

const IngredientItem = ({o: props, selected, onPress}) => {
  return (
    <ItemContainer>
      <ItemTitle style={{color: selected ? "black" : Colors.greyText}}>
        {props.inventoryProduct && props.inventoryProduct.ingredient ? props.inventoryProduct.ingredient.name : "--"}
      </ItemTitle>
      <CheckBox onPress={onPress} style={{backgroundColor: selected ? "black" : "#E2E2E2"}}>
        <Feather name="check" size={20} color={selected ? "white" : "#E2E2E2"}/>
      </CheckBox>
    </ItemContainer>
  )
}

export const Ingredients = ({data, modifiers, onToggleIngredient, isEditOrder}) => {
  return (
    <Container isEditOrder={isEditOrder}>
      <SectionTitle isIngredient={true}>CHOOSE INGREDIENTS</SectionTitle>
      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => <IngredientItem
          {...item}
          onPress={() => onToggleIngredient(item.o)}
        />}
      />
    </Container>
  )
}

const AddonItem = (props) => {
  return (
    <ItemContainer>
      <Content>
        <AddonTitle>{props.name}</AddonTitle>
        <Price>${props.pricing[0].retailPrice.toFixed(2)} each</Price>
      </Content>
      <QuantityContainer isAdd={props.quantity > 0}>
        <MinusButton onPress={props.decrease}>
          <Quantity isAdd={props.quantity > 0}>-</Quantity>
        </MinusButton>
        <Quantity isAdd={props.quantity > 0}>{props.quantity || 0}</Quantity>
        <PlusButton onPress={props.increase}>
          <Quantity isAdd={props.quantity > 0}>+</Quantity>
        </PlusButton>
      </QuantityContainer>
    </ItemContainer>
  )
}

export const PickAddons = (props) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(props.data.filter(o => o.pricing && o.pricing[0] && o.pricing[0].retailPrice))
  }, [props.data]);

  const onIncrease = (item) => {
    if (item.quantity == undefined) {
      item.quantity = 1;

    } else {
      item.quantity = item.quantity + 1;
      props.onChange && props.onChange([...data], item.id, 'plus');
    }
    setData([...data]);
  }

  /*
  *
  */
  const onDecrease = (item) => {
    if (item.quantity == undefined || item.quantity == 0) {
      item.quantity = 0;

    } else {
      item.quantity = item.quantity - 1;
      props.onChange && props.onChange([...data], item.id, 'minus');
    }
    setData([...data]);
  }

  return (
    <Container>
      <SectionTitle>CHOOSE ADD-ONS</SectionTitle>

      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => <AddonItem
          {...item}
          increase={() => onIncrease(item)}
          decrease={() => onDecrease(item)}
        />}
      />
    </Container>
  )
}

const Container = styled.View`
  background-color: white;
  padding: 20px;
  border-top-width: ${props => props.isEditOrder ? '0' : '9px'};
  border-top-color: #EDEDED
`

const SectionTitle = styled(MainBoldFont)`
  color: ${props => props.isIngredient ? 'darkgrey' : 'black'};
  font-size: 14px;
  margin-bottom: 10px;
`

const ItemContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-vertical: 8px;
  justify-content: space-between;
`

const ItemTitle = styled(MainRegularFont)`
  font-size: 13px;
  color: black;
`;

const CheckBox = styled.TouchableOpacity`
  width: 20px;
  height: 20px;
  border-radius: 5px;
  justify-content: center;
  align-items: center;
`

const Content = styled.View`
  flex: 1;
`

const AddonTitle = styled(MainBoldFont)`
  font-size: 13px;
  line-height: 17px;
  color: #808080
`

const Price = styled(MainBoldFont)`
  font-size: 10px;
  line-height: 12px;
  color: #828282
`

const QuantityContainer = styled.View`
  width: 90px;
  height: 27px;
  border-radius: 5px;
  border-color: ${props => props.isAdd ? 'black' : '#F2F2F2'};
  border-width: 1px;
  flex-direction: row;
  align-items: center;
`

const Quantity = styled(MainBoldFont)`
  color: black;
  font-size: 14px;
  line-height: 17px;
  flex: 1;
  color: ${props => props.isAdd ? 'black' : '#DBDBDB'};
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
