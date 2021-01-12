<template>
    <div>
        <div v-if="permissions.loading" class="d-flex justify-content-center mb-3">
                <b-spinner label="Loading..."></b-spinner>
        </div>
        <div v-else-if="permissions.data">
            <div v-if="wentWrong" class="font-weight-bold d-flex text-danger">
                <h3 class="my-auto d-inline">
                    Something went wrong...
                </h3>
                <button type="button" class="btn btn-secondary rounded-pill ml-auto" @click="reset">Reset</button>
            </div>
            <div v-else-if="notification.sending">
                <transition name="fade">
                    <div v-if="!notification.sent">
                        <b-progress :value="notifications.sentChunkCount"
                                    :max="userChunks.length"
                                    show-progress
                                    animated
                                    class="mb-3"
                        ></b-progress>
                        <div class="text-center">
                            Sending. Please, wait!
                        </div>
                        <div class="row text-center justify-content-center loading-spinners pt-5 pt-md-0 mb-3">
                            <div class="spinner-grow" role="status">
                                <span class="sr-only"></span>
                            </div>
                            <div class="spinner-grow mx-2" role="status">
                                <span class="sr-only"></span>
                            </div>
                            <div class="spinner-grow" role="status">
                                <span class="sr-only"></span>
                            </div>
                        </div>
                    </div>
                </transition>
                <div v-if="notification.sent">
                    <b-alert v-if="notifications.wentWrong" show dismissible variant="danger">
                        <strong>Warning!</strong>
                        <br>
                        {{users.length - notifications.failed.length}} from {{users.length}} notifications were sent successfully!
                        <br>
                        {{notifications.failed.length}} notifications failed!
                    </b-alert>
                    <b-alert v-else show dismissible variant="success">
                        <strong>Success!</strong> All {{notifications.data.length}} notifications were sent successfully!
                    </b-alert>
                    <div class="d-flex align-self-center mb-3">
                        <button type="button" class="btn btn-primary rounded-pill mx-auto" @click="reset">Create new notification</button>
                    </div>
                    <div>
                        <div class="card mb-3">
                            <div class="card-header" id="headingOne">
                                <h5 class="mb-0">
                                    <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapseOne">
                                        Show failed responses
                                    </button>
                                </h5>
                            </div>

                            <div id="collapseOne" class="collapse show" aria-labelledby="headingOne">
                                <div class="card-body">
                                    <table v-if="notifications.failed.length > 0" class="table">
                                        <thead>
                                            <tr>
                                                <th scope="col">Nr.</th>
                                                <th scope="col">User ID</th>
                                                <th scope="col">Error</th>
                                            </tr>
                                        </thead>
                                        <tbody >
                                            <tr v-for="(item, index) in notifications.failed" v-bind:key="item">
                                                <th scope="row">
                                                    {{index+1}}
                                                </th>
                                                <td>
                                                    {{item.userId}}
                                                </td>
                                                <td>
                                                    {{item.error}}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <div v-else class="text-center text-muted">
                                        <div>
                                            <img src="https://g.delfi.lv/delfi-plus/icons/no-data.svg" alt="No data">
                                        </div>
                                        All notifications was sent successfully!
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="card">
                            <div class="card-header" id="headingTwo">
                                <h5 class="mb-0">
                                    <button class="btn btn-link collapsed" type="button"  data-toggle="collapse" data-target="#collapseTwo">
                                        Show success responses
                                    </button>
                                </h5>
                            </div>
                            <div id="collapseTwo" class="collapse show">
                                <div class="card-body">
                                    <table v-if="notifications.data.length > 0"  class="table">
                                        <thead>
                                        <tr>
                                            <th scope="col">Nr.</th>
                                            <th scope="col">User ID</th>
                                            <th scope="col">Notification ID</th>
                                        </tr>
                                        </thead>
                                        <tbody >
                                        <tr v-for="(item, index) in notifications.data" v-bind:key="index">
                                            <th scope="row">
                                                {{index+1}}
                                            </th>
                                            <td>
                                                {{item.userId}}
                                            </td>
                                            <td>
                                                {{item.response[0].id}}
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                    <div v-else class="text-center text-muted">
                                        <div>
                                            <img src="https://g.delfi.lv/delfi-plus/icons/no-data.svg" alt="No data">
                                        </div>
                                        All notifications was sent unsuccessfully!
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else>
                <div v-if="users.length <= 0">
                    <div id="noUserSelected" class="text-danger text-center">
                        <strong>
                            No users selected
                        </strong>
                    </div>
                </div>
                <div>
                    <div v-if="templates.loading" class="form-group">
                        <label for="notificationTemplates">Notification template</label>
                        <div class="border-1 border rounded py-1 d-flex justify-content-center">
                            <b-spinner label="Loading..."></b-spinner>
                        </div>
                    </div>
                    <div v-else-if="templates.wentWrong" class="form-group">
                        <label for="notificationTemplates">Notification template</label>
                        <div class="border-1 border rounded py-1 d-flex text-center text-danger">
                            Can't load templates
                        </div>
                    </div>
                    <div v-else class="form-group">
                        <label for="notificationTemplates">Notification template</label>
                        <select class="form-control"
                                id="notificationTemplates"
                                @change="selectTemplate"
                                v-model="template.chosen">
                            <option value=""></option>
                            <option v-for="item in templates.data" :value="item" :key="item.id">
                                {{item.description}}
                            </option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label for="notificationType">Notification type</label>
                    <select class="form-control validate-input"
                            id="notificationType"
                            required
                            v-model="notification.type">
                        <option value=""></option>
                        <option value="DELFI">DELFI</option>
                        <option value="MVP">MVP</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="notificationTitle">Notification title</label>
                    <input type="text"
                           class="form-control validate-input"
                           id="notificationTitle"
                           required
                           v-model="notification.title">
                </div>
                <div class="position-relative custom-overlay-spinner">
                    <label for="myQuillEditor">Notification Body</label>
                    <div v-if="editorLoading" class="overlay text-center">
                        <b-spinner class="overlay-spinner" label="Loading..."></b-spinner>
                    </div>
                    <quill id="myQuillEditor" v-model="notification.body" :config="config" output="html" ref="myQuillEditor" ></quill>
                </div>
                <div class="form-check pt-3">
                    <input type="checkbox" id="saveTpl" class="form-check-input" v-model="template.save">
                    <label class="form-check-label" for="saveTpl">
                        Save template
                    </label>
                </div>
                <transition name="fade">
                    <div v-if="template.save" class="form-group mt-3">
                        <label for="newTemplateDescription">Template description</label>
                        <input type="text"
                               class="form-control validate-input"
                               id="newTemplateDescription"
                               required
                               v-model="template.description"
                               placeholder="Notification description">
                    </div>
                </transition>
                <div class="d-flex">
                    <button type="button"
                            class="btn btn-primary btn-sm rounded-pill ml-auto my-3 mx-auto"
                            @click="reask"
                    >Send notifications</button>
                </div>
            </div>
        </div>
        <div v-else class="font-weight-bold text-center text-danger">
            No permissions.
            <br>
            Please, contact DIT!
        </div>
        <b-modal id="reaskModal" size="lg" :title="`Send this message to ${users.length} users?`" hide-footer centered>
            <div>
                <strong>
                    Title:
                </strong>
            </div>
            <div class="py-4" style="padding-left: 15px; padding-right: 15px;">
                {{notification.title}}
            </div>
            <div>
                <strong>
                    Body:
                </strong>
            </div>
            <p class="my-4 ql-editor" v-html="notification.body"></p>
            <div class="d-flex justify-content-center">
                <b-button class="m-2" @click="$bvModal.hide('reaskModal')">Close</b-button>
                <b-button class="m-2" variant="primary" @click="sendNotification">SEND</b-button>
            </div>
        </b-modal>
    </div>
