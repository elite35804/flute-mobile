import {
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Switch,
  View,
} from 'react-native';
import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import SLIcon from 'react-native-vector-icons/SimpleLineIcons';
import ET from 'react-native-vector-icons/Entypo';
import { Styles } from '@/styles';
import { Images } from '@/styles/Images';
import LottieView from 'lottie-react-native';
import { useOvermind } from '@/store';
import { MainMediumFont, MainRegularFont, MainSemiBoldFont } from '@/views/Components';
import TextInputFlat from '@/views/Components/EditInput';
import { json } from 'overmind';
import RadioModal from '@/views/Modals/RadioModal';
import moment from 'moment';
import DateTime from '@/views/Components/datetimepicker';
import { drink, tips } from '@/Constants';
import FTIcon from 'react-native-vector-icons/Feather';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import ImagePicker from 'react-native-image-crop-picker';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { isEmpty } from 'lodash';
import RadioPicker from '@/views/Modals/RadioPicker';
import { decode } from 'base64-arraybuffer';
import fs from 'react-native-fs';

import AWS from 'aws-sdk';
const _checkEmail = (email) => {
  if (isEmpty(email)) return false;
  const arr = email.toLowerCase().split('@');
  const isNum = /^\d+$/.test(arr[0]);
  if (isNum && arr[1] === 'flutedrinks.com') return false;
  if (isNum && arr[1] === 'local.com') return false;
  return true;
};

const _checkUsername = (username) => {
  if (isEmpty(username)) return false;
  const arr = username.toLowerCase().split('@');
  console.log(arr, 'dsf');
  const isNum = /^\d+$/.test(arr[0]);
  if (isNum) return false;
  return true;
};

