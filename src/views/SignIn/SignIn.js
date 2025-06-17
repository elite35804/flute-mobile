import React, {useEffect, useState, useRef} from 'react';
import Geolocation from '@react-native-community/geolocation';
import {View, Platform, Dimensions, TouchableOpacity} from 'react-native';
import styled from 'styled-components/native';
import {getVersion} from 'react-native-device-info';
import {useNavigation} from '@react-navigation/native';
import {Sizes, Styles} from '@/styles';
import {Images} from '@/styles/Images';
import {useOvermind} from '@/store';
import {Colors} from '@/styles/Colors';
import {MainRegularFont} from '@/views/Components';
import LoginModal from '@/views/Modals/LoginModal';
import {isEmpty} from 'lodash';
import Swiper from 'react-native-swiper';
import LottieView from 'lottie-react-native';
import {checkMultiple, PERMISSIONS, RESULTS} from 'react-native-permissions';
import Video, {VideoRef} from 'react-native-video';
import {MainSemiBoldFont} from '../Components';

const SignIn = (props) => {
  const {state, actions} = useOvermind();
  const {window, alert, hud, isLoggedIn} = state;
  const [modalVisible, setModalVisible] = useState(false);
  const [random, setRandom] = useState(0);
  let lottieViews = [];
  const userDataRef = useRef(null);
  const numberRef = useRef('');
  const navigation = useNavigation();
  const [isGuest, setGuest] = useState(false);
  useEffect(() => {
    setRandom(Math.floor(Math.random() * 3));
  }, []);
  const _getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        (result) => {
          resolve({
            lat: result.coords.latitude,
            lng: result.coords.longitude,
          });
        },
        (error) => {
          resolve(null);
        }
      );
    });
  };

  const _onLottieChanged = (index) => {
    console.log(index, 'index');
    const view = lottieViews[index];
    console.log(view, 'view');
    if (view) {
      view && view.reset();
      view && view.play();
    }
  };
  const _checkEmail = (email) => {
    if (isEmpty(email)) return false;
    const arr = email.toLowerCase().split('@');
    const isNum = /^\d+$/.test(arr[0]);
    if (isNum && arr[1] === 'flutedrinks.com') return false;
    if (isNum && arr[1] === 'local.com') return false;
    return true;
  };
  const _go2Next = async () => {
    actions.hud.show();
    try {
      let locationPermission = null;
      if (Platform.OS === 'ios') {
        locationPermission = await checkMultiple([
          PERMISSIONS.IOS.LOCATION_ALWAYS,
          PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
        ]);
      } else {
        locationPermission = await checkMultiple([PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION]);
      }

      console.log(locationPermission, 'locationPermission');
      actions.setLocPermission(
        Object.values(locationPermission)?.find((p) => p === RESULTS.GRANTED)
          ? RESULTS.GRANTED
          : Object.values(locationPermission)?.[0]
      );
      const location = await _getCurrentLocation();
      const lat = location ? location.lat : 0;
      const lng = location ? location.lng : 0;
      await actions.ad.checkForQualifiedAdsByLocation({userId: state.currentUser.id, ad: {lat, lon: lng}});
      // await actions.ad.checkForQualifiedAds({userId: state.currentUser.id, ad: {lat, lon: lng}});
      setModalVisible(false);
      await actions.userSurvey.getUserSurveys({where: {user: {id: state.currentUser?.id}}});
      if (!state.currentUser.dateOfBirth) {
        navigation.navigate('CaptureAge', {isGuest});
      } else if (!isGuest && !_checkEmail(state.currentUser?.email) || !state.currentUser?.gender || !state.currentUser?.fullName) {
        navigation.navigate('ProfileCheck');
      } else {
        navigation.navigate('Main');
      }
    } catch (e) {
      console.log(e);
    } finally {
      actions.hud.hide();
    }
  };
  useEffect(() => {
    /**
     * auto login
     */
    if (isLoggedIn) {
      _go2Next();
    }
  }, [isLoggedIn]);

  const _onPressLogin = () => {
    setModalVisible(true);
  };

  const _createAppUser = async (generateToken) => {
    const mobileNumber = numberRef.current;

    try {
      const data = await actions.createAppUser({mobileNumber, generateToken});

      console.log('Verification Code: ', data.verificationCode);
      userDataRef.current = data.user;
    } catch (exception) {
      // await actions.alert.showError('Request to send verification code failed', 'SignIn')
      // console.log('onLogin() - ', exception)
    }
  };

  const onLogin = async (mobileNumber) => {
    numberRef.current = mobileNumber;
    await _createAppUser(true);
  };

  const onVerify = async (code) => {
    setModalVisible(false);
    actions.hud.show();

    try {
      const user = userDataRef.current;
      const {token} = await actions.verifySmsCode({
        userId: user.id,
        verifyCode: code,
        mobileNumber: numberRef.current,
        device: Platform
      });

      if (token) {
        console.log('onVerify() - got token', token, user);

        await actions.loginWithToken({token, userId: user.id, version: getVersion()});
        actions.hud.hide();

        await _go2Next(); // Move to next screen
      }
    } catch (error) {
      await actions.alert.showError('Failed to verify the sms code', 'SignIn');
      console.log('onVerify() - ', error);
      actions.hud.hide();
    } finally {
      actions.hud.hide();
    }
  };
  /*
   *
   */
  const onResend = () => {
    _createAppUser(!userDataRef.current); // Only generate token when failed.
  };

  const dotStyle = {
    width: Sizes.hScale(6),
    height: Sizes.hScale(6),
    borderRadius: Sizes.hScale(3),
    marginLeft: Sizes.hScale(8),
    marginRight: Sizes.hScale(6),
  };
  let scene2Style = '';
  if (Platform.OS === 'ios') scene2Style = {marginTop: -40};
  else scene2Style = {marginTop: -60};
  return (
    <Container>
      <Body>
        <Swiper
          horizontal
          loop={false}
          showButtons={false}
          width={Dimensions.get('window').width}
          height={Dimensions.get('window').height}
          activeDotColor="#FFDE00"
          dotColor="#999"
          // paginationStyle={styles.pagination}
          activeDotStyle={dotStyle}
          dotStyle={dotStyle}
          removeClippedSubviews={false}
          onIndexChanged={_onLottieChanged}>
          <View style={{flex: 1, alignItems: 'center'}}>
            {/* <Bg source={Images[`bg_splash`]} /> */}

            <Video
              // Can be a URL or a local file.
              source={{uri: 'https://flute-media.s3.us-west-1.amazonaws.com/background-videos/no-text/2%2B.mp4'}}
              resizeMode="cover"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                width: '100%',
                height: Dimensions.get('window').height,
              }}
              repeat
            />
            <Overlay />
            <Logo source={Images.logo_tag} />

            {/* <Beta>
              <BetaText>BETA</BetaText>
            </Beta> */}
          </View>
          <LottieView
            ref={(node) => (lottieViews[1] = node)}
            loop={false}
            speed={1.8}
            autoPlay
            style={{flex: 1}}
            source={require('./lottie/universal-redemption.json')}
          />
        </Swiper>
        {/* <Bg source={Images[`bg_splash`]} />
        <Overlay />
        <Logo source={Images.logo_tag} /> */}
      </Body>
      <View style={{width: '100%', marginBottom: 50}}>
        <LoginBtn
          onPress={() => {
            _onPressLogin(true);
            setGuest(true);
          }}>
          <Title>L O G I N / S I G N U P</Title>
        </LoginBtn>
      </View>

      <LoginModal
        showModal={modalVisible}
        setModalVisible={setModalVisible}
        onLogin={onLogin}
        onVerify={onVerify}
        onResend={onResend}
      />
    </Container>
  );
};

