import React, {useRef, useState, useEffect} from 'react';
import {TouchableOpacity, View, StyleSheet, Text, TextInput, Platform, ActivityIndicator, Keyboard} from 'react-native';
import Permissions from 'react-native-permissions';
import {useOvermind} from '@/store';
import { isEmpty } from 'lodash';

const CaptureAge = (props) => {
  const {state, actions} = useOvermind();
  const [data, setData] = useState({first: null, second: null, third: null, fourth: null, fifth: null, sixth: null});
  const [saving, setSaving] = useState(false);
  const first = useRef(null);
  const second = useRef(null);
  const third = useRef(null);
  const fourth = useRef(null);
  const fifth = useRef(null);
  const sixth = useRef(null);
  const isGuest = props.route.params?.isGuest;

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

  useEffect(() => {
    if(data.sixth) onPressConfirm()
  }, [data.sixth])

  const _getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (result) => {
          resolve({
            lat: result.coords.latitude,
            lon: result.coords.longitude,
          });
        },
        (error) => {
          resolve(null);
        }
      );
    });
  };

  const _shouldPresentPermission = async () => {
    try {
      const location = await Permissions.check('location', {type: 'always'});
      const notification = Platform.OS === 'ios' ? await Permissions.check('notification') : 'authorized';
      const motion = Platform.OS === 'ios' ? await Permissions.check('motion') : 'authorized';
      console.log(location, notification, motion);
      return location === 'unavailable' || notification === 'unavailable' || motion === 'unavailable';
    } catch (e) {
      console.log(e);
    }
  };

  const _checkPermissions = async (completionHandler) => {
    navigation.navigate({
      name: routes.names.app.permission,
      animation: 'fade',
      params: {completionHandler},
    });
  };

  const _checkEmail = (email) => {
    if (isEmpty(email)) return false;
    const arr = email.toLowerCase().split('@');
    const isNum = /^\d+$/.test(arr[0]);
    if (isNum && arr[1] === 'flutedrinks.com') return false;
    if (isNum && arr[1] === 'local.com') return false;
    return true;
  };

  const handleFluteAd = async () => {
    const location = await _getCurrentLocation();
    const lat = location ? location.lat : null,
      lon = location ? location.lon : null;
    const isAd = await apis.checkForQualifiedAds(gs.user?.userId, lat, lon);
    const ad = isAd?.showAds[0]?.ad;
    ad.impressionId = ad?.impressions[0]?.id;
    ad.campaignId = ad?.impressions[0]?.campaign?.id;
    gs.context.fluteAd = ad;
    navigation.navigate({
      name: routes.names.app.confFluteAd,
      params: {newUser: true},
      animation: 'fade',
    });
  };

  const onPressConfirm = async () => {
    Keyboard.dismiss();
    setSaving(true);
    const month = parseInt(data.first + data.second);
    const date = parseInt(data.third + data.fourth);
    let year = parseInt(data.fifth + data.sixth);
    console.log(month, date, year);
    if (isNaN(month) || isNaN(date) || isNaN(year)) {
      actions.alert.showError({message: 'Please input correct number'});
      setSaving(false);
      return false;
    }

    if (month > 12) {
      actions.alert.showError({message: 'Please input valid month'});
      setSaving(false);
      return false;
    }

    if (date > 31) {
      actions.alert.showError({message: 'Please input valid date'});
      setSaving(false);
      return false;
    }

    if (year < 30) {
      year = 2000 + year;
    } else {
      year = 1900 + year;
    }

    if (new Date().getFullYear() - year < 21) {
      actions.alert.showError({message: 'You must be 21+ of age to use this app.'});
      setSaving(false);
      return false;
    }

    const newDate = new Date(year, month - 1, date);
    console.log(newDate);
    actions.hud.show();
    try {
      const info = await actions.user.updateUserProfile({dateOfBirth: newDate});
      console.log(info, 'info');
      if (info?.id) {
        // if (await _shouldPresentPermission()) {
        //   console.log('___+_+_+_+_+_+_____+++++');
        //   _checkPermissions(handleFluteAd);
        // } else {
        //   console.log(')))))))))))))))))');
        //   handleFluteAd();
        // }
        if (isGuest) {
          props.navigation.navigate('Main', {screen: 'Home', params: {screen: 'Home', params: {isGuest}}})
        } else {
          if (!state.currentUser?.fullName || !_checkEmail(state.currentUser?.email) || !state.currentUser?.gender) {
            props.navigation.navigate('ProfileCheck');
          }
        }
        
      }
      setSaving(false);
    } catch (e) {
      console.log(e);
    } finally {
      actions.hud.hide();
    }
  };
  return (
    <View style={styles.container}>
      <View
        style={{
          width: 318,
          height: 293,
          backgroundColor: 'white',
          borderRadius: 10,
          justifyContent: 'flex-start',
          alignItems: 'center',
        }}>
        <Text style={styles.title}>Age Verification</Text>
        <Text style={styles.description}>Are you 21?{'\n'}Enter your date of birth</Text>
        <View style={styles.content}>
          <View style={styles.inputView}>
            <TextInput
              style={styles.input}
              ref={first}
              keyboardType="number-pad"
              value={data.first}
              onChangeText={(val) => onSetData('first', val)}
            />
          </View>
          <View style={styles.inputView}>
            <TextInput
              style={styles.input}
              ref={second}
              keyboardType="number-pad"
              value={data.second}
              onChangeText={(val) => onSetData('second', val)}
            />
          </View>
          <Text style={styles.slash}>/</Text>
          <View style={styles.inputView}>
            <TextInput
              style={styles.input}
              ref={third}
              keyboardType="number-pad"
              value={data.third}
              onChangeText={(val) => onSetData('third', val)}
            />
          </View>
          <View style={styles.inputView}>
            <TextInput
              style={styles.input}
              ref={fourth}
              keyboardType="number-pad"
              value={data.fourth}
              onChangeText={(val) => onSetData('fourth', val)}
            />
          </View>
          <Text style={styles.slash}>/</Text>
          <View style={styles.inputView}>
            <TextInput
              style={styles.input}
              ref={fifth}
              keyboardType="number-pad"
              value={data.fifth}
              onChangeText={(val) => onSetData('fifth', val)}
            />
          </View>
          <View style={styles.inputView}>
            <TextInput
              style={styles.input}
              ref={sixth}
              keyboardType="number-pad"
              value={data.sixth}
              onChangeText={(val) => onSetData('sixth', val)}
            />
          </View>
        </View>
        <TouchableOpacity style={styles.bottom} onPress={onPressConfirm} disabled={saving}>
          {saving ?
            <ActivityIndicator size={'small'} color={'black'} />
          :
            <Text style={styles.bottomText}>CONFIRM AGE</Text>
          }         
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomText: {
    fontSize: 10,
    lineHeight: 30,
    letterSpacing: 4.72,
    fontFamily: 'Montserrat',
    fontWeight: '800',
  },
  bottom: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    right: 6,
    alignSelf: 'stretch',
    marginHorizontal: 5,
    backgroundColor: '#d6b839',
    borderRadius: 5,
    paddingVertical: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slash: {
    fontSize: 30,
    lineHeight: 37,
    color: '#c9c1c1',
    marginHorizontal: 5.5,
  },
  input: {
    fontSize: 39,
    height: '80%',
    paddingHorizontal: 4,
    paddingVertical: 0,
    fontFamily: 'Montserrat',
    fontWeight: '900',
    color: 'black',
  },
  inputView: {
    width: 39,
    height: 57,
    backgroundColor: '#e2e2e2',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 1.5,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 52,
  },
  description: {
    fontWeight: '300',
    fontSize: 15,
    lineHeight: 18,
    fontFamily: 'Montserrat',
    textAlign: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: '900',
    lineHeight: 37,
    marginTop: 28,
    fontFamily: 'Montserrat',
  },
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000080',
  },
});

export default CaptureAge;
