import React, {useEffect, useRef, useState} from 'react';
import styled from 'styled-components';
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  View,
  Modal,
  Alert,
} from 'react-native';
import {Styles} from '@/styles';
import {useOvermind} from '@/store';
import SLIcon from 'react-native-vector-icons/SimpleLineIcons';
import MTIcon from 'react-native-vector-icons/MaterialIcons';
import {RNCamera} from 'react-native-camera';
import Geolocation from '@react-native-community/geolocation';
import {MainMediumFont, MainRegularFont, MainSemiBoldFont} from '@/views/Components';
import {Images} from '@/styles/Images';
import {json} from 'overmind';
import ImagePicker from 'react-native-image-crop-picker';
import {isEmpty, get, map} from 'lodash';
import {ModalHeader} from '@/views/Components/ModalHeader';
import HelpModal from '@/views/Modals/HelpModal';
import ErrorModal from '@/views/Modals/ErrorModal';
import {MaterialIndicator} from 'react-native-indicators';
import PaymentErrorModal from '../Modals/PaymentErrorModal';
import PromoErrorModal from '../Modals/PromoErrorModal';
import DuplicateErrorModal from '../Modals/DuplicateErrorModal';
import PromoModal from '../Modals/Promo';
import PromoSuccessModal from '../Modals/PromoSuccessModal';

