import {Alert, Platform, ScrollView, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import styled from 'styled-components';
import SLIcon from 'react-native-vector-icons/SimpleLineIcons';
import {Sizes, Styles} from '@/styles';
import {Images} from '@/styles/Images';
import LottieView from 'lottie-react-native';
import {useOvermind} from '@/store';
import {MainMediumFont, MainSemiBoldFont, StyledText} from '@/views/Components';
import TextInputFlat from '@/views/Components/EditInput';
import {json} from 'overmind';
import RadioModal from '@/views/Modals/RadioModal';
import {drink, tips} from '@/Constants';
import ImagePicker from 'react-native-image-crop-picker';
import {useActionSheet} from '@expo/react-native-action-sheet';
import {isEmpty} from 'lodash';
import {check, checkNotifications, PERMISSIONS, RESULTS} from 'react-native-permissions';
import PermissionModal from '@/views/Modals/PermissionModal';
import DateTime from '@/views/Components/datetimepicker';
import moment from 'moment';
import {decode} from 'base64-arraybuffer';
import AWS from 'aws-sdk';
const _checkEmail = (email) => {
  if (isEmpty(email)) return false;
  const arr = email.toLowerCase().split('@');
  const isNum = /^\d+$/.test(arr[0]);
  if (isNum && arr[1] === 'flutedrinks.com') return false;
  if (isNum && arr[1] === 'local.com') return false;
  return true;
};
const ProfileCheck = (props) => {
  const {state, actions} = useOvermind();
  const currentUser = json(state.currentUser);
  const [firstName, setFirstName] = useState(currentUser?.firstName);
  const [lastName, setLastName] = useState(currentUser?.lastName);
  const [username, setUsername] = useState(
    currentUser?.username === currentUser?.phones?.[0]?.number ? null : currentUser?.username
  );
  const [avatar, setAvatar] = useState(currentUser?.avatar || '');
  const [mdob, setMdob] = useState(currentUser?.dateOfBirth);
  const [avatarLocal, setAvatarLocal] = useState('');
  const [email, setEmail] = useState(_checkEmail(currentUser?.email) ? currentUser?.email : null);
  const [gender, setGender] = useState(currentUser?.gender);
  const [drinkOfChoice, setDrinkOfChoice] = useState(currentUser?.settings?.drinkOfChoice);
  const [showModal, setModal] = useState(false);
  const [showDrinkModal, setDrinkModal] = useState(false);
  const [showPermissionModal, setPermissionModal] = useState(false);
  const {showActionSheetWithOptions} = useActionSheet();
  const [layoutDesc, setLayoutDesc] = useState(null);
  const [mime, setMime] = useState(null);
  const _datePicker = useRef(null);

  useEffect(() => {
    permissionCheck();
  }, []);

  const permissionCheck = async () => {
    if (await _shouldPresentPermission()) {
      await _checkPermissions();
    } else {
    }
  };

  const _shouldPresentPermission = async () => {
    try {
      const location = await check(PERMISSIONS.IOS.LOCATION_ALWAYS);
      const notification = Platform.OS === 'ios' ? await checkNotifications() : 'authorized';
      return location === RESULTS.DENIED || notification.status === RESULTS.DENIED;
    } catch (e) {
      console.log(e);
    }
  };

  const _checkPermissions = async () => {
    setPermissionModal(true);
  };

  const onPressGender = () => {
    setModal(true);
  };

  const onPressDrinkOfChoice = () => {
    setDrinkModal(true);
  };

  const onPressDoB = () => {
    _datePicker.current.open(new Date(mdob), (dob) => {
      setMdob(dob);
    });
  };

  const getAWSCredential = async (actions) => {
    // const credential = await storage.getData("aws_credential");
    // if (new Date(credential?.s3?.Credentials.Expiration) > new Date()) {
    //   return { s3: credential?.s3, mediaConvert: credential?.mediaConvert };
    // } else {
    const {awsTempToken: s3Token} = await actions.user.awsTempToken({
      service: 's3',
    });
    const {awsTempToken} = await actions.user.awsTempToken({
      service: 'mediaConvert',
    });
    // await storage.saveData(
    //   { s3: s3Token, mediaConvert: awsTempToken },
    //   "aws_credential"
    // );
    return {s3: s3Token, mediaConvert: awsTempToken};
  };
  const onPressAvatar = () => {
    const options = ['Take New Photo', 'Photo Library', 'Cancel'];
    const cancelButtonIndex = 2;
    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      async (buttonIndex) => {
        const options = {
          width: 1400,
          height: 800,
          cropping: true,
          mediaType: 'photo',
          includeBase64: true,
        };

        try {
          let picked = null;
          if (buttonIndex === 1) {
            picked = await ImagePicker.openPicker(options);
          } else if (buttonIndex === 0) {
            picked = await ImagePicker.openCamera(options);
          }
          if (picked) {
            setMime(picked.mime);
            setAvatar(picked.data);
            setAvatarLocal(picked.path);
          }
        } catch (e) {
          console.log('UserSetting::_onPressAvatar failed: ', e);
        }
      }
    );
  };

  const isAvatar = (avatar && avatar.split(':')[0] === 'http') || avatar.split(':')[0] === 'https';

  const onLayoutDesc = ({nativeEvent: ev}) => {
    setLayoutDesc(ev.layout.y);
  };

  const _checkValid = () => {
    if (isEmpty(gender)) {
      return 'Please select title';
    }
    if (isEmpty(firstName)) {
      return 'Please enter first name';
    }
    if (isEmpty(lastName)) {
      return 'Please enter last name';
    }
    if (isEmpty(username)) {
      return 'Please enter username';
    }
    if (isEmpty(email)) {
      return 'Please enter email address';
    }
    if (!email.includes('@') || !email.includes('.')) {
      return 'Please enter valid email address';
    }

    if (isEmpty(drinkOfChoice)) {
      return 'Please select drink of choice';
    }

    return 'valid';
  };

  const _askSelectAvatar = () =>
    new Promise((resolve) => {
      Alert.alert('Flute', `Please upload your picture for the culture! And please... no bathroom selfies.`, [
        {
          text: 'OK',
          onPress: () => resolve(true),
        },
        {
          text: 'Do Later',
          onPress: () => resolve(false),
        },
      ]);
    });

  const _redirectPayment = async (paymentMethod) => {
    // gs.isGohome = true;
    // switch (paymentMethod) {
    //   case 'paypal':
    //     //navigation.navigate({ name: routes.names.app.paymentAddCard });
    //     try {
    //       const token = await apis.generateBraintreeToken();
    //       BTClient.setup(token);
    //       const nonce = await BTClient.showPayPalViewController();
    //       // call api
    //       await apis.addBTPaypal(nonce);
    //
    //       // Navigate to home screen
    //       navigation.navigate({ name: routes.names.app.home, params: {newUser: true} });
    //       g.visibleWelcom();
    //
    //     }catch(exception){
    //       drop.showError(c.appName, "Failed to add paypal payment");
    //     }
    //     break;
    //   case 'amex': case 'visa': case 'mastercard': case 'discover':
    //     gs.fromRegistration = true;
    //     navigation.navigate({ name: routes.names.app.paymentAddCard });
    //     break;
    //   case 'apple':
    //     this._onPressApplePay()
    //     break;
    // }
    console.log('++++++++++++++++++++++++++');
    props.navigation.navigate('AddCard', {newUser: true});
    return;
  };

  const _requestLater = async (paymentMethod) => {
    const valid = _checkValid();
    if (valid !== 'valid') {
      actions.alert.showError({message: valid, title: 'Flute'});
      return;
    }
    try {
      let needUpdate = false;
      const params = {
        settings: {},
      };

      if (firstName !== currentUser?.firstName) {
        params.firstName = firstName;
        needUpdate = true;
      }
      if (lastName !== currentUser?.lastName) {
        params.lastName = lastName;
        needUpdate = true;
      }
      if (gender !== currentUser?.gender) {
        if (gender === 'Mr') {
          params.gender = 'MALE';
        } else {
          params.gender = 'FEMALE';
        }
        needUpdate = true;
      }
      if (username !== state.currentUser?.username) {
        params.username = username;
        needUpdate = true;
      }
      if (email !== currentUser?.email) {
        params.email = email;
        needUpdate = true;
      }
      if (
        (mdob && new Date(mdob).getTime()) !==
        (state.currentUser.dateOfBirth && new Date(state.currentUser.dateOfBirth).getTime())
      ) {
        params.dateOfBirth = mdob;
        needUpdate = true;
      }
      if (drinkOfChoice !== currentUser?.drinkOfChoice) {
        params.settings.drinkOfChoice = drinkOfChoice;
        needUpdate = true;
      }

      if (avatar && avatar !== currentUser?.avatar) {
        const {s3} = await getAWSCredential(actions);
        console.log(s3, 's3');
        let filename = `/profiles/${state.currentUser?.id}-${new Date().getTime()}.png`;
        const s3Bucket = new AWS.S3({
          params: {Bucket: s3.bucket},
          apiVersion: '2006-03-01',
          region: s3.region,
          credentials: {
            accessKeyId: s3.Credentials.AccessKeyId,
            secretAccessKey: s3.Credentials.SecretAccessKey,
            sessionToken: s3.Credentials.SessionToken,
          },
        });
        const params = {
          AccelerateConfiguration: {
            Status: 'Enabled',
          },
          Bucket: s3.bucket,
        };
        const res = await s3Bucket.putBucketAccelerateConfiguration(params).promise();
        console.log(res, s3Bucket, '===============');

        s3Bucket.config.useAccelerateEndpoint = true;
        let image = null;
        const uploadImageToS3Promise = new Promise((resolve, reject) => {
          let contentType = mime;
          let contentDeposition = 'inline;filename="' + filename + '"';
          const arrayBuffer = decode(avatar);
          const params = {
            Bucket: s3.bucket,
            Key: filename,
            Body: arrayBuffer,
            ContentDisposition: contentDeposition,
            ContentType: contentType,
            ACL: 'public-read',
          };
          s3Bucket.upload(params, (err, data) => {
            if (err) {
              console.log('error in callback');
              reject();
              return false;
            }
            console.log('Response URL : ' + data.Location);
            image = data.Location;
            resolve();
          });
        });
        await uploadImageToS3Promise.then();
        await actions.user.updateUser({
          where: {id: state.currentUser?.id},
          data: {
            avatar: image,
          },
        });
      }

      if (isEmpty(avatar)) {
        if (await _askSelectAvatar()) {
          return;
        }
      }
      actions.hud.show();
      if (needUpdate) {
        const user = await actions.user.updateUserProfile(params);
        if (user) {
          actions.alert.showSuccess({message: 'Updated user profile successfully.', title: 'Flute'});

          // if (paymentMethod) {
          //   await _redirectPayment(paymentMethod)
          // } else {
          props.navigation.navigate('Main', {newUser: true});
          // }
        } else {
          actions.alert.showError({message: 'Failed to update user profile', title: 'Flute'});
        }
      }
    } catch (ex) {
      console.log(ex);
      actions.alert.showError({message: 'Failed to update user profile', title: 'Flute'});
    } finally {
      actions.hud.hide();
    }
  };
  return (
    <Container>
      <Bg source={Images.bg_setting} />
      <KeyboardAvoiding behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView>
          <Right onPress={() => props.navigation.pop()}>
            <BtnText>X</BtnText>
          </Right>
          <AvatarView>
            <LottieView
              ref={(node) => node && node.play()}
              loop={true}
              speed={1}
              autoPlay
              style={{flex: 1}}
              source={require('./avatars_all.json')}
            />
            {avatar?.length > 0 || avatarLocal?.length > 0 ? (
              <Avatar source={{uri: isAvatar ? avatar : avatarLocal}} />
            ) : null}
            <AvatarBtn onPress={onPressAvatar}>
              <AvatarItem>
                <SLIcon name="camera" size={24} color="white" />
              </AvatarItem>
              <AvatarItem>
                <AvatarText>UPLOAD YOUR PIC</AvatarText>
              </AvatarItem>
            </AvatarBtn>
          </AvatarView>

          <ItemView>
            <NameView>
              <TitleView>
                <TextInputFlat
                  value={gender}
                  placeholder={'Title'}
                  onChangeText={setGender}
                  isSelect
                  onPress={onPressGender}
                />
              </TitleView>
              <View style={{flex: 1, paddingRight: 5}}>
                <TextInputFlat value={firstName} placeholder={'First Name'} onChangeText={setFirstName} />
              </View>
              <View style={{flex: 1, paddingLeft: 5}}>
                <TextInputFlat value={lastName} placeholder={'Last Name'} onChangeText={setLastName} />
              </View>
            </NameView>
          </ItemView>
          <ItemView>
            <TextInputFlat
              value={username}
              placeholder={'Username'}
              onChangeText={setUsername}
              autoCapitalize={'none'}
            />
          </ItemView>
          <ItemView>
            <TextInputFlat
              value={email}
              placeholder={'Email Address'}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize={'none'}
            />
          </ItemView>
          <ItemView>
            <TextInputFlat
              value={mdob && moment(mdob).format('MMMM D, YYYY')}
              placeholder={'Enter Date of Birth'}
              onChangeText={setMdob}
              isSelect
              onPress={onPressDoB}
            />
          </ItemView>
          <ItemView>
            <TextInputFlat
              value={drinkOfChoice}
              placeholder={'Primary Drink Of Choice'}
              onChangeText={drinkOfChoice}
              isSelect
              onPress={onPressDrinkOfChoice}
            />
          </ItemView>
          <PaymentView>
            {/* <Tooltip style={{shadowOffset: {width: 0, height: 4}}} position={layoutDesc - 45}>
            <TooltipBody><TooltipTitle>NEEDED FOR PURCHASES</TooltipTitle></TooltipBody>
            <Arrow source={Images.ic_triangle} width={Sizes.hScale(20)} height={Sizes.hScale(7)}/>
          </Tooltip>
          <PaymentTitle onLayout={onLayoutDesc}>CONNECT A PAYMENT METHOD</PaymentTitle> */}
            <Body>
              {/* <PayBtn onPress={() => _requestLater('visa')}><PayView><PayText>ADD NOW</PayText></PayView></PayBtn> */}
              <PayBtn onPress={_requestLater}>
                <PayView>
                  <PayText>CONTINUE</PayText>
                </PayView>
              </PayBtn>
            </Body>
          </PaymentView>
        </ScrollView>
      </KeyboardAvoiding>
      <NavBar></NavBar>
      <RadioModal
        setModal={setModal}
        showModal={showModal}
        isRadio
        data={['Mr', 'Ms', 'Mrs']}
        selected={gender}
        onSelected={setGender}
      />
      <RadioModal
        setModal={setDrinkModal}
        showModal={showDrinkModal}
        isRadio
        data={drink}
        selected={drinkOfChoice}
        onSelected={setDrinkOfChoice}
      />
      <PermissionModal setModal={setPermissionModal} showModal={showPermissionModal} />
      <DateTime ref={_datePicker} mode="date" />
    </Container>
  );
};

