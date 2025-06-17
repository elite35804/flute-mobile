import { isEmpty, keyBy, map } from 'lodash';

/*
*
*/
export const getTotalEvents = async ({ state, effects }) => {
  const { events } = await effects.gql.queries.events()

  state.event.totalRecords = events ? events.length : 0
}

/*
*
*/
export const getEvents = async ({ state, effects }, data) => {
  console.log('getEvents initial data', data);

  try {
    let options = {};

    if (isEmpty(data)) {
      options = {
        first: state.event.eventPerPage,
        skip: (state.order.activePage - 1) * state.event.eventPerPage
      }
    } else {
      options = data;
      if (!data.first) options.first = state.event.eventPerPage;
      if (!data.skip) options.skip = (state.event.activePage - 1) * state.event.eventPerPage;
    }

    console.log(options, 'getEvents options');

    const { events } = await effects.gql.queries.events(options);

    console.log(events, 'getEvents results');

    // state.event.events = keyBy(events, 'id');

  } catch (e) {
    console.log(e, 'getEvents errors');
    // actions.alert.showError({ message: e.response.errors[0]['message'], title: 'Fetching Order' });
  }
}

/*
*
*/
export const getUserEvents = async ({ state, effects }, data) => {
  console.log(data, 'getUserEvents initial data');

  try {
    let options = {};

    if (isEmpty(data)) {
      options = {
        first: state.event.eventPerPage,
        skip: (state.order.activePage - 1) * state.event.eventPerPage
      }
    } else {
      options = data;
      if (!data.first) options.first = state.event.eventPerPage;
      if (!data.skip) options.skip = (state.event.activePage - 1) * state.event.eventPerPage;
    }

    console.log(options, 'getUserEvents options');

    const { getUserEvents } = await effects.gql.queries.getUserEvents(options);

    console.log(getUserEvents, 'getUserEvents results');

    state.event.events = keyBy(getUserEvents, 'id');

  } catch (e) {
    console.log(e, 'getUserEvents errors');
    // actions.alert.showError({ message: e.response.errors[0]['message'], title: 'Fetching Order' });
  }
}

/*
*
*/
export const saveEvent = async ({ state, actions, effects }, data) => {
  const object = data;
  let result = {};

  try {
    var paymentSetting = 'EACH_PAY';
    if(data.paymentSettingIndex == 0) paymentSetting = 'COMPED_BY_CREATOR';

    var maxBudgetPer = null;
    if(data.maxSpend) maxBudgetPer = parseFloat(data.maxSpend);

    const params = {};

    params.data = {
      name: data.name,
      description: data.description,
      creator: { connect: { id: state.currentUser.id }},
      tags: { set: [data.name.toLowerCase()] },
      days: {
        create: [{
          name: data.name,
          description: data.description,
          paymentSetting,
          maxBudgetPer,
          type: 'SPECIAL_EVENT',
          startDate: data.deliveryDate,
          endDate: data.deliveryDate,
        }]
      }
    }

    params.users = map(data.attendees, 'id');

    if(data.site?.details?.place_id) params.googlePlacesId = data.site.details.place_id;
    if(data.site && data.site.name === 'Use current location') params.gps = { lat: data.site.details.coords.latitude, lon: data.site.details.coords.longitude };

    console.log(params, 'saveEvent')
    const { createEventNotifyAttendees } = await effects.gql.mutations.createEventNotifyAttendees(params);

    // state.event.events = assignIn(state.event.events, createEventNotifyAttendees );
    await actions.event.getUserEvents({ userId: state.currentUser.id });
    actions.hud.hide();

    result = createEventNotifyAttendees;
    return result;

  } catch (exception) {
    console.log('saveEvent error', exception);
    actions.alert.showError({ message: exception.response.errors[0]['message'], title: 'Flute' })
  }
}

/*
*
*/
export const createEventNotifyAttendees = async ({ state, actions, effects }, data) => {
  console.log('action createEventNotifyAttendees...', data);

  try {
    const { createEventNotifyAttendees } = await effects.gql.queries.createEventNotifyAttendees(data);

    console.log(createEventNotifyAttendees, 'createEventNotifyAttendees results');

    await actions.event.getUserEvents({userId: state.currentUser.id });

  } catch (e) {
    console.log(e, 'createEventNotifyAttendees errors');
    // actions.alert.showError({ message: e.response.errors[0]['message'], title: 'Fetching Order' });
  }
}

/*
*
*/
export const onChangePage = async ({ state }, page) => {
  state.event.activePage = page
}

/*
*
*/
export const onEventAdded = ({ state }, data) => {
  state.event.events.push(data)
}

/*
*
*/
export const addInviteesToEvent = async ({ state, effects, actions }, data) => { // users, eventId
  actions.hud.show();
  try {
    console.log(data, '============== Pass data to add Invitees to event')
    const { addInviteesToEvent } = await effects.gql.mutations.addInviteesToEvent(data);
    console.log(addInviteesToEvent);
    await actions.event.getUserEvents({ userId: state.currentUser.id });
    actions.hud.hide();
    return addInviteesToEvent;
  } catch (e) {
    console.log(e);
    actions.hud.hide();
  }

  // update the event
  // state.event.events[data.eventId] = addInviteesToEvent
};

/*
*
*/
export const getEvent = async ({effects}, data) => {
  return await effects.gql.queries.getEvent(data);
}

/*
*
*/
export const cancelEvent = async ({ effects, actions, state }, data) => {
  actions.hud.show();
  await effects.gql.mutations.cancelEvent(data);
  await actions.event.getUserEvents({ userId: state.currentUser.id });
  actions.hud.hide();
}
