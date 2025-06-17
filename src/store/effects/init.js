export default {
  async initialize(actions) {
    actions.window.initialize();

    console.log('check if user is logged in...');

    const { token, userId } = await actions.getStoredAuthToken();
    if (token && userId) {
      await actions.loginWithToken({ token, userId });
    }
  }
}
