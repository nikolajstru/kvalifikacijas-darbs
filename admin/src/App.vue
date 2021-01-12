<template>
  <div id="app">
    <div v-if="loginApiReady">
        <Navigation :user="user"></Navigation>
        <main id="main-container">
            <div class="w-75 mx-auto">
                <router-view :user="user"/>
            </div>
        </main>
        <Sprite></Sprite>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
import Sprite from './components/Sprite.vue';
import Navigation from './components/Navigation.vue';
import userProcessing from './graphql/notification/userProcessing.graphql';

export default {
  name: 'app',
  props: {
    LoginAPI: Object,
  },
  components: {
    Sprite,
    Navigation,
  },
  data() {
    return {
      user: {},
      userLogged: false,
      userRights: null,
      loginApiReady: false,
    };
  },
  methods: {
    async setUser(userData) {
      if (userData && userData.loginStatus) {
        this.user = userData;
        this.user.loginApiToken = window.LoginAPI.getToken();
        this.getUserRights().then(() => {
          if (this.userRights.data.data.userProcessing !== null) {
            this.user.rights = this.userRights.data.data.userProcessing.rights;
            this.user.userType = this.userRights.data.data.userProcessing.userType;
          }
          localStorage.setItem('USER', JSON.stringify(this.user));
        });
      } else {
        localStorage.removeItem('USER');
        this.user = null;
      }
    },
    async getUserRights() {
      const headers = {};
      headers.Authorization = `Bearer ${this.user.loginApiToken}`;
      this.userRights = await axios({
        headers,
        url: 'https://api.delfi.lv/payment-processing/v1/graphql',
        method: 'post',
        data: {
          query: userProcessing,
        },
      });
    },
  },
  created() {
    if (window.LoginAPI.isModuleInited()) {
      window.LoginAPI.getUserProfile((data) => {
        this.setUser(data.data).then(() => {
          this.loginApiReady = true;
          console.log('isModuleInited', data.data);
        });
      });
    } else {
      window.addEventListener('login_api_init', ({ detail }) => {
        this.setUser(detail).then(() => {
          this.loginApiReady = true;
          console.log('login_api_init');
        });
      });
    }
    window.addEventListener('login_api_logout', () => {
      this.user = null;
    });
    window.addEventListener('login_api_login', ({ detail }) => {
      this.setUser(detail).then(() => {
        this.$router.push('/');
      });
    });
    window.addEventListener('login_api_change', ({ detail }) => {
      this.setUser(detail).then(() => {
        this.$router.push('/');
      });
    });
  },
};
</script>

<style lang="scss">
    @media screen and (min-width: 992px) {
        #main-container{
            padding: 60px 0 0 60px;
        }
    }
    body{
        font-family: "Roboto",sans-serif;
    }
    .shake-an-element {
        -webkit-animation: kf_shake 0.4s 1 linear;
        -moz-animation: kf_shake 0.4s 1 linear;
        -o-animation: kf_shake 0.4s 1 linear;
    }
    @-webkit-keyframes kf_shake {
        0% { -webkit-transform: translate(30px); }
        20% { -webkit-transform: translate(-30px); }
        40% { -webkit-transform: translate(15px); }
        60% { -webkit-transform: translate(-15px); }
        80% { -webkit-transform: translate(8px); }
        100% { -webkit-transform: translate(0px); }
    }
    @-moz-keyframes kf_shake {
        0% { -moz-transform: translate(30px); }
        20% { -moz-transform: translate(-30px); }
        40% { -moz-transform: translate(15px); }
        60% { -moz-transform: translate(-15px); }
        80% { -moz-transform: translate(8px); }
        100% { -moz-transform: translate(0px); }
    }
    @-o-keyframes kf_shake {
        0% { -o-transform: translate(30px); }
        20% { -o-transform: translate(-30px); }
        40% { -o-transform: translate(15px); }
        60% { -o-transform: translate(-15px); }
        80% { -o-transform: translate(8px); }
        100% { -o-origin-transform: translate(0px); }
    }
</style>
