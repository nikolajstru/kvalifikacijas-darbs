<template>
    <div id="user-avatar" class="user-avatar row">
        <div class="col-12">
            <div class="row">
                <div class="col-12">
                    <img :src="user.profile.avatar"
                         class="img w-100 rounded-circle login-api-user-avatar" alt="Avatar">
                    <div class="login-api-user-avatar-overlay-wrap w-100 h-100">
                        <div class="login-api-user-avatar-overlay
                        position-relative w-100 h-100"></div>
                    </div>
                </div>
            </div>
            <div class="row user-avatar-options position-absolute w-100 text-white">
                <div class="w-100 h-100 py-5 position-absolute">
                    <div class="w-50 h-100 border-porcelain border-right"></div>
                </div>
                <div class="col-6 pr-0 position-relative">
                    <i class="icon-media-camera"></i>
                    <input type="file"
                           id="login-api-user-avatar-input"
                           class="w-100 h-100 d-block avatar-upload cursor-pointer"
                           name="avatar"
                           accept="image"
                           @change="initAvatarChange()"
                           >
                </div>
                <div class="col-6 pl-0 position-relative avatar-remove-btn  cursor-pointer"
                     v-on:click="initAvatarRemove()">
                    <i class="icon-trash"></i>
                </div>
            </div>
            <div class="row position-absolute w-100">
                <div class="col-4 offset-4 user-avatar-edit-wrap">
                    <div class="bg-white rounded-circle shadow-sm cursor-pointer"
                         v-on:click="toggleAvatarUpload()">
                        <i v-show="!uploadingProcess" id="user-avatar-edit"
                        class="text-size-3 text-center text-pale-sky
                        icon-media-camera"></i>
                        <div v-show="uploadingProcess" class="spinner-grow
                            text-pale-sky mx-auto text-size-3" role="status">
                            <span class="sr-only">Loading...</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
/* eslint-disable no-console, no-alert, no-restricted-globals */
export default {
  data() {
    return {
      errors: [],
      uploadingProcess: false,
    };
  },
  computed: {
    user() {
      return this.$store.getters.user;
    },
  },
  methods: {
    toggleAvatarUpload() {
      this.errors = [];
      const icon = document.getElementById('user-avatar-edit');
      if (icon.classList.contains('icon-media-camera')) {
        icon.classList.add('icon-cross-thin');
        icon.classList.remove('icon-media-camera');
        document.getElementById('user-avatar').classList.add('edit-mode');
      } else {
        icon.classList.remove('icon-cross-thin');
        icon.classList.add('icon-media-camera');
        document.getElementById('user-avatar').classList.remove('edit-mode');
        window.LoginAPI.updateProfile();
      }
    },
    initAvatarChange() {
      this.uploadingProcess = true;
      window.LoginAPI.uploadAvatar(
        document.getElementById('login-api-user-avatar-input'),
        (response) => {
          this.uploadingProcess = false;
          if (response.errors) {
            alert('Kļūda');
          } else {
            this.toggleAvatarUpload();
            this.$emit('profileRefresh');
          }
        },
      );
    },
    initAvatarRemove() {
      window.LoginAPI.removeAvatar(() => {
        this.toggleAvatarUpload();
        this.$emit('profileRefresh');
      });
    },
  },
};
</script>

<style>
    .avatar-upload{
        opacity:0;
    }
    .user-avatar-options{
        top: 0;
        bottom: 0;
    }
    .user-avatar-options i {
        font-size: 1rem;
        position: absolute;
        top: calc(55% - 1rem);
    }
    .user-avatar-options .icon-trash{
        left: 36%;
    }
    .user-avatar-options .icon-media-camera{
        right: 36%;
    }
    .user-avatar-edit-wrap .rounded-circle{
        margin-top: -50%;
        width: 100%;
        padding-top: 100%;
        position: relative;
    }
    .user-avatar-edit-wrap .rounded-circle #user-avatar-edit{
        position: absolute;
        top: calc(55% - 12px);
        left: 0;
        bottom: 0;
        right: 0;
    }
    .user-avatar-edit-wrap .rounded-circle .spinner-grow{
        position: absolute;
        height: 20px;
        width: 20px;
        top: calc(55% - 12px);
        left: 0;
        bottom: 0;
        right: 0;
    }
    .login-api-user-avatar-overlay:before {
        content: "";
        position: absolute;
        top: -100%;
        height: 100%;
        width: 100%;
        left: 0;
        opacity: 0.5;
        background: black;
        border-radius: 100rem;
    }
    .user-avatar .login-api-user-avatar-overlay-wrap,
    .user-avatar .user-avatar-options {
        display: none;
    }
    .user-avatar.edit-mode .login-api-user-avatar-overlay-wrap,
    .user-avatar.edit-mode .user-avatar-options {
        display: flex;
    }

</style>