const Profile = (props) => {
  const { state, actions } = useOvermind();
  const currentUser = json(state.currentUser);
  console.log(currentUser);
  const [scrollY, setScrollY] = useState(new Animated.Value(0));
  const [firstName, setFirstName] = useState(currentUser?.firstName);
  const [lastName, setLastName] = useState(currentUser?.lastName);
  const [username, setUsername] = useState(_checkUsername(currentUser?.username) ? currentUser?.username : '');
  const [avatar, setAvatar] = useState(currentUser?.avatar || '');
  const [avatarLocal, setAvatarLocal] = useState('');
  const [email, setEmail] = useState(_checkEmail(currentUser?.email) ? currentUser?.email : '');
  const [mobileNumber, setMobileNumber] = useState(currentUser?.username);
  const [gender, setGender] = useState(currentUser?.gender);
  const [mdob, setMdob] = useState(currentUser?.dateOfBirth);
  const [drinkOfChoice, setDrinkOfChoice] = useState(currentUser?.settings?.drinkOfChoice);
  const [additionalDrinksOfChoice, setAdditionalDrinksOfChoice] = useState(
    currentUser?.settings?.additionalDrinksOfChoice
  );
  const [defaultTip, setDefaultTip] = useState(`${currentUser?.settings?.defaultTip || 20}%`);
  const [allowGifts, setAllowFlutes] = useState(currentUser?.settings?.allowGifts);
  const [allowPushNotification, setAllowPushNotification] = useState(currentUser?.settings?.allowPushNotification);
  const [soundAlertNotification, setSoundAlertNotification] = useState(currentUser?.settings?.soundAlertNotification);
  const [disableToolTips, setDisableToolTips] = useState(currentUser?.settings?.disableToolTips);
  const [showModal, setModal] = useState(false);
  const [showDrinkModal, setDrinkModal] = useState(false);
  const [showTipModal, setTipModal] = useState(false);
  const [showPicker, setPicker] = useState(false);
  const [mime, setMime] = useState(null);
  const _datePicker = useRef(null);
  const { showActionSheetWithOptions } = useActionSheet();

  const onPressGender = () => {
    setModal(true);
  };

  const onPressDoB = () => {
    _datePicker.current.open(new Date(mdob), (dob) => {
      setMdob(dob);
    });
  };

  const onPressDrinkOfChoice = () => {
    setDrinkModal(true);
  };

  const onPressDefaultTip = () => {
    setTipModal(true);
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
            console.log(picked, 'picked');
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

  const _requestStatesFromSocial = async (res) => {
    console.log(res);
    const states = {};
    if (isEmpty(firstName) && isEmpty(lastName)) {
      states.firstName = res.firstName;
      states.lastName = res.lastName;
    }
    if (isEmpty(email)) {
      states.email = res.email;
    }
    if (isEmpty(avatar)) {
      try {
        // states.avatar = await apis.downloadFile(res.profile_picture);
        states.avatar = await apis.downloadFile(res.picture);
      } catch (e) {
        console.log('failed to update avatar: ', e);
      }
    }
    return states;
  };

  const _onConnectSocial = async (res) => {
    const states = await _requestStatesFromSocial(res);
    console.log(res, states);

    // this.setState(states);
  };

  const onPressConnectSocial = () => {
    actions.user.setSocialCb(_onConnectSocial);
    props.navigation.navigate('SocialNetwork');
  };

  const onPressAdditionalDrinks = () => {
    setPicker(true);
  };

  const _onPressSave = () => {
    const valid = _checkValid();
    if (valid !== 'valid') {
      actions.alert.showError({ message: valid, title: 'Flute' });
      return;
    }
    _requestSave();
  };

  const getAWSCredential = async (actions) => {
    // const credential = await storage.getData("aws_credential");
    // if (new Date(credential?.s3?.Credentials.Expiration) > new Date()) {
    //   return { s3: credential?.s3, mediaConvert: credential?.mediaConvert };
    // } else {
    const { awsTempToken: s3Token } = await actions.user.awsTempToken({
      service: 's3',
    });
    const { awsTempToken } = await actions.user.awsTempToken({
      service: 'mediaConvert',
    });
    // await storage.saveData(
    //   { s3: s3Token, mediaConvert: awsTempToken },
    //   "aws_credential"
    // );
    return { s3: s3Token, mediaConvert: awsTempToken };
  };

  const _requestSave = async () => {
    actions.hud.show();
    try {
      let needUpdate = false;
      const params = {};

      if (firstName !== currentUser?.firstName) {
        params.firstName = firstName;
        needUpdate = true;
      }
      if (lastName !== currentUser?.lastName) {
        params.lastName = lastName;
        needUpdate = true;
      }
      if (username !== currentUser?.username) {
        params.username = username;
        needUpdate = true;
      }
      if (email !== currentUser?.email) {
        params.email = email;
        needUpdate = true;
      }
      // if (mobileNumber !== currentUser?.mobileNumber) {
      //   params.mobileNumber = mobileNumber;
      //   needUpdate = true;
      // }
      if (gender !== currentUser?.gender) {
        params.gender = gender;
        needUpdate = true;
      }
      if (
        (mdob && new Date(mdob).getTime()) !== (currentUser?.dateOfBirth && new Date(currentUser?.dateOfBirth).getTime())
      ) {
        params.dateOfBirth = mdob;
        needUpdate = true;
      }
      if (
        allowGifts !== currentUser?.settings.allowGifts ||
        allowPushNotification !== currentUser?.settings.allowPushNotification ||
        soundAlertNotification !== currentUser?.settings.soundAlertNotification ||
        drinkOfChoice !== currentUser?.settings.drinkOfChoice ||
        disableToolTips !== currentUser?.settings.disableToolTips ||
        additionalDrinksOfChoice !== currentUser?.settings.additionalDrinksOfChoice ||
        parseInt(defaultTip) !== currentUser?.settings.defaultTip
      ) {
        params.settings = {
          additionalDrinksOfChoice: { set: additionalDrinksOfChoice },
          allowGifts: allowGifts,
          allowPushNotification: allowPushNotification,
          soundAlertNotification: soundAlertNotification,
          drinkOfChoice: drinkOfChoice,
          disableToolTips: disableToolTips,
          defaultTip: parseInt(defaultTip),
        };
        needUpdate = true;
      }
      if (avatar !== currentUser?.avatar) {
        const { s3 } = await getAWSCredential(actions);
        console.log('-=-=-=-', s3);
        let filename = `/profiles/${state.currentUser?.id}-${new Date().getTime()}.png`;
        const s3Bucket = new AWS.S3({
          params: { Bucket: s3.bucket },
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
          where: { id: state.currentUser?.id },
          data: {
            avatar: image,
            
          },
        });
      }

      if (needUpdate) {
        await actions.user.updateUserProfile(params);
        // gs.isVisibleTooltip = disableToolTips;
        actions.alert.showSuccess({ message: 'Updated user profile successfully.', title: 'Flute' });
      }
      props.navigation.pop();
    } catch (ex) {
      console.log(ex);
      actions.alert.showError({ message: 'Failed to update user profile', title: 'Flute' });
    }
    actions.hud.hide();
  };

  const _checkValid = () => {
    if (isEmpty(firstName) && isEmpty(lastName)) {
      return 'Please enter name';
    }
    if (isEmpty(email)) {
      return 'Please enter email address';
    }
    if (!_checkEmail(email)) {
      return 'Please enter valid email address';
    }
    // if (isEmpty(mobileNumber)) {
    //   return 'Please enter mobile number';
    // }

    let age = 0;
    if (mdob) {
      age = moment().diff(mdob, 'year');
    }
    if (age < 21) {
      return 'You must be 21+ of age to use this app.';
    }
    return 'valid';
  };

  const isAvatar = (avatar && avatar.split(':')[0] === 'http') || avatar.split(':')[0] === 'https';
  console.log(additionalDrinksOfChoice);

  const _onPressRemoveAdditionalDrink = (drink) => {
    const drinks = [...additionalDrinksOfChoice];
    const index = drinks.findIndex((el) => el === drink);
    if (index >= 0) {
      drinks.splice(index, 1);
      setAdditionalDrinksOfChoice(drinks);
    }
  };

  const rdDrinks =
    additionalDrinksOfChoice.length > 0 &&
    additionalDrinksOfChoice.map((drink) => (
      <DrinkItem key={drink}>
        <DrinkText>{drink}</DrinkText>
        <DrinkBtn onPress={() => _onPressRemoveAdditionalDrink(drink)}>
          <MainMediumFont style={{ color: 'white', fontSize: 12 }}>X</MainMediumFont>
        </DrinkBtn>
      </DrinkItem>
    ));

  const _requestDeactivate = async () => {
    actions.hud.show();
    try {
      await actions.user.deactivateUser();
      // if (gs.openTab) {
      //   actions.alert.showError({message: "Please close your open tab before logging out.", title: 'Flute'});
      //   return false;
      // }
      await actions.logout();
      props.navigation.navigate('SignIn');
    } catch (e) {
      console.log(e);
    } finally {
      actions.hud.hide();
    }
  };

  const onPressDeactivate = () => {
    try {
      Alert.alert('Flute', `We are sorry to see you go! You will now be logged out.`, [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => _requestDeactivate(),
        },
      ]);
    } catch (e) {
      console.log(e);
    }
  };

  const onPressDelete = () => {
    try {
      Alert.alert('Flute', `We are sorry to see you go! You will now be logged out.`, [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => _requestDeactivate(),
        },
      ]);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Container>
      <Bg source={Images.bg_setting} />
      <KeyboardAvoiding behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          style={{width: '100%'}}
          // scrollEventThrottle={16}
          // onScroll={Animated.event([{nativeEvent: {contentOffset: {y: scrollY}}}])}
        >
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
              <View style={{flex: 1, paddingRight: 5}}>
                <TextInputFlat value={firstName} placeholder={'First Name'} onChangeText={setFirstName} />
              </View>
              <View style={{flex: 1, paddingLeft: 5}}>
                <TextInputFlat value={lastName} placeholder={'Last Name'} onChangeText={setLastName} />
              </View>
            </NameView>
          </ItemView>
          <ItemView>
            <TextInputFlat value={username} placeholder={'Username'} onChangeText={setUsername} isUsername={true} />
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
          {/* <ItemView>
            <TextInputFlat
              value={mobileNumber}
              placeholder={'Mobile Number'}
              onChangeText={setMobileNumber}
              keyboardType="phone-pad"
            />
          </ItemView> */}
          <ItemView>
            <TextInputFlat
              value={gender}
              placeholder={'Select Gender'}
              onChangeText={setGender}
              isSelect
              onPress={onPressGender}
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
          <ItemView>
            {rdDrinks && (
              <View style={{justifyContent: 'flex-start', alignItems: 'flex-start', flex: 1}}>
                <MainRegularFont style={{fontSize: 8}}>SELECT DRINKS OF CHOICE</MainRegularFont>
                <DrinkView>{rdDrinks}</DrinkView>
              </View>
            )}
            {!rdDrinks && (
              <TextInputFlat
                value={''}
                placeholder={'Select Drinks of choice'}
                isSelect
                onPress={onPressAdditionalDrinks}
              />
            )}
          </ItemView>
          <ItemView>
            <TextInputFlat value={defaultTip} placeholder={'Select default tip'} isSelect onPress={onPressDefaultTip} />
          </ItemView>

          <SocialBtn onPress={onPressConnectSocial}>
            <SocialText>Link social accounts</SocialText>
            <ET name="chevron-thin-right" size={20} color="black" />
          </SocialBtn>
          <AllowView>
            <Desc>Allow other users to send me drinks</Desc>
            <Switch value={allowGifts} onValueChange={setAllowFlutes} />
          </AllowView>
          <AllowView>
            <Desc>Allow push notification</Desc>
            <Switch value={allowPushNotification} onValueChange={setAllowPushNotification} />
          </AllowView>
          <AllowView>
            <Desc>Sound alert when receive notification</Desc>
            <Switch value={soundAlertNotification} onValueChange={setSoundAlertNotification} />
          </AllowView>
          <AllowView>
            <Desc>Disable tool tips</Desc>
            <Switch value={disableToolTips} onValueChange={setDisableToolTips} />
          </AllowView>
          <DeactivateBtn onPress={onPressDeactivate}>
            <RedText>Deactivate account</RedText>
          </DeactivateBtn>
          <DeleteBtn onPress={onPressDelete}>
            <RedText>Delete account</RedText>
          </DeleteBtn>
        </ScrollView>
      </KeyboardAvoiding>
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          width: '100%',
          height: scrollY.interpolate({inputRange: [0, 400], outputRange: [0, 70]}),
          backgroundColor: '#ccc',
          zIndex: 99,
        }}
      />
      <NavBar>
        <BackButton onPress={() => props.navigation.pop()}>
          <BackText>
            {Platform.OS === 'ios' ? (
              <FTIcon name="arrow-left" size={20} color="black" />
            ) : (
              <FAIcon name="arrow-left" size={20} color="black" />
            )}
          </BackText>
        </BackButton>
      </NavBar>
      <SaveView>
        <SaveBg source={Images.bg_setting_btn} />
        <SaveBtn onPress={_onPressSave}>
          <SaveTitle>SAVE PROFILE</SaveTitle>
        </SaveBtn>
      </SaveView>
      <RadioModal
        setModal={setModal}
        showModal={showModal}
        isRadio
        data={['Male', 'Female']}
        selected={gender}
        onSelected={(gen) => setGender(gen?.toUpperCase())}
      />
      <RadioModal
        setModal={setDrinkModal}
        showModal={showDrinkModal}
        isRadio
        data={drink.sort()}
        selected={drinkOfChoice}
        onSelected={setDrinkOfChoice}
      />
      <RadioModal
        setModal={setTipModal}
        showModal={showTipModal}
        isRadio
        data={tips}
        selected={defaultTip}
        onSelected={setDefaultTip}
      />
      <RadioPicker
        showModal={showPicker}
        setModal={setPicker}
        data={drink.sort()}
        onSelected={(selected) => {
          setAdditionalDrinksOfChoice(selected);
        }}
      />
      <DateTime ref={_datePicker} mode="date" />
    </Container>
  );
};

