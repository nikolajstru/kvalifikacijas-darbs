/* eslint-disable no-console */
export default (vm) => {
  function checkValidUser() {
    let lsUser = localStorage.getItem('USER');
    if (typeof lsUser === 'string') {
      lsUser = JSON.parse(lsUser);
    }
    if (!lsUser || !lsUser.id) {
      localStorage.removeItem('USER');
      console.log('Login off');
      return false;
    }
    return true;
  }

  window.addEventListener('login_api_login', ({ detail }) => {
    localStorage.setItem('USER', JSON.stringify(detail));
    vm.$router.push('profile');
    console.log('Someone logged in');
  });

  window.addEventListener('login_api_logout', () => {
    localStorage.removeItem('USER');
    vm.$router.push('/');
    console.log('Someone logged out');
  });

  window.addEventListener('login_api_change', ({ detail }) => {
    if (checkValidUser()) {
      localStorage.setItem('USER', JSON.stringify(detail));
      vm.$router.push('profile');
      console.log('Someone changed the login');
    }
  });
};