const Promo = (props) => {
  const {state, actions} = useOvermind();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState('pending');
  console.log(props.route.params);
  // const [animCampaign, setAnimCampaign] = useState(new Animated.Value(0));
  // const [animLocation, setAnimLocation] = useState(new Animated.Value(0));
  const [isShowCampaign, setShowCampaign] = useState(false);
  const [isShowLocation, setShowLocation] = useState(false);
  const [showModal, setModal] = useState(false);
  const [campaignInput, setCampaignInput] = useState('');
  const [locationInput, setLocationInput] = useState('');
  const [selectedCampaign, setSelectedCampaign] = useState(undefined);
  const [selectedLocation, setSelectedLocation] = useState(undefined);
  const [userId, setUserId] = useState(state.currentUser.id);
  const [offers, setOffers] = useState(json(state.ad?.adByLocation));
  const [googlePlaces, setGooglePlaces] = useState([]);
  const [mounted, setMounted] = useState(false);
  const [promo, setPromo] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [sourceUrl, setSourceUrl] = useState(null);
  const [base64Image, setBase64] = useState(null);
  const [layoutCamera, setLayout] = useState({});
  const [showErrorModal, setErrorModal] = useState(false);
  const [isShow, setShow] = useState(false);
  const [isShowDuplicate, setShowDuplicate] = useState(false);
  const [count, setCount] = useState(0);
  const [location, setLocation] = useState(null);
  const [isShowPromoSuccess, setShowPromoSuccess] = useState(false);
  const _camera = useRef(null);
  const _editCampaign = useRef(null);
  const _editLocation = useRef(null);
  const campaign = props.route?.params?.campaign;

  let timer = null;
  let recognized = false;

  const isAuthorized = () => authorized === 'authorized';
  const isPending = () => authorized === 'pending';
  const isDenied = () => authorized === 'denied';

  useEffect(() => {
    setMounted(true);
    checkInited();
    getLocation();
    return () => {
      setMounted(false);
      stopCheck();
    };
  }, []);

  useEffect(() => {
    const instantRebates = [...json(state.user.transactions)]
      .filter((item) => {
        const isCampaign = item.isCampaign;
        const isDebit = !isCampaign && (item.usedOnTab || item.usedForGift || item.usedForSplit);
        const isFlute = !isCampaign && !isDebit;
        const isSent = get(item, 'sentFrom.id', '') === state.currentUser.id;
        const isDelivery = !!(item.campaign && item.campaign.isDelivery);
        return isFlute && !isSent && item.isAccepted && item.isRebate && !isDelivery;
      })
      .map((item) => item?.campaign);
    setOffers(
      json(state.ad?.adByLocation)
        .filter((a) => !state?.user?.redeemedCampaigns?.find((r) => r.id === a.id))
        .filter((item) => !instantRebates?.find((re) => re.id === item.id))
    );
  }, [state.ad?.adByLocation]);

  const getLocation = async () => {
    const location = await _getCurrentLocation();
    const lat = location ? location.lat : 0;
    const lon = location ? location.lng : 0;
    setLocation({lat, lon});
  };

  const stopCheck = () => {
    if (timer) clearInterval(timer);
    timer = null;
  };

  const checkInited = () => {
    setTimeout(() => setLoading(false), 200);
    timer = setInterval(() => {
      if (!_camera) return;
      const status = _camera.current?.getStatus();
      if (status === RNCamera.Constants.CameraStatus.PENDING_AUTHORIZATION) return;
      setAuthorized(status === RNCamera.Constants.CameraStatus.READY ? 'authorized' : 'denied');
      stopCheck();
    }, 100);
  };

  const _onBarcodeRead = (e) => {
    const barcode = e.data;
    recognized = true;
    _requestPromo(promo, base64Image);
  };

  const _openCampaign = (item) => {
    const ads = item.ads;
    if (ads.length) {
      actions.ad.setFluteAd(ads[0]);
      props.navigation.navigate('WalletAd');
    }
  };

  const _onGoogleBarcodeRead = (e) => {
    if (!e.barcodes || !e.barcodes.length) return;

    _onBarcodeRead(e.barcodes[0]);
  };

  const _requestPromo = async (promo, base64Image, dontShowSuccess, locationPlaceId) => {
    // actions.hud.show();
    try {
      const res = await actions.user.validateFluteCode({
        userId: state.currentUser.id,
        promoCode: promo,
        image: base64Image,
        locationPlaceId,
      });
      console.log(res);
      if (res?.isDuplicated) {
        setCount(count + 1);
        setSourceUrl(null);
        setAvatar(null);
        setBase64(null);
        if (isShowLocation) _onPressCloseLocationPopup();
        // setTimeout(() => {
        setShowDuplicate(true);
        // }, 1000);
        // Alert.alert('Flute', 'Invalid Promo Code');
        return false;
      } else if (!res) {
        setCount(count + 1);
        setSourceUrl(null);
        setAvatar(null);
        setBase64(null);
        if (isShowLocation) _onPressCloseLocationPopup();
        // setTimeout(() => {
        setShow(true);
        // }, 1000);
        // Alert.alert('Flute', 'Invalid Promo Code');
        return false;
      }
      await actions.user.getWalletTransactions();
      await actions.wallet.getWalletBalance({userId: state.currentUser.id});

      // if (!dontShowSuccess) {
      setShowPromoSuccess(true);
      await actions.user.userRedeemedCampaigns();
      // }

      // return true;
      //this._onPressBack();
    } catch (ex) {
      console.log(ex, 'Request Promo Issue');
      setErrorModal(true);
    } finally {
      // actions.hud.hide();
    }
    return false;
  };

  const onPressCapture = async () => {
    const options = {
      width: 512,
      height: 512,
      base64: true,
      fixOrientation: true,
    };

    try {
      const picked = await _camera.current.takePictureAsync(options);
      if (picked) {
        setSourceUrl(picked.uri);
        setAvatar(picked.uri);
        setBase64(picked.base64);
      }
    } catch (e) {
      console.log('UserSetting::_onPressAvatar failed: ', e);
    }
  };

  const onPressSendPhoto = () => {
    if (isEmpty(base64Image)) {
      actions.alert.showError({message: 'Please take a picture or select photo from gallery', title: 'Flute'});
      return;
    }

    recognized = true;
    console.log(campaign, 'campaign');
    if (campaign?.id) {
      // _showLocations();
      _onPressCampItem();
    } else {
      _showCampaigns();
    }
  };

  const _onPressPromo = () => {
    if (isEmpty(promo)) {
      actions.alert.showError({message: 'Please enter promo code', title: 'Flute'});
      return;
    }

    recognized = true;
    _requestPromo(promo, base64Image);
  };

  const _showCampaigns = () => {
    // Animated.timing(animCampaign, {
    //   toValue: 1,
    //   duration: 300,
    //   useNativeDriver: true,
    // }).start(() => {
    //   _editCampaign.current.focus();
    // });
    setShowCampaign(true);
    setTimeout(() => {
      _editCampaign.current.focus();
    }, 300);
  };

  const _showLocations = () => {
    if (selectedCampaign >= 0 || campaign?.id) {
      if (!campaign?.id) {
        _onPressCloseCampPopup();
      }

      setShowLocation(true);
      setTimeout(() => {
        _editLocation.current.focus();
      }, 300);
      // Animated.timing(animLocation, {
      //   toValue: 1,
      //   duration: 300,
      //   useNativeDriver: true,
      // }).start(() => {
      //   _editLocation.current.focus();
      // });
    } else {
      actions.alert.showError({message: 'Please select your offer!', title: 'Flute'});
      return false;
    }
  };

  const _onPressCloseCampPopup = () => {
    _editCampaign.current.blur();
    // Animated.timing(animCampaign, {
    //   toValue: 0,
    //   duration: 300,
    //   useNativeDriver: true,
    // }).start();
    setShowCampaign(false);
  };

  const _onPressCloseLocationPopup = () => {
    _editLocation?.current?.blur?.();
    // Animated.timing(animLocation, {
    //   toValue: 0,
    //   duration: 300,
    //   useNativeDriver: true,
    // }).start();
    setShowLocation(false);
  };

  const _onPressCampItem = async () => {
    if (loading) return false;
    // if (selectedLocation >= 0 || campaign?.id) {
    setLoading(true);
    try {
      const item = campaign || offers[selectedCampaign];
      // const location = googlePlaces[selectedLocation];

      // _onPressCloseCampPopup();

      const result = await _requestPromo(item.id, base64Image, true); // location?.place_id

      // if (!result) return;

      // _afterRebateChecked(item);
    } catch (e) {
    } finally {
      setLoading(false);
    }
    // } else {
    //   actions.alert.showError({title: 'Flute', message: 'Please select venue where redeemed your offer!'});
    //   return false;
    // }
  };

  const _afterRebateChecked = (item) => {
    // Check if survey exists.
    _afterSurvey();
  };

  const _afterSurvey = async () => {
    // actions.alert.showSuccess({
    //   title: 'Flute',
    //   message: 'Your redemption has been successfully submitted. Cash will be added to your wallet shortly.',
    // });

    await actions.user.userRedeemedCampaigns();

    // Go to home screen.
    // props.navigation.pop();
  };

  const _onChangeLocationInput = async (text) => {
    setLocationInput(text);
    const {searchGooglePlaces} = await actions.google.searchGooglePlaces({keyword: text, location});
    setGooglePlaces(searchGooglePlaces);
  };

  const _onToggleCampItem = (index) => {
    if (index === selectedCampaign) {
      setSelectedCampaign(undefined);
    } else {
      setSelectedCampaign(index);
    }
  };

  const _onToggleLocationItem = (index) => {
    if (index === selectedLocation) {
      setSelectedLocation(undefined);
    } else {
      setSelectedLocation(index);
    }
  };

  const _filterCampaign = (text, campaigns) => {
    campaigns = campaigns || offers;
    if (!campaigns || !campaigns.length) return [];
    if (!text) return campaigns;

    text = text.toLowerCase();
    const filtered = campaigns.filter((s) => {
      if ((s.name || '').toLowerCase().indexOf(text) >= 0) return true;
      /*
      if ((s.streetAddress || '').toLowerCase().indexOf(text) >= 0) return true;
      if ((s.city || '').toLowerCase().indexOf(text) >= 0) return true;
      if ((s.state || '').toLowerCase().indexOf(text) >= 0) return true;
      */
      return false;
    });
    return filtered;
  };

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

  const _onChangeCampInput = (text) => {
    setCampaignInput(text);
    // setOffers(_filterCampaign(text));
  };

  const onPressHelp = () => {
    setModal(true);
  };

  const _onLayoutCamera = async ({nativeEvent: ev}) => {
    const layout = {...ev.layout};
    setLayout(layout);
  };

  const _renderCameraIOS = () => {
    const isIos = Platform.OS === 'ios';
    const BarcodeType = RNCamera.Constants.BarCodeType;
    const types = [
      BarcodeType.qr,
      BarcodeType.code128,
      BarcodeType.ean8,
      BarcodeType.ean13,
      BarcodeType.upce,
      BarcodeType.code39,
      BarcodeType.code93,
    ];
    const GoogleType = isIos ? null : RNCamera.Constants.GoogleVisionBarcodeDetection.BarcodeType;
    const googleTypes = isIos ? null : GoogleType.ALL;
    const cameraStyle = isIos
      ? {position: 'absolute', top: 0, bottom: 0, left: 0, right: 0}
      : {position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, width: Dimensions.get('window').width * 1.16};

    return (
      <CameraView>
        <RNCamera
          ref={_camera}
          style={cameraStyle}
          notAuthorizedView={<NoAuthView />}
          type={RNCamera.Constants.Type.back}
          // barCodeTypes={types}
          // onBarCodeRead={isIos ? _onBarcodeRead : null}
          // googleVisionBarcodeType={googleTypes}
          // onGoogleVisionBarcodesDetected={isIos ? null : _onGoogleBarcodeRead}
          onTextRecognized={null}
          onFacesDetected={null}
          flashMode="on"
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
        />
        {isAuthorized() && sourceUrl ? _renderPhoto() : _renderCameraMask()}
        {isAuthorized() && _renderCapture()}
      </CameraView>
    );
  };

  const NoAuthView = () => (
    <NoView>
      <NoText>No camera device detected</NoText>
    </NoView>
  );

  const _renderCameraAndroid = () => {
    return <View />;
  };

  const _renderPhoto = () => (
    <PhotoView>
      <Image
        source={{uri: sourceUrl}}
        style={{width: layoutCamera?.width, height: layoutCamera?.height, resizeMode: 'stretch', zIndex: 100000}}
      />
    </PhotoView>
  );

  const _renderCameraMask = () => {
    const size = Math.min(
      Dimensions.get('window').width - 140,
      Dimensions.get('window').height - StatusBar.currentHeight - 250
    );
    return (
      <PhotoView onLayout={_onLayoutCamera}>
        <HelpView onPress={onPressHelp}>
          <HelpBtn>
            <HelpText>?</HelpText>
          </HelpBtn>
        </HelpView>
        {/* <PHeader>
          <PTitle>Scan QR Code</PTitle>
        </PHeader>
        <View style={{position: 'absolute', right: 10, top: 10}}>
          <Image source={Images.ic_qrscan_mark} style={{width: 40, height: 40}} />
        </View> */}
        <View style={{width: size, height: size}}>
          <QRImage source={Images.ic_qrscan_areatl} style={{left: 0, top: 0}} />
          <QRImage source={Images.ic_qrscan_areatr} style={{right: 0, top: 0}} />
          <QRImage source={Images.ic_qrscan_areabl} style={{left: 0, bottom: 0}} />
          <QRImage source={Images.ic_qrscan_areabr} style={{right: 0, bottom: 0}} />
        </View>
      </PhotoView>
    );
  };

  const _renderCapture = () => {
    const isTaken = isAuthorized() && sourceUrl;
    const btnStyle =
      Platform.OS === 'ios'
        ? {
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
            marginHorizontal: 20,
          }
        : {
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
            marginHorizontal: 20,
            marginBottom: 10,
          };
    return (
      <View style={btnStyle}>
        {isTaken && !loading && (
          <RetakeBtn onPress={() => setSourceUrl(null)}>
            <MainSemiBoldFont style={{fontSize: 14, letterSpacing: 3, color: 'black'}}>RETAKE PHOTO</MainSemiBoldFont>
          </RetakeBtn>
        )}

        <ActionBtn onPress={!isTaken ? onPressCapture : onPressSendPhoto}>
          <Image
            source={Images.btn_opentab}
            style={{width: '100%', height: 45, position: 'absolute', left: 0, right: 0, top: 0, bottom: 0}}
          />

          {!loading ? (
            <MainSemiBoldFont style={{color: 'white', letterSpacing: 3, fontSize: 13}}>
              {!isTaken ? 'TAKE PHOTO' : 'SUBMIT PHOTO'}
            </MainSemiBoldFont>
          ) : (
            <MaterialIndicator size={17} color={'gray'} />
          )}
        </ActionBtn>
      </View>
    );
  };

  const _renderNoResult = () => (
    <SafeAreaView style={{justifyContent: 'center', alignItems: 'center', marginTop: 30}}>
      <MainMediumFont style={{color: '#929292', fontSize: 16}}>No campaigns found</MainMediumFont>
    </SafeAreaView>
  );

  const _renderNoLocationResult = () => (
    <SafeAreaView style={{justifyContent: 'center', alignItems: 'center', marginTop: 30}}>
      <MainMediumFont style={{color: '#929292', fontSize: 16}}>No venue found</MainMediumFont>
    </SafeAreaView>
  );

  const _renderCampaignsPopup = () => {
    // const animTrans = animCampaign.interpolate({
    //   inputRange: [0, 1],
    //   outputRange: [Dimensions.get('window').height, 0],
    // });
    // const transY = [{translateY: animTrans}];
    const items = _filterCampaign(
      campaignInput,
      offers?.length ? offers.map((value, index) => ({...value, selected: selectedCampaign === index})) : undefined
    );

    // const popupStyle =
    //   Platform.OS === 'ios'
    //     ? {
    //         position: 'absolute',
    //         left: 0,
    //         right: 0,
    //         bottom: 0,
    //         width: '100%',
    //         height: '100%',
    //         flex: 1,
    //         paddingTop: StatusBar.currentHeight,
    //         paddingBottom: 20,
    //         transform: transY,
    //         backgroundColor: '#000B',
    //         zIndex: 10010,
    //       }
    //     : {
    //         position: 'absolute',
    //         left: 0,
    //         right: 0,
    //         bottom: 0,
    //         width: '100%',
    //         height: '100%',
    //         flex: 1,
    //         paddingTop: StatusBar.currentHeight,
    //         paddingBottom: 20,
    //         transform: transY,
    //         backgroundColor: '#000B',
    //         zIndex: 10010,
    //       };
    return (
      <Modal
        visible={isShowCampaign}
        onRequestClose={() => setShowCampaign(false)}
        transparent={true}
        animationType={'slide'}
        statusBarTranslucent={true}>
        <KeyboardAvoidingView behavior="padding" style={{flex: 1}}>
          <ModalContainer>
            <SafeAreaView style={{flex: 1, width: '100%', marginTop: 30}}>
              <CampaignView>
                <CHeader>
                  <CTextInput
                    ref={_editCampaign}
                    placeholder="Enter invitation name..."
                    placeholderTextColor="#aaa"
                    value={campaignInput}
                    onChangeText={_onChangeCampInput}
                  />
                  <TouchableOpacity
                    style={{paddingHorizontal: 10, justifyContent: 'center', alignItems: 'center'}}
                    onPress={_showLocations}>
                    <MainMediumFont style={{color: '#3997F0', fontSize: 12}}>CONTINUE</MainMediumFont>
                  </TouchableOpacity>
                </CHeader>
                <FlatList
                  data={items}
                  keyExtractor={(item, index) => `school_${index}`}
                  renderItem={(props) => (
                    <CampaignItem {...props} openCampaign={_openCampaign} onToggleCampItem={_onToggleCampItem} />
                  )}
                  ListEmptyComponent={_renderNoResult}
                  style={{flex: 1, alignSelf: 'stretch'}}
                />
              </CampaignView>
              <CButton onPress={_onPressCloseCampPopup}>
                <MTIcon name="close" size={25} color="#fff" />
              </CButton>
            </SafeAreaView>
          </ModalContainer>
        </KeyboardAvoidingView>
      </Modal>
    );
  };

  const _renderLocationPopup = () => {
    // const animTrans = animLocation.interpolate({
    //   inputRange: [0, 1],
    //   outputRange: [Dimensions.get('window').height, 0],
    // });
    // const transY = [{translateY: animTrans}];
    const items =
      googlePlaces && googlePlaces.length
        ? googlePlaces.map((value, index) => ({...value, selected: selectedLocation === index}))
        : undefined;

    return (
      <Modal
        visible={isShowLocation}
        onRequestClose={() => setShowLocation(false)}
        transparent={true}
        animationType={'slide'}
        statusBarTranslucent={true}>
        <KeyboardAvoidingView behavior="padding" style={{flex: 1}}>
          <ModalContainer>
            <SafeAreaView style={{flex: 1, width: '100%', marginTop: 30}}>
              <CampaignView>
                <CHeader>
                  <CTextInput
                    ref={_editLocation}
                    placeholder="Where did you purchase?"
                    placeholderColor="#aaa"
                    value={locationInput}
                    onChangeText={_onChangeLocationInput}
                  />
                  <TouchableOpacity
                    style={{paddingHorizontal: 10, justifyContent: 'center', alignItems: 'center'}}
                    onPress={_onPressCampItem}>
                    {!loading ? (
                      <MainMediumFont style={{color: '#3997F0', fontSize: 12}}>FINALIZE</MainMediumFont>
                    ) : (
                      <MaterialIndicator size={17} color={'gray'} />
                    )}
                  </TouchableOpacity>
                </CHeader>
                <FlatList
                  data={items}
                  keyExtractor={(item, index) => `school_${index}`}
                  renderItem={(props) => <LocationItem {...props} onToggleLocationItem={_onToggleLocationItem} />}
                  ListEmptyComponent={_renderNoLocationResult}
                  style={{flex: 1, alignSelf: 'stretch'}}
                />
              </CampaignView>
              <CButton onPress={_onPressCloseLocationPopup}>
                <MTIcon name="close" size={25} color="#fff" />
              </CButton>
            </SafeAreaView>
          </ModalContainer>
        </KeyboardAvoidingView>
      </Modal>
    );
  };

  return (
    <Container>
      <ModalHeader title={'Promo'} description={'Scan QR code or photograph receipt'} {...props} />
      <View style={{backgroundColor: '#e6e6e6', zIndex: 1}}>
        <InputView>
          <FullBg>
            <Image
              source={Images.btn_wallet_price}
              style={{width: Dimensions.get('window').width, height: 90, resizeMode: 'stretch'}}
            />
          </FullBg>
          <Title>PROMO CODE</Title>
          <InputContent>
            <Input
              placeholder={'Enter Promo Code'}
              placeholderTextColor="#929292"
              returnKeyType="done"
              value={promo}
              onChangeText={setPromo}
            />
            <RightBtn onPress={_onPressPromo}>
              <SLIcon name="arrow-right" color="#929292" size={16} />
            </RightBtn>
          </InputContent>
        </InputView>
      </View>

      <OrView>
        <OrText>- OR -</OrText>
      </OrView>
      <Content>{_renderCameraIOS()}</Content>
      {_renderCampaignsPopup()}
      {_renderLocationPopup()}
      <HelpModal showModal={showModal} setModal={() => setModal(false)} />
      {/* <ErrorModal
        showModal={showErrorModal}
        setModal={() => setErrorModal(false)}
        message={'Failed to validate promo code.\nPlease try again.'}
      /> */}

      {count >= 2 ? (
        <PromoErrorModal
          showModal={isShow}
          setModal={() => {
            setShow(false);
            props.navigation.pop();
          }}
        />
      ) : (
        <PromoModal
          showModal={isShow}
          isRetry
          setModal={() => {
            setShow(false);
            setSourceUrl(null);
            setAvatar(null);
            setBase64(null);
            _onPressCloseLocationPopup();
          }}
        />
      )}
      <DuplicateErrorModal
        showModal={isShowDuplicate}
        setModal={() => {
          setShowDuplicate(false);
        }}
      />
      {/* <PaymentErrorModal
        showModal={showErrorModal}
        setModal={() => {
          console.log('error');
          setErrorModal(false);
          setSourceUrl(null);
          setAvatar(null);
          setBase64(null);
          _onPressCloseLocationPopup();
          props.navigation.pop();
          props.navigation.pop();
        }}
      /> */}
      <PromoSuccessModal
        showModal={isShowPromoSuccess}
        setModal={() => setShowPromoSuccess(false)}
        navigation={props.navigation}
      />
    </Container>
  );
};

