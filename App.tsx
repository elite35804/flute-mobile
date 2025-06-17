import React from 'react';
import { UIManager, Platform } from 'react-native';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { ThemeProvider } from 'styled-components/native';
import { createOvermind } from 'overmind';
import { Provider } from 'overmind-react';
import * as Sentry from '@sentry/react-native';
import { SentryConfig } from './src/Config';
// import { DyScan } from '@dyneti/react-native-dyscan';
import { dyscan } from "./src/Config";

import Router from './src/Router';
import { Themes } from './src/styles';
import { DropDownAlert } from './src/views/Components';
import LoadingHud from './src/views/Components/hud';
import { config } from './src/store';
import {LogLevel, OneSignal} from 'react-native-onesignal';
import {OneSignal as Config} from '@/Config';

Sentry.init({
  dsn: SentryConfig.dsn,
});

// Remove this method to stop OneSignal Debugging
OneSignal.Debug.setLogLevel(LogLevel.Verbose);

// OneSignal Initialization
OneSignal.initialize(Config.appId);

// requestPermission will show the native iOS or Android notification permission prompt.
// We recommend removing the following code and instead using an In-App Message to prompt for notification permission
OneSignal.Notifications.requestPermission(true);

// Method for listening for notification clicks
OneSignal.Notifications.addEventListener('click', (event) => {
  console.log('OneSignal: notification clicked:', event);
});

const overmind = createOvermind(config, {
  devtools: false,
});

console.disableYellowBox = true;

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const App: React.FC = () => {
  return (
      <Provider value={overmind}>
        <ThemeProvider theme={Themes.base}>
          <ActionSheetProvider>
            <Router />
          </ActionSheetProvider>
          <LoadingHud />
          <DropDownAlert />
        </ThemeProvider>
      </Provider>
  );
};

export default App;