const DrinkView = styled.View`
  ${Styles.start_start}
  flex: 1;
  flex-direction: row;
  flexwrap: wrap;
  padding-bottom: 5px;
  margin-right: 10px;
`;

const DrinkBtn = styled.TouchableOpacity`
  align-self: stretch;
  ${Styles.center}
  margin-left: 5px;
  padding-horizontal: 10px;
`;

const DrinkText = styled(MainMediumFont)`
  color: white;
  font-size: 12px;
`;

const DrinkItem = styled.View`
  flex-direction: row;
  background-color: black;
  border-radius: 4px;
  height: 34px;
  margin-top: 5px;
  margin-right: 5px;
  padding-left: 5px;
  align-items: center;
`;
const SaveBtn = styled.TouchableOpacity`
  background-color: #d6b839;
  height: 44px;
  margin-horizontal: 10px;
  margin-bottom: 10px;
  align-self: stretch;
  ${Styles.center}
`;

const SaveTitle = styled(MainMediumFont)`
  font-size: 12px;
  letter-spacing: 3px;
  color: black;
`;

const SaveBg = styled.Image`
  ${Styles.absolute_top}
  width: 100%;
  height: 200px;
`;

const SaveView = styled.View`
  ${Styles.absolute_bottom};
  margin-bottom: 20px;
  ${Styles.end_center}
  height: 200px;
`;