const CampaignItem = ({item, index, onToggleCampItem, openCampaign}) => {
  return (
    <CItemView onPress={() => onToggleCampItem(index)}>
      <TouchableOpacity onPress={() => openCampaign(item)}>
        <Image
          source={{uri: item.ads[0]?.images?.iPhone}}
          defaultSource={Images.ic_no_user}
          style={{width: 50, height: 50}}
        />
      </TouchableOpacity>
      <View style={{marginLeft: 15, flex: 1}}>
        <MainMediumFont style={{color: 'black', fontSize: 14}}>{item.title}</MainMediumFont>
      </View>
      <View>
        <SLIcon name="check" color={item.selected ? '#c8a326' : '#ccc'} size={26} />
      </View>
    </CItemView>
  );
};

const LocationItem = ({item, index, onToggleLocationItem}) => {
  return (
    <CItemView onPress={() => onToggleLocationItem(index)}>
      <View style={{marginLeft: 15, flex: 1}}>
        <MainMediumFont style={{color: 'black', fontSize: 14}}>
          {item.formatted_address.includes(item.name) ? '' : item.name + ', ' + item.formatted_address}
        </MainMediumFont>
      </View>
      <View>
        <SLIcon name="check" color={item.selected ? '#c8a326' : '#ccc'} size={26} />
      </View>
    </CItemView>
  );
};

