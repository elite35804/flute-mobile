import React, {useRef, useState} from 'react';
import styled from 'styled-components';
import {Modal} from 'react-native';
import {Styles} from '@/styles';
import {MainBoldFont, MainRegularFont, StyledText} from '@/views/Components';
import {useOvermind} from '@/store';

const CaptureAgeModal = (props) => {
  const {state, actions} = useOvermind();
  const [data, setData] = useState({first: null, second: null, third: null, fourth: null, fifth: null, sixth: null});
  const first = useRef(null);
  const second = useRef(null);
  const third = useRef(null);
  const fourth = useRef(null);
  const fifth = useRef(null);
  const sixth = useRef(null);

  const onSetData = (key, item) => {
    if (item) {
      if (key === 'first') second.current.focus();
      else if (key === 'second') third.current.focus();
      else if (key === 'third') fourth.current.focus();
      else if (key === 'fourth') fifth.current.focus();
      else if (key === 'fifth') sixth.current.focus();
    }
    const oriData = {...data};
    oriData[key] = item;
    if (oriData[key]?.length > 1) return false;
    setData(oriData);
  };

  const onPressConfirm = async () => {
    const month = parseInt(data.first + data.second);
    const date = parseInt(data.third + data.fourth);
    let year = parseInt(data.fifth + data.sixth);
    console.log(month, date, year);
    if (isNaN(month) || isNaN(date) || isNaN(year)) {
      actions.alert.showError({message: 'Please input correct number', title: 'Flute'});
      return false;
    }

    if (month > 12) {
      actions.alert.showError({message: 'Please input valid month', title: 'Flute'});
      return false;
    }

    if (date > 31) {
      actions.alert.showError({message: 'Please input valid date', title: 'Flute'});
      return false;
    }

    if (year < 30) {
      year = 2000 + year;
    } else {
      year = 1900 + year;
    }

    if (new Date().getFullYear() - year < 21) {
      actions.alert.showError({message: 'You must be 21+ of age to use this app.', title: 'Flute'});
      return false;
    }

    const newDate = new Date(year, month - 1, date);
    console.log(newDate);
    actions.hud.show();
    try {
      const user = await actions.user.updateUserProfile({dateOfBirth: newDate});
      props.setModal();
      props.done(user);
    } catch (e) {
      console.log(e);
    } finally {
      actions.hud.hide();
    }
  };
  return (
    <Modal visible={props.showModal} transparent={true} animationType={'slide'} statusBarTranslucent={true}>
      <ModalContainer>
        <Body>
          <Title>Age Verification</Title>
          <Description>Are you 21?{'\n'}Enter your date of birth</Description>
          <Content>
            <InputView>
              <Input
                ref={first}
                keyboardType="number-pad"
                value={data.first}
                onChangeText={(val) => onSetData('first', val)}
              />
            </InputView>
            <InputView>
              <Input
                ref={second}
                keyboardType="number-pad"
                value={data.second}
                onChangeText={(val) => onSetData('second', val)}
              />
            </InputView>
            <Slash>/</Slash>
            <InputView>
              <Input
                ref={third}
                keyboardType="number-pad"
                value={data.third}
                onChangeText={(val) => onSetData('third', val)}
              />
            </InputView>
            <InputView>
              <Input
                ref={fourth}
                keyboardType="number-pad"
                value={data.fourth}
                onChangeText={(val) => onSetData('fourth', val)}
              />
            </InputView>
            <Slash>/</Slash>
            <InputView>
              <Input
                ref={fifth}
                keyboardType="number-pad"
                value={data.fifth}
                onChangeText={(val) => onSetData('fifth', val)}
              />
            </InputView>
            <InputView>
              <Input
                ref={sixth}
                keyboardType="number-pad"
                value={data.sixth}
                onChangeText={(val) => onSetData('sixth', val)}
              />
            </InputView>
          </Content>
          <Bottom onPress={onPressConfirm}>
            <BottomText>CONFIRM AGE</BottomText>
          </Bottom>
        </Body>
      </ModalContainer>
    </Modal>
  );
};

const ModalContainer = styled.View`
  ${Styles.center}
  flex: 1;
  width: 100%;
  height: 100%;
  background-color: #00000080;
`;

const BottomText = styled(MainRegularFont)`
  font-size: 10px;
  line-height: 30px;
  letter-spacing: 4.72px;
  color: black;
`;

const Bottom = styled.TouchableOpacity`
  position: absolute;
  bottom: 6px;
  left: 6px;
  right: 6px;
  align-self: stretch;
  justify-content: flex-end;
  margin-horizontal: 5px;
  background-color: #d6b839;
  border-radius: 5px;
  padding-vertical: 9px;
  ${Styles.center}
`;

const Slash = styled(MainBoldFont)`
  font-size: 30px;
  line-height: 37px;
  color: #c9c1c1;
  margin-horizontal: 5.5px;
`;

const Input = styled.TextInput`
  font-size: 10px;
  height: 80%;
  padding-horizontal: 4px;
  padding-vertical: 0px;
  margin: 0px;
  borderwidth: 0px;
  color: black;
`;

const InputView = styled.View`
  width: 39px;
  height: 57px;
  background-color: #e2e2e2;
  border-radius: 5px;
  ${Styles.center}
  margin-horizontal: 1.5px;
`;

const Content = styled.View`
  flex-direction: row;
  ${Styles.center};
  margin-top: 52px;
`;

const Description = styled(StyledText)`
  font-weight: 300;
  font-size: 15px;
  line-height: 18px;
  color: black;
`;

const Title = styled(MainBoldFont)`
  font-size: 30px;
  line-height: 37px;
  margin-top: 28px;
  color: black;
`;

const Body = styled.View`
  width: 318px;
  height: 293px;
  background-color: white;
  border-radius: 10px;
  ${Styles.start_center}
`;

export default CaptureAgeModal;
