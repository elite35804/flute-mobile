import React, {useState} from 'react';
import {ScrollView, View} from 'react-native';
import styled from 'styled-components';
import {Styles} from '@/styles';
import {Images} from '@/styles/Images';
import {MainMediumFont} from '@/views/Components';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import IOIcon from 'react-native-vector-icons/Ionicons';
import {useOvermind} from '@/store';
import {json} from 'overmind';
import {ModalHeader} from '@/views/Components/ModalHeader';

const SocialNetwork = (props) => {
  const {state, actions} = useOvermind();
  const user = json(state.currentUser);
  const [instagram, setInstagram] = useState(user.settings?.instagramUsername);
  const [facebook, setFacebook] = useState(user.settings?.facebookEmail);
  const [linkedin, setLinkedin] = useState(false);
  const [twitter, setTwitter] = useState(user.settings?.twitterUsername);
  const [snapChat, setSnapChat] = useState(false);

  const _renderSocialButton = (icon, text, connected, enabled, onPress, style) => {
    const htick = 24;
    return (
      <ItemView enabled={enabled}>
        <ItemBtn connected={connected} enabled={enabled}>
          <FAIcon name={icon} size={26} color={'white'} />
          <ItemText>{enabled && connected ? 'CONNECTED' : text}</ItemText>
          {enabled && connected && (
            <IconBtn onPress={onPress}>
              <FAIcon name="unlink" color={'white'} size={20} />
            </IconBtn>
          )}
        </ItemBtn>
        {enabled && connected && (
          <Border>
            <IOIcon name="md-checkmark" size={20} color="#E8E8E8" />
          </Border>
        )}
      </ItemView>
    );
  };
  return (
    <Container>
      <Bg source={Images.bg_setting} />
      <ModalHeader title={'Social Networks'} {...props} />
      <ScrollView contentContainerStyle={{marginTop: 20, alignItems: 'center'}}>
        <Title>Connect social accounts to see more{'\n'}activity. Connect all accounts.</Title>
        {_renderSocialButton('instagram', 'CONNECT WITH INSTAGRAM', instagram, true, () => {})}
        {_renderSocialButton('facebook-square', 'CONNECT WITH FACEBOOK', facebook, false, () => {})}
        {_renderSocialButton('linkedin-square', 'CONNECT WITH LINKEDIN', linkedin, false, () => {})}
        {_renderSocialButton('twitter-square', 'CONNECT WITH TWITTER', twitter, false, () => {})}
      </ScrollView>
    </Container>
  );
};

const Border = styled.View`
  background-color: '#31d10b; width: 24px; height: 24px; border-radius: 12px;
  position: absolute; ${Styles.center} left: 0; top: 0;
`;

const IconBtn = styled.TouchableOpacity`
  align-self: stretch;
  padding-horizontal: 10px;
  ${Styles.center}
  margin-right: -10px;
`;

const ItemText = styled(MainMediumFont)`
  color: white;
  font-size: 14px;
  margin-left: 10px;
  flex: 1;
`;

const ItemBtn = styled.TouchableOpacity`
  flex-direction: row;
  background-color: ${(props) => (props.connected || !props.enabled ? '#777' : '#000')}
  width: 280px;
  height: 50px;
  ${Styles.start_center}
  padding-horizontal: 15px;
`;

const ItemView = styled.View`
  margin-top: 5px;
  padding-top: 12px;
  padding-horizontal: 12px;
  opacity: ${(props) => (!props.enabled ? 0.1 : 1)};
`;

const Title = styled(MainMediumFont)`
  text-align: center;
  font-size: 16px;
  color: black;
`;

const Bg = styled.Image`
  ${Styles.absolute_full}
  width: 100%;
  height: 100%;
`;

const Container = styled.View`
  ${Styles.match_parent}
  background-color: white;
`;

export default SocialNetwork;
