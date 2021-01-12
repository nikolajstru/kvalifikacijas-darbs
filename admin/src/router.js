import Vue from 'vue';
import Router from 'vue-router';
import Profile from './views/Profile.vue';
import Login from './views/auth/Login.vue';
import Register from './views/auth/Register.vue';
import Notifications from './views/Notifications.vue';
import NotificationTemplates from './views/notifications/Templates.vue';
import NotificationStats from './views/notifications/Stats.vue';
import CreateNotification from './views/notifications/Create.vue';
import Page403 from './views/Page403.vue';

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: NotificationStats,
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        requiresAuth: false,
      },
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
      meta: {
        requiresAuth: false,
      },
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/403',
      name: 'page403',
      component: Page403,
    },
    {
      path: '/notifications',
      name: 'notifications',
      component: Notifications,
      children: [
        {
          path: 'stats',
          name: 'notificationStats',
          component: NotificationStats,
          meta: {
            requiresAuth: true,
            requiresRead: true,
          },
        },
        {
          path: 'create',
          name: 'createNotification',
          component: CreateNotification,
          meta: {
            requiresAuth: true,
            requiresRead: true,
          },
        },
        {
          path: 'templates',
          name: 'notificationTemplates',
          component: NotificationTemplates,
          meta: {
            requiresAuth: true,
            requiresRead: true,
          },
        },
      ],
    },
  ],
});


router.beforeEach((to, from, next) => {
  if (to.name === 'page403' && from.name === null) {
    next({
      path: '/login',
    });
  }
  const user = localStorage.getItem('USER') ? JSON.parse(localStorage.getItem('USER')) : '';
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (user) {
      if (to.matched.some(record => record.meta.requiresRead)) {
        if (user.rights && user.rights.indexOf('r') > -1
          && user.userType && user.userType.indexOf('dplusCRM') > -1) {
          next();
        } else {
          next({
            path: '/403',
          });
        }
      } else if(to.matched.some(record => record.meta.requiresSpecialAdmin)) {
        if (user.rights && user.rights.indexOf('r') > -1
          && user.userType && (user.userType.indexOf('specialAdmin') > -1 || user.userType.indexOf('dplusCRM') > -1)) {
          next();
        } else {
          next({
            path: '/403',
          });
        }
      } else {
        next();
      }
    } else {
      next({
        path: '/login',
      });
    }
  } else {
    next();
  }
});

export default router;