const ModalContainer = styled.View`
  ${Styles.center}
  flex: 1;
  width: 100%;
  height: 100%;
  background-color: #00000080;
`;
const HelpView = styled.TouchableOpacity`
  width: 21px;
  height: 21px;
  background-color: #ffffff50;
  border-radius: 11px;
  ${Styles.absolute_top};
  top: 22px;
  left: 20px;
  ${Styles.center}
`;

const HelpBtn = styled.View`
  width: 19px;
  height: 19px;
  border-radius: 10px;
  border-width: 1px;
  border-color: black;
`;

const HelpText = styled(MainMediumFont)`
  font-size: 16px;
  text-align: center;
  color: black;
  margin-top: -1px;
`;

const CButton = styled.TouchableOpacity`
  margin-bottom: 30px;
  align-self: center;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  border-radius: 50px;
  background-color: black;
`;

const CItemView = styled.TouchableOpacity`
  flex-direction: row;
  border-bottom-color: #e1e1e1;
  border-bottom-width: 1px;
  margin-horizontal: 10px;
  padding-vertical: 15px;
  ${Styles.start_center}
`;

const CTextInput = styled.TextInput`
  ${Styles.match_parent}
  margin-left: 20px;
  color: black;
  font-size: 15px;
  font-weight: 600;
`;

