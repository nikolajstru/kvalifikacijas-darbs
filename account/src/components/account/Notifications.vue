<template>
    <div>
        <div v-if="loading">
            <Loading/>
        </div>
        <div v-else>
            <div v-if="newNotifications.length === 0">
                <div class="text-center font-italic">
                    {{$t('noNotifications')}}
                </div>
            </div>
            <div v-if="wentWrong" class="text-center">
                {{$t('sentErrorTryAgain')}}
            </div>
            <div v-else>
                <div v-for="(item, index) in notifications"
                     :key="index"
                     class="notification"
                     @click="toggleCollapse(index, 'general')"
                     :class="{'unread': item.status === 'not_seen'}">
                    <div v-if="item.status === 'seen' || item.status === 'not_seen'"
                         class="border-bottom py-4 collapse-rotate-arrow"
                         :class="{'cursor-pointer': !item.isOpen}">
                        <div class="row px-2 no-gutters cursor-pointer"
                             @click="toggleCollapse(index, 'btn')">
                            <div class="col-2 d-flex">
                                <i v-if="item.notificationData.payload.type === 'MVP'"
                                     class="m-auto msg-mvp-logo"></i>
                                <i v-else
                                   class="m-auto msg-delfi-plus-logo"></i>
                            </div>
                            <div class="col cursor-pointer">
                                <div class="row">
                                    <div class="col">
                                        {{item.notificationData.payload.title}}
                                    </div>
                                    <div class="col-2 d-flex justify-content-end align-self-start">
                                        <div class="d-flex align-items-center">
                                            <i class="notification-circle mr-2"></i>
                                            <i class="icon-ellipsis-v px-3 cursor-pointer"
                                               data-toggle="dropdown"></i>
                                            <div class="dropdown dropdown-menu dropdown-menu-right">
                                                <span class="dropdown dropdown-item remove-button"
                                                      @click="removeNotification(index)">
                                                    {{$t('delete')}}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col text-size-10 text-muted pt-1">
                                        {{
    `${item.createdAt.substr(8, 2)}.${item.createdAt.substr(5, 2)}.${item.createdAt.substr(0, 4)}`
                                        }}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <b-collapse v-model="item.isOpen"
                                    :id="`notification-body-${index}`"
                                    class="row px-2 ql-snow">
                            <div class="col-10 ql-editor offset-2 pt-3 pb-4"
                                 v-html="item.notificationData.payload.body">
                            </div>
                        </b-collapse>
                        <div @click="toggleCollapse(index, 'btn')"
                             class="text-steel-gray text-center text-size-15 cursor-pointer"
                             style="height: 20px;margin-bottom: -20px;">
                            <i v-if="item.isOpen"
                               class="icon-arrows-thin-top position-absolute"></i>
                            <i v-else
                               class="icon-arrows-thin-bottom position-absolute"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
/* eslint-disable no-console */
/* global gtag */
import axios from 'axios';
import Loading from './partials/Loading.vue';
import getWebNotifications from '../../graphql/getWebNotifications.graphql';
import updateNotificationStatus from '../../graphql/updateNotificationStatus.graphql';

export default {
  data() {
    return {
      errors: [],
      notifications: [],
      wentWrong: false,
      loading: true,
      ignoreOneClick: false,
    };
  },
  components: {
    Loading,
  },
  mounted() {
    this.getNotifications();
    gtag('event', 'click', { event_category: 'Account', event_action: 'Notification page: loaded' });
  },
  computed: {
    newNotifications() {
      const noti = [];
      this.notifications.forEach((item) => {
        if (item.status === 'seen' || item.status === 'not_seen') {
          noti.push(item);
        }
      });
      return noti;
    },
    user() {
      return this.$store.getters.user;
    },
  },
  methods: {
    toggleCollapse(index, src) {
      if (this.notifications[index].isOpen && src === 'btn') {
        this.notifications[index].isOpen = false;
        this.ignoreOneClick = true;
      } else if (!this.notifications[index].isOpen && !this.ignoreOneClick) {
        this.notifications[index].isOpen = true;
        if (this.notifications[index].status === 'not_seen') {
          this.notifications[index].status = 'seen';
          this.readNotification(this.notifications[index].id);
          this.sendReadToDatabase(index);
          this.$emit('updateNotificationCount');
        }
      } else if (this.ignoreOneClick && src === 'general') {
        this.ignoreOneClick = false;
      }
    },
    async getNotifications() {
      const headers = {};
      if (this.user.loginApiToken) {
        headers.Authorization = `Bearer ${this.user.loginApiToken}`;
      }
      await axios({
        headers,
        url: 'https://api.delfi.lv/notifications/v1/graphql',
        method: 'post',
        data: {
          query: getWebNotifications,
        },
      })
        .then(
          (response) => {
            this.loading = false;
            this.notifications = response.data.data.getWebNotifications.notifications;
          },
          (error) => {
            this.loading = false;
            console.log('getNotifications error', error);
            this.wentWrong = true;
          },
        );
    },
    async readNotification(id) {
      const headers = {};
      if (this.user.loginApiToken) {
        headers.Authorization = `Bearer ${this.user.loginApiToken}`;
      }
      await axios({
        headers,
        url: 'https://api.delfi.lv/notifications/v1/graphql',
        method: 'post',
        data: {
          query: updateNotificationStatus,
          variables: JSON.stringify({
            id,
            status: 'seen',
          }),
        },
      });
      gtag('event', 'click', { event_category: 'Account', event_action: 'Notification page: open unread message' });
    },
    async removeNotification(index) {
      const headers = {};
      if (this.user.loginApiToken) {
        headers.Authorization = `Bearer ${this.user.loginApiToken}`;
      }
      await axios({
        headers,
        url: 'https://api.delfi.lv/notifications/v1/graphql',
        method: 'post',
        data: {
          query: updateNotificationStatus,
          variables: JSON.stringify({
            id: this.notifications[index].id,
            status: 'deleted',
          }),
        },
      }).then(() => {
        this.notifications.splice(index, 1);
      });
    },
    async sendReadToDatabase(index) {
      const url = window.switchLiveUrlsToNeo(`//${(process.env.VUE_APP_LOCALE === 'ru_LV' ? 'rus' : 'www')}.delfi.lv/delfi-plus/notificationsAxios.php`);
      await axios({
        url,
        method: 'post',
        data: JSON.stringify({
          action: 'ADD',
          subject: 'stats',
          user_id: `${this.user.profile.id}`,
          notification_group_id: `${this.notifications[index].notificationData.payload.uid}`,
        }),
      });
    },
  },
};
</script>

<style lang="scss" scoped>
    .msg-delfi-plus-logo{
        &:after {
            content: " ";
            display: inline-block;
            width: 21px;
            height: 21px;
            background-repeat: no-repeat;
            background-image: url("//g.delfi.lv/delfi-plus/i/D+_colored.svg");
            top: .5rem;
            left: .4rem;
        }
    }
    .msg-mvp-logo{
        &:after {
            content: " ";
            display: inline-block;
            width: 45px;
            height: 21px;
            background-repeat: no-repeat;
            background-size: 100%;
            background-image: url("//g.delfi.lv/mvp/svg/mvp-black.svg");
            top: .5rem;
            left: .4rem;
        }
    }
</style>
