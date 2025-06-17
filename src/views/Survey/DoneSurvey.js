import {Dimensions, SafeAreaView, Image} from 'react-native';
import React from 'react';
import styled from 'styled-components';
import {MainMediumFont} from '@/views/Components';
import {Images, Styles} from '@/styles';
import {useOvermind} from '@/store';

const DoneSurvey = (props) => {
  const {state, actions} = useOvermind();
  const onClose = async () => {
    try {
      actions.hud.show();
      props.navigation.navigate('Home');
      await actions.userSurvey.getUserSurveys({where: {user: {id: state.currentUser?.id}}});
    } catch (e) {
      console.log(e);
    } finally {
      actions.hud.hide();
    }
  };
  return (
    <Container>
      <Bg source={Images.ic_blur_back} />
      <SafeAreaView style={{flex: 1}}>
        <Content>
          <Title>Thanks{'\n'}for your feedback!</Title>
        </Content>
        <CloseBtn style={{shadowOffset: {width: 0, height: -2}}} onPress={onClose}>
          <Image source={Images.btn_social_send} />
        </CloseBtn>
      </SafeAreaView>
      <Close activeOpacity={1.0} onPress={onClose} />
    </Container>
  );
};

const Close = styled.TouchableOpacity`
  ${Styles.absolute_full};
`;

const CloseBtn = styled.TouchableOpacity`
  ${Styles.center}
  shadow-color: rgba(0,0,0,0.5);
  shadow-opacity: 1;
  shadow-radius: 6px;
  elevation: 3;
  margin-top: 24px;
  margin-bottom: 24px;
`;

const Title = styled(MainMediumFont)`
  font-size: 30px;
  color: white;
  text-align: center;
`;

const Content = styled.View`
  ${Styles.end_center};
  flex: 1;
`;

const Bg = styled.Image`
  ${Styles.absolute_full}
  width: ${Dimensions.get('window').width}px;
  height: ${Dimensions.get('window').height}px;
`;

const Container = styled.View`
  flex: 1;
  justify-content: center;
`;

export default DoneSurvey;
