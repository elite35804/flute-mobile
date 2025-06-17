import React, {useState} from 'react';
import styled from 'styled-components';
import Mt from 'react-native-vector-icons/MaterialIcons';
import {FlatList, Text, View, Modal} from 'react-native';
import {MainBoldFont, MainMediumFont, MainRegularFont} from '@/views/Components';
import {drink} from '@/Constants';

const RadioPicker = (props) => {
  let cancelled = false;
  const [drinks, setDrinks] = useState(drink);
  const [selected, setSelected] = useState([]);
  const [all, setAll] = useState(false);

  const _onPressCancel = () => {
    cancelled = true;
    close();
  };

  const close = () => {
    props.setModal(false);
  };

  const _onPressOk = () => {
    cancelled = false;
    close();
    props.onSelected && props.onSelected(selected);
  };

  const onPressItem = (item) => {
    const items = [...selected];
    const isExist = items.find((s) => s === item);
    if (isExist) {
      const index = items.findIndex((i) => i === item);
      items.splice(index, 1);
      setSelected(items);
    } else {
      items.push(item);
      setSelected(items);
    }
  };

  const onPressAll = () => {
    const isAll = all;
    setAll(!isAll);
    if (!isAll) {
      setSelected([...drinks]);
    } else {
      setSelected([]);
    }
  };

  return (
    <Modal
      visible={props.showModal}
      onRequestClose={_onPressCancel}
      transparent={true}
      animationType={'slide'}
      statusBarTranslucent={true}>
      <MainModal>
        <Container>
          <Header>
            <Title>Select</Title>
          </Header>
          <Contain onPress={onPressAll}>
            <View style={{marginRight: 15}}>
              <Mt name={all ? 'check-box' : 'check-box-outline-blank'} size={24} color={all ? 'black' : 'grey'} />
            </View>
            {all ? <ItemText>All Drinks</ItemText> : <ItemLightText>All Drinks</ItemLightText>}
          </Contain>
          <FlatList
            data={drinks.sort((a, b) => (a > b ? -1 : 1))}
            keyExtractor={(item, index) => `drinks_${index}`}
            renderItem={(prop) => {
              return <Item {...prop} onPress={onPressItem} selected={selected} />;
            }}
          />
          <Bottom>
            <ActBtn>
              <ActTitle onPress={_onPressCancel}>CANCEL</ActTitle>
            </ActBtn>
            <ActBtn onPress={_onPressOk}>
              <ActTitle>OK</ActTitle>
            </ActBtn>
          </Bottom>
        </Container>
      </MainModal>
    </Modal>
  );
};

const ActBtn = styled.TouchableOpacity`
  padding-horizontal: 15px;
  padding-vertical: 5px;
`;

const ActTitle = styled(MainMediumFont)`
  font-size: 16px;
  color: black;
`;

const Bottom = styled.View`
  height: 70px;
  border-top-width: 0.4px;
  border-color: #d8d8d8;
  justify-content: center;
  align-items: center;
  flex-direction: row;
`;

const Item = ({item, index, onPress, selected}) => {
  const isExist = selected.find((s) => s === item);
  return (
    <Contain onPress={() => onPress(item)}>
      <View style={{marginRight: 15}}>
        <Mt name={isExist ? 'check-box' : 'check-box-outline-blank'} size={24} color={isExist ? 'black' : 'grey'} />
      </View>
      {isExist ? <ItemText>{item}</ItemText> : <ItemLightText>{item}</ItemLightText>}
    </Contain>
  );
};

const ItemText = styled(MainMediumFont)`
  font-size: 16px;
  color: black;
`;

const ItemLightText = styled(MainRegularFont)`
  font-size: 16px;
  color: black;
`;

const Contain = styled.TouchableOpacity`
  align-items: center;
  flex-direction: row;
  padding-horizontal: 20px;
  height: 50px;
`;

const Title = styled(MainBoldFont)`
  font-size: 20px;
  color: black;
`;

const Header = styled.View`
  height: 70px;
  border-bottom-width: 0.4px;
  border-color: #d8d8d8;
  justify-content: center;
  padding-horizontal: 20px;
`;

const Container = styled.View`
  overflow: hidden;
  background-color: white;
  border-radius: 20px;
  width: 100%;
  height: 65%;
`;

const MainModal = styled.View`
  align-items: center;
  padding-bottom: 10px;
  padding: 10px;
  height: 100%;
  width: 100%;
  background-color: #00000080;
`;
export default RadioPicker;
