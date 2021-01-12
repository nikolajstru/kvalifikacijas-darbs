import Vue from 'vue';
import Router from 'vue-router';
import Account from './components/account/Account.vue';
import Login from './components/account/Login.vue';
import Profile from './components/account/Profile.vue';
import Notifications from './components/account/Notifications.vue';
import BasicInfo from './components/account/profile/BasicInfo.vue';
import BasicInfoEdit from './components/account/profile/BasicInfoEdit.vue';
import ContactInfo from './components/account/profile/ContactInfo.vue';
import ContactInfoEdit from './components/account/profile/ContactInfoEdit.vue';
import PasswordChange from './components/account/profile/PasswordChange.vue';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: '/account/',
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/',
      name: 'account',
      component: Account,
      children: [
        {
          path: 'profile',
          name: 'profile',
          component: Profile,
          children: [
            {
              path: '',
              name: 'basicInfo',
              component: BasicInfo,
            },
            {
              path: 'edit',
              name: 'basicInfoEdit',
              component: BasicInfoEdit,
            },
            {
              path: 'contacts',
              name: 'contactInfo',
              component: ContactInfo,
            },
            {
              path: 'contacts/edit',
              name: 'contactInfoEdit',
              component: ContactInfoEdit,
            },
            {
              path: 'password-change',
              name: 'passwordChange',
              component: PasswordChange,
            },
          ],
        },
        {
          path: 'notifications',
          name: 'notifications',
          component: Notifications,
        },
      ],
    },
  ],
});

router.beforeEach((to, from, next) => {
  const user = localStorage.getItem('USER') ? JSON.parse(localStorage.getItem('USER')) : '';
  if (user) {
    if (!to.matched.length || to.name === 'login') {
      next('/');
    } else {
      next();
    }
  } else if (to.name !== 'login') {
    next(
      {
        path: '/login',
        query: to.query,
      },
    );
  } else {
    next();
  }
});

export default router;
