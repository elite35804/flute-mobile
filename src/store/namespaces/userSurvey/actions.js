/*
 *
 */
export const getTotalUserSurveys = async ({ state, effects }, data) => {
  let options = {};
  if (data && data.options) options = data.options;
  const { userSurveys } = await effects.gql.queries.userSurveysForTotal(options);

  state.userSurvey.totalRecords = userSurveys ? userSurveys.length : 0;
  return userSurveys;
};

/*
 *
 */
export const getUserSurveys = async ({ state, effects }, data) => {
  console.log("action getUserSurveys...");
  try {
    let options = {};
    if (!data) {
      options = {
        first: state.userSurvey.userSurveyPerPage,
        skip:
          (state.userSurvey.activePage - 1) *
          state.userSurvey.userSurveyPerPage,
      };
    } else {
      if (data && data.all) options = {};
      else {
        options = data;
        if (!data.first) options.first = state.userSurvey.userSurveyPerPage;
        if (!data.skip)
          options.skip =
            (state.userSurvey.activePage - 1) *
            state.userSurvey.userSurveyPerPage;
      }
    }
    //
    console.log(options, 'options')
    const { userSurveys } = await effects.gql.queries.userSurveys(options);
    if (data && data.getValues) return userSurveys;
    else state.userSurvey.userSurveys = userSurveys;
  } catch (e) {
    console.log(e, "getUserSurveys errors");
  }
};

/*
 *
 */
export const saveUserSurvey = async ({ effects, actions }, data) => {
  try {
    return await effects.gql.mutations.saveUserSurvey(data);
  } catch (e) {
    console.log(e, "saveUserSurvey errors");
    actions.alert.showError({
      message:
        e.response && e.response.errors && e.response.errors.length
          ? e.response.errors[0]["message"]
          : "Error",
      title: "Saving UserSurvey",
    });
  }
};

/*
 *
 */
export const onChangePage = async ({ state }, page) => {
  state.userSurvey.activePage = page;
};

/*
 *
 */
export const onUserSurveyAdded = ({ state }, data) => {
  state.userSurvey.push(data);
};

export const getUserSurveyByName = async ({ effects, actions }, data) => {
  try {
    const resp = await effects.gql.queries.userSurveys(data);
    return resp;
  } catch (e) {
    actions.alert.showError({
      message:
        e.response && e.response.errors && e.response.errors.length
          ? e.response.errors[0]["message"]
          : "Error",
      title: "Get UserSurvey By Name",
    });
  }
};