</template>

<script>
import axios from 'axios';
import notifyUsers from '../../graphql/notification/notifyUsers.graphql';
import logProcessing from '../../graphql/notification/logProcessingMutation.graphql';

export default {
  name: 'SendNotification',
  props: {
    selectedUsers: Object,
    sentNotification: Function,
    user: Object,
  },
  data() {
    return {
      notification: {
        title: '',
        body: '',
        type: '',
        sending: false,
        sent: false,
      },
      notifications: {
        failed: [],
        data: [],
        sentChunkCount: 0,
        wentWrong: false,
      },
      template: {
        chosen: null,
        description: null,
        save: false,
      },
      templates: {
        loading: false,
        wentWrong: false,
        data: [],
      },
      userChunks: [],
      chunkLength: 500,
      permissions: {
        loading: true,
        data: false,
      },
      users: [],
      editorLoading: false,
      wentWrong: false,
      timestamp: null,
      errorMessage: '',
      config: {
        modules: {
          toolbar: {
            container: [
              ['bold', 'italic', 'underline', 'strike'],
              [{ header: 1 }, { header: 2 }],
              [{ list: 'ordered' }, { list: 'bullet' }],
              [{ script: 'sub' }, { script: 'super' }],
              [{ indent: '-1' }, { indent: '+1' }],
              [{ size: ['small', false, 'large', 'huge'] }],
              [{ header: [1, 2, 3, 4, 5, 6, false] }],
              [{ color: [] }, { background: [] }],
              [{ align: [] }],
              ['link'],
              ['image'],
              ['clean'],
            ],
            handlers: {
              image: this.imageHandler
            }
          },
        },
      },
    };
  },
  activated() {
    this.getTemplates();
    this.updateUserList();
    this.splitToChunks().then(() => {
      if (
        this.user.rights && this.user.rights.indexOf('w') > -1
        && this.user.userType && this.user.userType.indexOf('dplusCRM') > -1
      ) {
        this.permissions.loading = false;
        this.permissions.data = true;
      }
    });
    this.timestamp = `${Date.now()}`;
  },
  created() {
    this.timestamp = `${Date.now()}`;
    this.getTemplates();
    this.updateUserList();
  },
  computed: {
    editor() {
      return this.$refs.myQuillEditor.$refs.quill.__quill
    }
  },
  methods: {
    setEditor(body) {
      const delta = this.$refs.myQuillEditor.editor.clipboard.convert(body);
      this.$refs.myQuillEditor.$refs.quill.__quill.setContents(delta, 'silent');
    },
    updateUserList() {
      this.users = [];
      for (const user in this.selectedUsers){
        this.users.push(this.selectedUsers[user]);
      }
    },
    async splitToChunks() {
      let i,j;
      let users = [];
      this.userChunks = [];
      for (let user of this.users) {
        users.push({
          userId: String(user.userId),
          userType: 'loginApi',
        });
      }
      for (i=0,j=users.length; i<j; i+=this.chunkLength) {
        this.userChunks.push(users.slice(i,i+this.chunkLength));
      }
      console.log('chunks', this.userChunks);
    },
    async sendNotification() {
      this.$bvModal.hide('reaskModal');
      this.$emit('notificationSent');
      this.notification.sending = true;
      for (const chunk of this.userChunks) {
        await this.notifyUsers(chunk).then(() => {
          this.notifications.sentChunkCount += 1;
        });
      }
      this.notification.sent = true;
      if (this.template.save) {
        this.addTemplate();
      }
      this.logProcess('ok');
    },
    async notifyUsers(users) {
      await axios({
        url: 'https://api.internal.delfi.lv/notifications/v1/graphql',
        method: 'post',
        data: {
          query: notifyUsers,
          variables: JSON.stringify({
            users,
            title: this.notification.title,
            type: this.notification.type,
            body: this.notification.body,
            userId: this.user.id,
            uid: this.timestamp,
          }),
        },
      }).then(
        (response) => {
          console.log('notifyUsers response', response);
          for (let item of response.data.data.notifyUsers) {
            this.notifications.data.push(item);
          }
        },
        (error) => {
          this.notifications.wentWrong = true;
          users.forEach((item) => {
            this.notifications.failed.push({
              userId: item.userId,
              error: error,
            });
          });
          console.log('notifyUsers error', error);
        }
      );
    },
    reask() {
      if (this.users.length <= 0) {
        this.shakeElement('noUserSelected');
      } else if (this.notification.body.length === 0) {
        alert('Notification body is empty! Please, add content and try again.')
      } else if (this.checkValidation()) {
        this.$bvModal.show('reaskModal');
      }
    },
    excludeQuotes(text) {
      return text.replace(/["']/g, "")
    },
    selectTemplate() {
      this.notification.title = this.template.chosen.title;
      this.notification.body = this.template.chosen.body;
      this.setEditor(this.template.chosen.body);
    },
    async getTemplates() {
      this.templates.loading = true;
      this.templates.data = [];
      const url = this.switchLiveUrlsToNeo('http://www.delfi.lv/delfi-plus/notificationsAxios.php');
      await axios({
        url,
        method: 'post',
        data: JSON.stringify({
          action: 'GET',
          subject: 'templates',
          user_id: `${this.user.id}`,
        }),
      }).then(
        (response) => {
          this.templates.loading = false;
          if (response.data.length > 0) {
            this.templates.data = response.data;
          }
        },
        (error) => {
          this.templates.loading = false;
          this.templates.wentWrong = true;
          console.log('getInfoAboutNotificationGroups error', error);
        }
      );
    },
    async addTemplate() {
      const url = this.switchLiveUrlsToNeo('http://www.delfi.lv/delfi-plus/notificationsAxios.php');
      await axios({
        url,
        method: 'post',
        data: JSON.stringify({
          action: 'ADD',
          subject: 'templates',
          user_id: `${this.user.id}`,
          title: this.notification.title,
          body: this.notification.body,
          description: this.template.description
        }),
      }).then(
        (response) => {
          console.log('add template response', response);
        },
        (error) => {
          console.log('add template error', error);
        }
      );
    },
    reset () {
      this.notification = {
        title: '',
        body: '',
        type: '',
        sending: false,
        sent: false,
      };
      this.notifications = {
        failed: [],
        data: [],
        sentChunkCount: 0,
        wentWrong: false,
      };
      this.template = {
        chosen: null,
        description: null,
        save: false,
      };
      this.templates = {
        loading: false,
        wentWrong: false,
        data: [],
      };
      this.userChunks = [];
      this.users = [];
      this.$emit('reset');
      this.setEditor(this.notification.body);
    },
    imageHandler() {
      const self = this;
      const input = document.createElement('input');
      input.setAttribute('type', 'file');
      input.setAttribute('accept', 'image/*');
      input.click();
      input.onchange = async function() {
        self.editorLoading = true;
        const file = input.files[0];

        let data = new FormData();
        data.append('image', file);

        await axios({
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          url: 'https://neo.delfi.lv/internal/local/special-admin/saveImage.php',
          method: 'post',
          data
        }).then(
          (response) => {
            self.editorLoading = false;
            if (response.status === 200 && response.data.status === 'ok') {
              const link = response.data.link;
              self.editor.insertEmbed(self.editor.getLength(), 'image', link);
            }
          },
          (error) => {
            self.editorLoading = false;
            console.log('FAILURE!!', error);
          }
        );
      }
    },
    checkValidation() {
      let valid = true;
      document.querySelectorAll('.validate-input').forEach((item) => {
        if (!item.checkValidity()) {
          valid = false;
          item.reportValidity();
        }
      });
      return valid;
    },
    async logProcess(status) {
      const headers = {};
      headers.Authorization = `Bearer ${this.user.loginApiToken}`;
      const content = {
        status: status,
        uid: this.timestamp,
        title: this.notification.title,
        text: this.notification.body,
        sentCount: this.notifications.data.length,
        product: this.notification.type,
      };
      await axios({
        headers,
        url: 'https://api.delfi.lv/payment-processing/v1/graphql',
        method: 'post',
        data: {
          query: logProcessing,
          variables: JSON.stringify({
            createdBy: `${this.user.id}`,
            process: 'ADD',
            action: 'sendNotification',
            content: content
          }),
        },
      }).then(
        (response) => {
          console.log('good', response);
        },
        (error) => {
          console.log('logProcess error', error);
        }
      );
    }
  },
};
</script>

<style scoped>
    .table .bg-danger {
        background-color: #f8d7da;
    }
    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s;
    }
    .fade-leave-active {
        transition-delay: 2s;
    }
    .fade-enter, .fade-leave-to {
        opacity: 0;
    }
</style>

<style>
    .ql-toolbar {
        border-top-left-radius: .25rem !important;
        border-top-right-radius: .25rem !important;
    }
    .ql-container {
        border-bottom-left-radius: .25rem !important;
        border-bottom-right-radius: .25rem !important;
    }
</style>