const BackText = styled(MainSemiBoldFont)`
  font-size: 12px;
  color: black;
`;

const BackButton = styled.TouchableOpacity`
  align-self: flex-start;
  margin-left: 5px;
  z-index: 9999;
`;

const NavBar = styled.View`
  ${Styles.absolute_top};
  align-self: stretch;
  margin-top: 20px;
  padding-horizontal: 10px;
  z-index: 100;
`;

const RedText = styled(MainMediumFont)`
  font-size: 14px;
  color: red;
`;

const DeactivateBtn = styled.TouchableOpacity`
  border-top-color: #aeaeae;
  border-top-width: 1px;
  height: 65px;
  margin-horizontal: 15px;
  padding-horizontal: 5px;
  ${Styles.center_start}
`;

const DeleteBtn = styled.TouchableOpacity`
  border-bottom-color: #aeaeae;
  border-top-color: #aeaeae;
  border-bottom-width: 1px;
  border-top-width: 1px;
  height: 65px;
  margin-horizontal: 15px;
  padding-horizontal: 5px;
  ${Styles.center_start}
  margin-bottom: 200px;
`;

const Desc = styled(MainMediumFont)`
  font-size: 14px;
  color: black;
`;

const AllowView = styled.View`
  flex-direction: row;
  border-top-color: #aeaeae;
  border-top-width: 1px;
  height: 66px;
  margin-horizontal: 15px;
  padding-horizontal: 5px;
  ${Styles.between_center}
`;

const SocialText = styled(MainMediumFont)`
  font-size: 14px;
  color: black;
`;

const SocialBtn = styled.TouchableOpacity`
  flex-direction: row;
  height: 65px;
  margin-horizontal: 15px;
  padding-horizontal: 5px;
  margin-top: 20px;
  ${Styles.between_center}
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
  bottom: 10;
  left: 10;
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
  padding-bottom: ${Platform.OS === 'ios' ? 0 : 100};
`;

export default Profile;
