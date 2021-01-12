<template>
    <nav class="navbar navbar-expand-sm bg-light">
        <button class="navbar-toggler d-block d-lg-none custom-toggler"
                type="button" @click="openSidebar">
            <span class="navbar-toggler-icon"></span>
        </button>
        <ul v-if="userLogged" class="navbar-nav ml-auto">
            <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle text-dark"
                   href="#" id="navbardrop" data-toggle="dropdown">
                    <i class="icon-ui-user"></i>
                </a>
                <div class="dropdown-menu dropdown-menu-right position-absolute">
                    <router-link class="dropdown-item" to="/profile">Profile</router-link>
                    <button class="dropdown-item" @click="doLogout">
                        Logout
                    </button>
                </div>
            </li>
        </ul>

        <router-link v-else class="nav-link text-pale-sky border btn-pill
         ml-auto py-1 px-3
          login-api-user-auth position-relative no-select" to="/login">
            <span class="logout-content">
                <i class="icon-ui-user mr-2"></i>
                Pieslēgties
            </span>
        </router-link>
    </nav>
</template>

<script>
/* eslint-disable no-console */
export default {
  name: 'Header',
  props: {
    sidebarIsOpened: Boolean,
    user: Object,
  },
  data() {
    return {
      userLogged: false,
    };
  },
  watch: {
    user() {
      if (this.user == null) {
        this.userLogged = false;
      } else {
        this.userLogged = true;
      }
    },
  },
  methods: {
    openSidebar() {
      this.$emit('toogleSidebar', true);
    },
    doLogout() {
      console.log('init logout from api');
      window.LoginAPI.logout(() => {
        console.log('done logout from api - please wait for logout event now');
      });
    },
  },
  mounted() {
    if (this.user == null) {
      this.userLogged = false;
    } else {
      this.userLogged = true;
    }
  },
};
</script>

<style scoped>
    @media screen and (min-width: 992px) {
        .navbar{
            margin-left: 60px;
        }
    }
    .navbar{
        min-height: 60px;
    }
    .custom-toggler.navbar-toggler {
        border-color: #d8d8d8;
    }
    .custom-toggler .navbar-toggler-icon {
        background-image: url("data:image/svg+xml;charset=utf8,%3Csvg viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath stroke='rgba(52,58,64, 0.7)' stroke-width='2' stroke-linecap='round' stroke-miterlimit='10' d='M4 8h24M4 16h24M4 24h24'/%3E%3C/svg%3E");
    }
</style>
