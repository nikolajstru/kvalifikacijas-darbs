<template>
    <div>
        <div class="d-flex align-self-center mb-3">
            <h2 class="my-auto d-inline">
                Notification templates
            </h2>
        </div>
        <div class="overflow-auto">
            <table class="table table-hover">
                <thead>
                <tr>
                    <th>
                        ID
                    </th>
                    <th>
                        Creator
                    </th>
                    <th>
                        Description
                    </th>
                    <th>
                        Date
                    </th>
                    <th>
                        Actions
                    </th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item, index) in templates" :key="item.id" :id="item.id">
                    <td>
                        {{index + 1}}
                    </td>
                    <td>
                        {{item.user_id}}
                    </td>
                    <td>
                        {{item.description}}
                    </td>
                    <td>
                        {{item.created_at}}
                    </td>
                    <td>
                        <b-button size="sm" class="mx-1" @click="showPreview(item.title, item.body)">Show</b-button>
                        <b-button size="sm" class="mx-1" variant="danger" @click="remove(item.id, index)">Remove</b-button>
                    </td>
                </tr>
                </tbody>
            </table>
            <div v-if="wentWrong" class="font-weight-bold text-center text-danger">
                Something went wrong... Try again or reload page.
            </div>
            <div v-else-if="loading"
                    class="row text-center justify-content-center my-2">
                <div class="spinner-grow " role="status">
                    <span class="sr-only"></span>
                </div>
                <div class="spinner-grow mx-2" role="status">
                    <span class="sr-only"></span>
                </div>
                <div class="spinner-grow " role="status">
                    <span class="sr-only"></span>
                </div>
            </div>
        </div>
        <b-modal id="preview-modal" size="lg" title="Preview" hide-footer centered>
            <div>
                <strong>
                    Title:
                </strong>
            </div>
            <div class="py-4" style="padding-left: 15px; padding-right: 15px;">
                {{previewTitle}}
            </div>
            <div>
                <strong>
                    Body:
                </strong>
            </div>
            <p class="my-4 ql-editor" v-html="previewBody"></p>
            <b-button class="mt-3" block @click="$bvModal.hide('preview-modal')">Close</b-button>
        </b-modal>
    </div>
</template>

<script>
import axios from 'axios';

  export default {
    name: 'Notifications',
    props: {
      user: Object,
    },
    components: {
    },
    data() {
      return {
        templates: [],
        wentWrong: false,
        loading: true,
        previewBody: '',
        previewTitle: '',
      };
    },
    mounted() {
      this.getTemplates();
    },
    methods: {
      showPreview(title, body) {
        this.previewBody = body;
        this.previewTitle = title;
        this.$bvModal.show('preview-modal');
      },
      async getTemplates() {
        this.loading = true;
        this.templates = [];
        const url = this.switchLiveUrlsToNeo('//www.delfi.lv/delfi-plus/notificationsAxios.php');
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
            this.loading = false;
            console.log('template respnse', response);
            if (response.data.length > 0) {
              this.templates = response.data;
            }
          },
          (error) => {
            this.loading = false;
            this.wentWrong = true;
            console.log('getInfoAboutNotificationGroups error', error);
          }
        );
      },
      async remove(id, index) {
        const url = this.switchLiveUrlsToNeo('//www.delfi.lv/delfi-plus/notificationsAxios.php');
        await axios({
          url,
          method: 'post',
          data: JSON.stringify({
            action: 'DELETE',
            subject: 'templates',
            id: id,
          }),
        }).then(
          (response) => {
            this.templates.splice(index, 1);
            console.log('remove template respnse', response);
          },
          (error) => {
            console.log('remove template error', error);
          }
        );
      },
    },
  };
</script>


<style lang="scss">
    .ql-editor img {
        max-width: 100%;
    }
</style>