const CHeader = styled.View`
  flex-direction: row;
  height: 60px;
  border-bottom-width: 1px;
  border-bottom-color: #bbb;
`;
const CampaignView = styled.View`
  background-color: #ededed;
  border-radius: 10px;
  ${Styles.match_parent}
  ${Styles.start_center}
  margin-horizontal: 5px;
  margin-vertical: 15px;
  background-color: white;
  flex: 1;
`;

const RetakeBtn = styled.TouchableOpacity`
  background-color: #fff;
  height: 45px;
  border-color: #e6b900;
  border-width: 1px;
  overflow: hidden;
  align-self: stretch;
  ${Styles.center}
  margin-bottom: 10px;
`;

const ActionBtn = styled.TouchableOpacity`
  background-color: #e6b900;
  height: 45px;
  border-color: #e6b900;
  border-width: 1px;
  overflow: hidden;
  align-self: stretch;
  ${Styles.center}
  margin-bottom: 20px;
`;

const QRImage = styled.Image`
  position: absolute;
  width: 30px;
  height: 30px;
`;

const PHeader = styled.View`
  ${Styles.absolute_top}
  top: 20px;
  ${Styles.center}
`;

const PTitle = styled(MainSemiBoldFont)`
  color: white;
  font-size: 12px;
  text-align: center;
`;

