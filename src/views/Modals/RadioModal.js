import React, {useState} from 'react';
import styled from 'styled-components';
import MT from 'react-native-vector-icons/MaterialIcons';
import {FlatList, Text, View, Modal} from 'react-native';
import {MainBoldFont, MainMediumFont, MainRegularFont} from '@/views/Components';

const RadioModal = (props) => {
  let cancelled = false;
  const [data, setData] = useState(props.data);
  const [selected, setSelected] = useState(props.selected);

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
    setSelected(item);
  };

  return (
    <Modal visible={props.showModal} onRequestClose={_onPressCancel} transparent={true} animationType={'fade'} statusBarTranslucent={true}>
      <MainModal>
        <Container>
          <Header>
            <Title>Select</Title>
          </Header>
          <FlatList
            data={data.sort((a, b) => (a > b ? 1 : -1))}
            keyExtractor={(item, index) => `data_${index}`}
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
  color: black
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
  const isExist = selected === item;
  return (
    <Contain onPress={() => onPress(item)}>
      <View style={{marginRight: 15}}>
        <MT
          name={isExist ? 'radio-button-checked' : 'radio-button-unchecked'}
          size={24}
          color={isExist ? 'black' : 'grey'}
        />
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
  background-color: white;
  border-radius: 20px;
  width: 100%;
  height: 50%;
`;

const MainModal = styled.View`
  align-items: center;
  flex: 1;
  height: 100%;
  justify-content: center;
  background-color: #00000080;
  padding-horizontal: 10px;
`;
export default RadioModal;
