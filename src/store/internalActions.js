import { _ } from 'lodash';

/*
*
*/
export const signIn = async ({ state, effects, actions }, options) => {
  effects.analytics.track('Sign In', {});  try {
    const jwt = await actions.internal.signInGithub(options);
    actions.internal.setJwt(jwt);

    state.currentUser = await effects.api.getCurrentUser();
    actions.internal.setSignedInCookie();

    effects.analytics.identify('signed_in', true);

    effects.analytics.setUserId(state.currentUser.id, state.currentUser.email);

    actions.internal.setStoredSettings();

    effects.live.connect();

    actions.userNotifications.internal.initialize(); // Seemed a bit different originally?
    actions.refetchSandboxInfo();

    state.isAuthenticating = false;

  } catch (error) {
    actions.internal.handleError({
      message: 'Could not authenticate',
      error,
    });
  }
};

/*
*
*/
export const setStoredSettings = ({ state, effects }) => {
  const settings = effects.settingsStore.getAll();

  if (settings.keybindings) {
    settings.keybindings = Object.keys(settings.keybindings).reduce(
      (value, key) =>
        value.concat({
          key,
          bindings: settings.keybindings[key],
        }),
      []
    );
  }

  Object.assign(state.preferences.settings, settings);
};

/*
*
*/
export const setSignedInCookie = ({ state }) => {
  console.log(state, 'setSignedInCookie...')
  document.cookie = 'signedIn=true; Path=/;';
};

/*
*
*/
export const addNotification = ({ state }, { title, type, timeAlive, buttons }) => {
  const now = Date.now();
  const timeAliveDefault = type === 'error' ? 6 : 3;

  state.notifications.push({
    id: now,
    title,
    type,
    buttons: buttons || [],
    endTime: now + (timeAlive || timeAliveDefault) * 1000,
  });
};

/*
*
*/
export const authorize = async ({ state, effects }) => {
  try {
    state.authToken = await effects.api.getAuthToken();
  } catch (error) {
    state.editor.error = error.message;
  }
};

/*
*
*/
export const signInGithub = ({ effects }, options) => {
  const authPath =
    process.env.LOCAL_SERVER || process.env.STAGING
      ? '/auth/dev'
      : '/auth/github' + (options.useExtraScopes ? '?scope=user:email,repo' : '');

  const popup = effects.browser.openPopup(authPath, 'sign in');

  return effects.browser
    .waitForMessage('signin')
    .then(data => {
      const { jwt } = data;

      popup.close();

      if (jwt) {
        return jwt;
      }

      throw new Error('Could not get sign in token');
    });
};

/*
*
*/
export const setJwt = ({ state, effects }, jwt) => {
  effects.jwt.set(jwt);
  state.jwt = jwt;
};

/*
*
*/
export const closeModals = ({ state, effects }, isKeyDown) => {
  console.log(effects, 'effects closeModals')
  if (
    state.currentModal === 'preferences' &&
    state.preferences.itemId === 'keybindings' &&
    isKeyDown
  ) {
    return;
  }

  state.currentModal = null;
};

/*
*
*/
export const getErrorMessage = (
  context,
  { error }
) => {
  const isGenericError =
    !('response' in error) ||
    error.response == null ||
    error.response.status >= 500;

  if (isGenericError) {
    return error.message;
  }

  const { response } = error;
  /*
    Update error message with what is coming from the server
  */
  const result = response?.data;

  if (result) {
    if (typeof result === 'string') {
      return result;
    }
    if ('errors' in result) {
      const errors = _.values(result.errors)[0];
      const fields = Object.keys(result.errors);
      if (Array.isArray(errors)) {
        if (errors[0]) {
          if (fields[0] === 'detail') {
            return errors[0];
          }
          return fields[0] + ': ' + errors[0]; // eslint-disable-line no-param-reassign,prefer-destructuring
        }
      } else {
        return errors; // eslint-disable-line no-param-reassign
      }
    } else if (result.error) {
      if (result.error.message) {
        return result.error.message;
      }

      return result.error; // eslint-disable-line no-param-reassign
    } else if (response?.status === 413) {
      return 'File too large, upload limit is 5MB.';
    }
  }

  return error.message;
};

/*
*
*/
const VIEW_MODE_DASHBOARD = 'VIEW_MODE_DASHBOARD';
export const setViewModeForDashboard = ({ effects, state }) => {
  const localStorageViewMode = effects.browser.storage.get(VIEW_MODE_DASHBOARD);
  if (localStorageViewMode) {
    state.dashboard.viewMode = localStorageViewMode;
  }
};