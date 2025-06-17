import React, {useEffect, useState, useRef} from 'react';
import {StatusBar, AppState} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {CardStyleInterpolators, createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import {Platform} from 'react-native';

import SplashScreen from 'react-native-splash-screen';
import {enableScreens} from 'react-native-screens';
import SignIn from '@/views/SignIn/SignIn';
import Home from '@/views/Home/Home';
import Cart from '@/views/Cart/Cart';
import CartSuccess from '@/views/Cart/CartSuccess';
import Gift from '@/views/Gift/Gift';
import Address from '@/views/Address/Address';
import AddCard from '@/views/Payment/AddCard';
import AddRebate from '@/views/Rebate/AddRebate';
import Help from '@/views/Support/Help';
import Promo from '@/views/Support/Promo';
import Payments from '@/views/Payment/Payments';
import WalletAd from '@/views/Confirm/WalletAd';
import Wallet from '@/views/Wallet/Wallet';
import History from '@/views/History/History';
import Profile from '@/views/Profile/Profile';
import ProfileCheck from '@/views/Profile/ProfileCheck';
import Menu from '@/views/Menu/Menu';
import SocialNetwork from '@/views/SocialNetwork/SocialNetwork';
import GooglePlaceSelector from '@/views/Modals/GooglePlaceSelector';
import Addresses from '@/views/Modals/Addresses';
import SentDrink from '@/views/SentDrink/SentDrink';
import Preview from './views/Preview/Preview';
import Retailers from './views/Modals/Retailers';
import Game from '@/views/Game/Game';
import Survey from '@/views/Survey/Survey';
import DoneSurvey from '@/views/Survey/DoneSurvey';
import CaptureAge from '@/views/CaptureAge/CaptureAge';
import {PERMISSIONS, RESULTS, request, requestMultiple} from 'react-native-permissions';
import {useOvermind} from './store';
import Geolocation from '@react-native-community/geolocation';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

enableScreens();
export const iosModalOptions = ({route, navigation}) => ({
  ...TransitionPresets.ModalPresentationIOS,
  cardOverlayEnabled: true,
  gestureEnabled: true,
  headerShown: false,
  headerMode: 'screen',
});
const Router = () => {
  const [initialized, setInitialized] = useState(false);
  const {state, actions} = useOvermind();
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', async (nextAppState) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        if (state.locationPermission !== RESULTS.GRANTED) {
          try {
            let permission1 = null;
            if (Platform.OS === 'ios') {
              permission1 = await requestMultiple([
                PERMISSIONS.IOS.LOCATION_ALWAYS,
                PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
              ]);
            } else {
              permission1 = await requestMultiple([
                PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
              ])
            }
            
            actions.setLocPermission(
              Object.values(permission1)?.find((p) => p === RESULTS.GRANTED)
                ? RESULTS.GRANTED
                : Object.values(permission1)?.[0]
            );
            const location = await _getCurrentLocation();
            const lat = location ? location.lat : 0;
            const lng = location ? location.lng : 0;
            console.log(lat, lng, 'LOCATION ======================')
            await actions.ad.checkForQualifiedAdsByLocation({userId: state.currentUser.id, ad: {lat, lon: lng}});
          } catch (e) {
            console.log(e);
          }
        }
      }
      appState.current = nextAppState;
      setAppStateVisible(appState.current);
    });
    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    SplashScreen.hide();
    setInitialized(true);

    StatusBar.setBarStyle('dark-content');
    if (Platform.OS === 'android') StatusBar.setBackgroundColor('#FFEC00');
    StatusBar.setHidden(true);
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

  if (!initialized) return null;
  return (
    <NavigationContainer>
      <StatusBar backgroundColor="#FFEC00" />
      <Stack.Navigator screenOptions={{headerShown: false, gestureEnabled: false, headerMode: 'screen'}}>
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="Game" component={Game} />
        <Stack.Screen name="ProfileCheck" component={ProfileCheck} />
        <Stack.Screen name="CaptureAge" component={CaptureAge} />
        <Stack.Screen name="AddCard" component={AddCard} />
        <Stack.Screen name="Main">
          {() => (
            <Drawer.Navigator screenOptions={{headerShown: false, swipeEnabled: false}}>
              <Drawer.Screen name="Home">
                {() => (
                  <Stack.Navigator screenOptions={iosModalOptions}>
                    <Stack.Screen name="Home" component={Home} options={{headerShown: false}} />
                    <Stack.Screen name="Cart" component={Cart} />
                    <Stack.Screen name="CartSuccess" component={CartSuccess} />
                    <Stack.Screen name="DoneSurvey" component={DoneSurvey} />
                    <Stack.Screen name="Survey" component={Survey} options={{gestureEnabled: false}} />
                    <Stack.Screen
                      name="Menu"
                      component={Menu}
                      options={{cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS}}
                    />
                    <Stack.Screen name="GooglePlaceSelector" component={GooglePlaceSelector} />
                    <Stack.Screen name="Gift" component={Gift} />
                    <Stack.Screen name="Address" component={Address} />
                    <Stack.Screen name="AddCard" component={AddCard} />
                    <Stack.Screen name="AddRebate" component={AddRebate} />
                    <Stack.Screen name="Help" component={Help} />
                    <Stack.Screen name="Payments" component={Payments} />
                    <Stack.Screen name="Promo" component={Promo} />
                    <Stack.Screen name="Wallet" component={Wallet} />
                    <Stack.Screen name="History" component={History} />
                    <Stack.Screen name="WalletAd" component={WalletAd} />
                    <Stack.Screen name="Profile" component={Profile} />
                    <Stack.Screen name="SocialNetwork" component={SocialNetwork} />
                    <Stack.Screen name="Addresses" component={Addresses} />
                    <Stack.Screen name="Retailers" component={Retailers} />
                    <Stack.Screen name="SentDrink" component={SentDrink} />
                    <Stack.Screen name="Preview" component={Preview} />
                  </Stack.Navigator>
                )}
              </Drawer.Screen>
            </Drawer.Navigator>
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Router;
