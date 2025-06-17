import { AppDetails } from '@/Config';

/*
*
*/
export const show = async ({ state }, { type, message, title }) => {
  state.alert.type = type;
  state.alert.message = message;
  state.alert.title = title ?? AppDetails.appName;
  state.alert.visible = true;
}

/*
*
*/
export const hide = async ({ state }) => {
  state.alert.visible = false;
}

/*
*
*/
export const showError = async ({ actions }, { message, title }) => {
  actions.alert.show({ type: 'error', message, title });
  throw new Error("Error");
}

/*
*
*/
export const showInfo = async ({ actions }, { message, title }) => {
  actions.alert.show({ type: 'info', message, title });
}

/*
*
*/
export const showWarn = async ({ actions }, { message, title }) => {
  actions.alert.show({ type: 'warn', message, title });
}

/*
*
*/
export const showSuccess = async ({ actions }, { message, title }) => {
  actions.alert.show({ type: 'success', message, title });
}