const PhotoView = styled.View`
  ${Styles.match_parent}
  ${Styles.center}
`;

const NoView = styled.View`
  ${Styles.match_parent};
  ${Styles.start_center};
`;

const NoText = styled(MainRegularFont)`
  color: white;
  font-size: 17px;
  margin-top: 180px;
`;

const CameraView = styled.View`
  ${Styles.absolute_full}
`;

const Content = styled.View`
  ${Styles.match_parent};
`;

const OrText = styled(MainSemiBoldFont)`
  color: #777;
  font-size: 16px;
  padding-top: 8px;
  text-align: center;
`;

const OrView = styled.View`
  background-color: white;
  height: 40px;
  margin-top: -40px;
  z-index: 10;
`;

const RightBtn = styled.TouchableOpacity`
  align-self: stretch;
  ${Styles.center}
  padding-horizontal: 5px;
  padding-right: 10px;
`;

const Input = styled.TextInput`
  ${Styles.match_parent};
  margin-left: 10px;
  margin-right: 5px;
  font-size: 15px;
  color: black;
`;

const InputContent = styled.View`
  flex-direction: row;
  background-color: white; border-radius: 4px; margin-horizontal 30px; flex: 1; margin-bottom: 10px; margin-top: 5px;
  margin-horizontal: 10px;
`;

const Title = styled(MainSemiBoldFont)`
  font-size: 12px;
  margin-top: 10px;
  color: black;
`;

const FullBg = styled.View`
  ${Styles.absolute_full};
  overflow: hidden;
  background-color: white;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
`;

const InputView = styled.View`
  align-self: stretch;
  z-index: 9;
  margin-horizontal: 35px;
  ${Styles.center}
  height: 130px;
  padding-bottom: 40px;
  shadow-color: rgba(0, 0, 0, 0.4);
  shadow-opacity: 1px;
  shadow-radius: 8px;
  shadow-offset: {
    width: 0;
    height: 0;
  }
  elevation: 6;
`;

const Container = styled.View`
  ${Styles.match_parent};
  background-color: #e6e6e6;
`;

export default Promo;
