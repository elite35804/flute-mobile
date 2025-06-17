import { keyBy, isEmpty } from 'lodash';

/*
*
*/
export const getTotalNotifications = async ({ state, effects }) => {
  const { notifications } = await effects.gql.queries.notifications()

  state.notification.totalRecords = notifications ? notifications.length : 0
}

/*
*
*/
export const getNotifications = async ({ state, effects }, data) => {
  try {
    let options = {};

    if (isEmpty(data)) {
      options = {
        first: state.notification.notificationPerPage,
        skip: (state.notification.activePage - 1) * state.notification.notificationPerPage
      }

    } else {
      options = data;

      if (!data.first) options.first = state.notification.notificationPerPage;
      if (!data.skip) options.skip = (state.notification.activePage - 1) * state.notification.notificationPerPage;
    }


    const { notifications } = await effects.gql.queries.notifications(options);

    console.log(notifications, 'getNotifications results...');
    if (notifications.length === 0) state.notification.isLast = true;

    state.notification.notifications = {...state.notification.notifications, ...keyBy(notifications, 'id')};

  } catch (e) {
    console.log(e, 'getNotifications errors');
  }
}

/*
*
*/
export const saveNotification = async ({ effects }, data) => {
  return await effects.gql.mutations.saveNotification(data)
}

/*
*
*/
export const onChangePage = async ({ state }, page) => {
  state.notification.activePage = page
}

/*
*
*/
export const onNotificationAdded = ({ state }, data) => {
  state.notification.push(data)
}

/*
*
*/
export const markNotificationRead = ({ effects }, data) => {
  effects.gql.mutations.markNotificationRead(data);
}

/*
*
*/
export const notification = async ({ effects }, data) => {
  const { notification } = await effects.gql.mutations.notification(data);
  state.notification.notifications[data.notificationId] = notification;
  return notification;
}