export default SignIn;

const BetaText = styled(MainSemiBoldFont)`
  color: red;
  font-size: 10px;
`;

const Beta = styled.View`
  border-width: 1px;
  border-color: red;
  border-radius: 3px;
  padding-horizontal: 4px;
  padding-vertical: 3px;
  position: absolute;
  right: 10px;
  top: 40px;
`;

const Body = styled.View`
  ${Styles.start_center};
  ${Styles.absolute_full};
`;

const Logo = styled.Image`
  margin-top: 70px;
  width: 300px;
  height: 150px;
  resize-mode: contain;
`;

const Bg = styled.Image`
  ${Styles.absolute_full}
  width: ${Dimensions.get('window').width}px;
  height: ${Dimensions.get('window').height}px;
`;

const Overlay = styled.View`
  ${Styles.absolute_full};
  height: ${Dimensions.get('window').height}px;
  background-color: black;
  opacity: 0.5;
`;

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: flex-end;
  background-color: white;
`;

const LoginBtn = styled.TouchableOpacity`
  flex-direction: row;
  align-self: stretch;
  justify-content: center;
  align-items: center;
  padding-horizontal: 10px;
  padding-vertical: 10px;
  margin-horizontal: 10px;
  background-color: #2a2a2a;
  margin-bottom: 10px;
  height: ${Sizes.hScale(50)}px;
`;

const Title = styled(MainRegularFont)`
  align-self: center;
  font-size: 12px;
  color: ${Colors.white};
`;
