import React, {useEffect, useRef, useState} from 'react';
import {ScrollView, View, Modal} from "react-native";
import EVIcon from 'react-native-vector-icons/EvilIcons';
import SLIcon from 'react-native-vector-icons/SimpleLineIcons';
import styled from 'styled-components';
import WebView from 'react-native-webview';
import {MainBoldFont, MainMediumFont, MainRegularFont} from "@/views/Components";
import {Styles} from "@/styles";

const WebModal = (props) => {
  const [isRender, setRender] = useState(true);
  const [title, setTitle] = useState(props.title);
  const [url, setUrl] = useState(props.url);
  const [currentUrl, setCurrentUrl] = useState(props.url);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  let _webView = null;

  useEffect(() => {
    console.log(props.showModal)
    setTitle(props.title);
    setUrl(props.url);
  }, [props]);

  const close = () => {
    props.setModal(false);
  }

  const _onModalHide = () => {
    setTimeout(() => {
      props.onModalHide && props.onModalHide();
      setRender(false);
    }, 50)
  }

  const _onModalShow = () => {
  }

  const _onPressClose = () => {
    close();
  }

  const _onNavigationStateChange = (ev) => {
    setTitle(ev.title ? ev.title : title);
    setCurrentUrl(ev.url ? ev.url : currentUrl);
    setCanGoBack(ev.canGoBack ? ev.canGoBack : canGoBack);
    setCanGoForward(ev.canGoForward ? ev.canGoForward : canGoForward);
  }

  const _onPressBack = () => {
    _webView.goBack();
  }
  const _onPressForward = () => {
    _webView.goForward();
  }

  return (
    <Modal
      visible={props.showModal}
      onRequestClose={_onPressClose}
      transparent={true}
      animationType={'slide'}
      statusBarTranslucent={true}>
      <MainModal>
        <Content>
          <Body>
            <Left>
              <Title numberOfLines={1}>{title}</Title>
              <Url numberOfLines={1}>{url}</Url>
            </Left>
            <CloseBtn onPress={_onPressClose}>
              <EVIcon name={'close'} size={24} />
            </CloseBtn>
          </Body>
          <View style={{flex: 1, alignSelf: 'stretch'}}>
            <WebView
              ref={(node) => (_webView = node)}
              scalesPageToFit
              style={{flex: 1, alignSelf: 'stretch'}}
              source={{uri: url}}
              onNavigationStateChange={_onNavigationStateChange}
            />
          </View>
          <Bottom>
            <Btn onPress={_onPressBack}>
              <SLIcon name="arrow-left" color={'black'} size={24} />
            </Btn>
            <Btn onPress={_onPressForward}>
              <SLIcon name="arrow-right" color={'black'} size={24} />
            </Btn>
          </Bottom>
        </Content>
      </MainModal>
    </Modal>
  );
};

const Btn = styled.TouchableOpacity`
  padding-horizontal: 5px; margin-horizontal: 5px;
`

const Bottom = styled.View`
  flex-direction: row;
  background-color: #f6f6f6;
  border-top-color: #dedede;
  border-top-width: 1px;
  height: 50px;
  justify-content: space-between;
  align-items: center;
`

const CloseBtn = styled.TouchableOpacity`
  position: absolute;
  top: 10;
  right: 0;
  padding-horizontal: 10px;
`

const Url = styled(MainMediumFont)`
  color: #808080; font-size: 11px; 
`

const Title = styled(MainMediumFont)`
  color: black; font-size: 13px; 
`

const Left = styled.View`
  flex: 1; align-self: stretch; justify-content: center; align-items: center;
  padding-horizontal: 40px;
`

const Body = styled.View`
  flex-direction: row; background-color: #dedede; border-width: 1px; height: 40px;
  border-color: #dedede;
  border-bottom-color: black;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
`

const Content = styled.View`
  ${Styles.match_parent}
  margin-top: 40px;
  border-top-left-radius: 10;
  border-top-right-radius: 10;
  background-color: #F6f6f6;
`;

const MainModal = styled.View`
  justify-content: flex-end;
  align-items: center;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  flex: 1;
  background-color: #00000080;
`

export default WebModal;