const Right = styled.TouchableOpacity`
  position: absolute;
  right: 30px;
  top: 20px;
  z-index: 10;
`;

const BtnText = styled(StyledText)`
  font-weight: 600;
  font-size: 30px;
  line-height: 37px;
  color: black;
`;

const Arrow = styled.Image`
  width: ${Sizes.hScale(30)}px;
  height: ${Sizes.hScale(7)}px;
  resize-mode: contain;
  align-self: center;
`;

const TooltipTitle = styled(MainMediumFont)`
  color: white;
  font-size: 10px;
  line-height: 12px;
  letter-spacing: 1px;
`;
const TooltipBody = styled.View`
  background-color: black;
  border-radius: 8px;
  padding-vertical: 11px;
  padding-horizontal: 30px;
  height: 35px;
`;
const Tooltip = styled.View`
  position: absolute;
  top: ${(props) => (props.position ? props.position : 0)}px;
  shadow-opacity: 0.2;
  shadow-radius: 1px;
  shadow-color: black;
  align-self: center;
`;

const PayText = styled(MainSemiBoldFont)`
  font-size: 11px;
  letter-spacing: 3px;
  color: black;
`;

const PayView = styled.View`
  justify-content: center;
  align-items: center;
  flex: 8;
`;

const PayBtn = styled.TouchableOpacity`
  flex-direction: row;
  border-bottom-width: 0.3px;
  border-bottom-color: #979797;
  height: 55px;
  padding: 10px;
`;

