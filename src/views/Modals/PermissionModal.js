import React, {useState} from 'react';
import styled from 'styled-components';
import {ScrollView, View, Modal} from 'react-native';
import {Images, Styles} from '@/styles';
import {MainMediumFont, MainSemiBoldFont} from '@/views/Components';
import {check, checkNotifications, PERMISSIONS, request, requestNotifications, RESULTS} from 'react-native-permissions';
import SLIcon from 'react-native-vector-icons/SimpleLineIcons';
import FIcon from 'react-native-vector-icons/Feather';
import {useOvermind} from '@/store';

const PermissionModal = (props) => {
  const {state, actions} = useOvermind();
  let cancelled = false;

  const _onPressCancel = () => {
    cancelled = true;
    close();
  };

  const close = () => {
    props.setModal(false);
  };

  const _onPressContinue = async () => {
    const location = await check(PERMISSIONS.IOS.LOCATION_ALWAYS);
    const notification = await checkNotifications();
    console.log(location, notification, '==========');
    if (location === RESULTS.DENIED) {
      const loc = await request(PERMISSIONS.IOS.LOCATION_ALWAYS);
      console.log(loc, 'loc');
    }

    if (notification.status === RESULTS.DENIED) {
      const not = await requestNotifications(['alert', 'sound']);
      console.log(not, 'not');
    }

    await actions.pushNotification.initialize();
    props.setModal(false);
  };
  const renderPermission = (icon, title, description, isSimple) => (
    <ItemView>
      <View style={{width: 40}}>
        {isSimple ? <SLIcon name={icon} size={20} color={'#000'} /> : <FIcon name={icon} size={20} color={'#000'} />}
      </View>
      <View>
        <ItemTitle>{title}</ItemTitle>
        <ItemDesc>{description}</ItemDesc>
      </View>
    </ItemView>
  );

  return (
    <Modal
      visible={props.showModal}
      onRequestClose={_onPressCancel}
      transparent={true}
      animationType={'slide'}
      statusBarTranslucent={true}>
      <MainModal>
        <Container>
          <ScrollView contentContainerStyle={{width: '100%'}}>
            <Header>
              <LogoView>
                <Logo source={Images.ic_flute} />
              </LogoView>
              <Title>Don't miss out!</Title>
              <Desc>{'We need you to allow certain\npermissions to get started'}</Desc>
            </Header>
            {renderPermission('bell', 'Notifications', 'So we can let you know when \nyou have drink offers', false)}
            {renderPermission(
              'map-pin',
              'Location',
              "So we can find venues and people\nnear you. Select 'Always Allow'",
              false
            )}
          </ScrollView>
          <Bottom>
            <ConfirmBtn onPress={_onPressContinue}>
              <BtnText>CONTINUE</BtnText>
            </ConfirmBtn>
            <SaveView>
              <SaveText>We've optimized to save battery life</SaveText>
            </SaveView>
          </Bottom>
        </Container>
      </MainModal>
    </Modal>
  );
};

const MainModal = styled.View`
  align-items: center;
  padding-bottom: 10px;
  padding: 10px;
  width: 100%;
  height: 100%;
  flex: 1;
  background-color: #00000080;
`;

const SaveText = styled(MainSemiBoldFont)`
  font-size: 15px;
  color: grey;
`;
const SaveView = styled.View`
  ${Styles.start_center}
`;

const BtnText = styled(MainMediumFont)`
  font-size: 12px;
  letter-spacing: 6px;
  color: black;
`;

const ConfirmBtn = styled.TouchableOpacity`
  background-color: #e6b900;
  height: 45px;
  border-color: #e6b900;
  border-width: 1px;
  margin-horizontal: 10px;
  margin-vertical: 20px;
  ${Styles.center}
`;

const Bottom = styled.View`
  margin-bottom: 35px;
  width: 100%;
`;

const ItemDesc = styled(MainSemiBoldFont)`
  font-size: 16px;
  margin-top: 5px;
  color: grey;
`;

const ItemTitle = styled(MainSemiBoldFont)`
  font-size: 16px;
  color: black;
`;

const ItemView = styled.View`
  flex-direction: row;
  margin-vertical: 15px;
`;

const Desc = styled(MainSemiBoldFont)`
  font-size: 16px;
  text-align: center;
  color: grey;
  margin-top: 10px;
`;

const Title = styled(MainSemiBoldFont)`
  font-size: 33px;
  text-align: center;
  margin-top: 15px;
  color: black;
`;

const Logo = styled.Image`
  width: 60px;
  height: 60px;
`;

const LogoView = styled.View`
  ${Styles.center}
  background-color: black;
  width: 70px;
  height: 70px;
  margin-top: 70px;
  border-radius: 35px;
`;

const Header = styled.View`
  ${Styles.start_center}
  margin-bottom: 15px;
`;

const Container = styled.SafeAreaView`
  ${Styles.match_parent}
  ${Styles.start_center}
  background-color: white;
  border-radius: 10px;
  margin-vertical: 70px;
`;

export default PermissionModal;