const Body = styled.View`
  bottom: 0;
  width: 100%;
  background-color: white;
`;

const PaymentTitle = styled(MainMediumFont)`
  font-size: 12px;
  align-self: center;
  margin-top: 20px;
  margin-bottom: 17px;
  letter-spacing: 3px;
  color: black;
`;

const PaymentView = styled.View`
  width: 100%;
  margin-top: 35px;
  margin-bottom: 60px;
`;

const TitleView = styled.View`
  align-self: stretch;
  padding-right: 10px;
  width: 90px;
`;

const NavBar = styled.View`
  ${Styles.absolute_top};
  align-self: stretch;
  margin-top: 20px;
  padding-horizontal: 10px;
`;

const NameView = styled.View`
  align-items: stretch;
  flex-direction: row;
`;

const ItemView = styled.View`
  align-items: stretch;
  padding-horizontal: 15px;
  margin-top: 15px;
`;

const AvatarText = styled(MainSemiBoldFont)`
  margin-left: 10px;
  text-align: center;
  font-size: 13px;
  color: white;
`;

const AvatarItem = styled.View`
  ${Styles.content_center}
  height: 30px;
`;

const AvatarBtn = styled.TouchableOpacity`
  position: absolute;
  bottom: 10px;
  left: 10px;
  padding-vertical: 5px;
  padding-horizontal: 10px;
  background-color: black;
  border-radius: 4px;
  flex-direction: row;
`;

const Avatar = styled.Image`
  width: 100%;
  height: 200px;
  resize-mode: cover;
  border-radius: 10px;
`;

const AvatarView = styled.View`
  align-self: stretch;
  background-color: #d1d1d1;
  margin: 15px;
  border-radius: 10px;
  height: 200px;
`;

const KeyboardAvoiding = styled.KeyboardAvoidingView`
  ${Styles.match_parent}
  ${Styles.start_center}
  margin-top: 30px;
`;

const Bg = styled.Image`
  width: 100%;
  height: 100%;
  ${Styles.absolute_full}
`;

const Container = styled.View`
  ${Styles.match_parent}
  ${Styles.start_center}
  background-color: white;
  padding-bottom: ${Platform.OS === 'ios' ? 0 : 10}px;
`;

export default ProfileCheck;
