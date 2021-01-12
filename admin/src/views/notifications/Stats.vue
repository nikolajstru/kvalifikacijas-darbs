<template>
    <div>
        <div class="d-flex align-self-center mb-3">
            <h2 class="my-auto d-inline">
                Notification statistics
            </h2>
            <button type="button" class="btn btn-primary rounded-pill ml-auto" @click="$router.push({name: 'createNotification'})">Create notification</button>
        </div>
        <div class="text-left pb-3">
            <div class="form-check">
                <input type="checkbox"
                       class="form-check-input"
                       id="cronStats"
                       v-model="hideCronStats"
                       @change="getLogData">
                <label class="form-check-label" for="cronStats">
                    Hide cron stats
                </label>
            </div>
        </div>
        <div class="row">
            <!--limit-->
            <div class="col-6">
                <div class="dataTables_length" id="tableLimit">
                    <label>
                        Show
                        <select aria-controls="tableLimit"
                                v-model.number="filter.limit"
                                @change="getLogData">
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                            <option value="200">200</option>
                            <option value="300">300</option>
                            <option value="400">400</option>
                            <option value="500">500</option>
                            <option value="1000">1'000</option>
                            <option value="2000">2'000</option>
                            <option value="3000">3'000</option>
                            <option value="4000">4'000</option>
                            <option value="5000">5'000</option>
                            <option value="10000">10'000</option>
                        </select>
                        entries
                    </label>
                </div>
            </div>
            <!--table info-->
            <div class="col-6">
                <div class="dataTables_length text-right" id="tableLength">
                    <strong>{{totalRowCount}}</strong> rows in the table
                </div>
            </div>
        </div>
        <div  v-if="logs.length  > 0">
            <b-pagination
                    v-model="currentPage"
                    :total-rows="totalRowCount"
                    :per-page="filter.limit"
                    align="center"
                    first-number
                    last-number
            ></b-pagination>
        </div>
        <div class="overflow-auto">
            <table class="table table-hover">
                <thead>
                <tr>
                    <th>
                        ID
                    </th>
                    <th>
                        Sender
                    </th>
                    <th>
                        Product
                    </th>
                    <th>
                        Title
                    </th>
                    <th>
                        Text
                    </th>
                    <th>
                        Date
                    </th>
                    <th>
                        Read / Sent
                    </th><th>
                    Rate
                </th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in notificationGroups" :key="item.uid" :id="item.uid">
                    <td>
                        {{item.uid}}
                    </td>
                    <td>
                        {{item.createdBy}}
                    </td>
                    <td>
                        <i v-if="item.product === 'MVP'"
                           class="m-auto msg-mvp-logo"></i>
                        <i v-else-if="item.product === 'DELFI'"
                           class="m-auto msg-delfi-plus-logo"></i>
                    </td>
                    <td>
                        {{item.title}}
                    </td>
                    <td>
                        <b-button pill @click="showPreview(item.title, item.text)">Show Body</b-button>
                    </td>
                    <td>
                        {{item.created}}
                    </td>
                    <td>
                         {{item.readCount}} / {{item.sentCount}}
                    </td>
                    <td>
                        {{Math.round((item.readCount * 100) / item.sentCount)}}%
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
            <div v-else-if="notificationGroups.length <= 0" class="text-center text-muted">
                <div>
                    <img src="//g.delfi.lv/delfi-plus/icons/no-data.svg" alt="No data">
                </div>
                No data
            </div>
        </div>
        <b-pagination
                v-model="currentPage"
                :total-rows="totalRowCount"
                :per-page="filter.limit"
                align="center"
                class="mt-5"
                first-number
                last-number
        ></b-pagination>
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
import format from 'date-fns/format';
import logProcessing from '../../graphql/notification/logProcessingQuery.graphql';

  export default {
    name: 'Notifications',
    props: {
      user: Object,
    },
    components: {
    },
    data() {
      return {
        notificationGroups: [],
        notificationGroupsInfo: {},
        logs: [],
        wentWrong: false,
        previewTitle: '',
        previewBody: '',
        loading: true,
        totalRowCount: 0,
        currentPage: 1,
        filter: {
          limit: 25,
          offset: 0,
          orderBy: null,
          order: null,
        },
        hideCronStats: true,
      };
    },
    mounted() {
      this.getLogData();
    },
    methods: {
      getLogData() {
        this.loading = true;
        this.logs = [];
        this.notificationGroups = [];
        this.getSentNotifications().then(() => {
          this.getInfoAboutNotificationGroups().then(() => {
            this.logs.forEach((log) => {
              if (log.content !== null && log.content.uid && log.content.sentCount){
                this.notificationGroups.push({
                  uid: log.content.uid,
                  product: log.content.product,
                  title: log.content.title,
                  text: log.content.text,
                  createdBy: log.createdBy,
                  created: format(
                    new Date(`${log.created}`),
                    'DD.MM.YYYY HH:mm'
                  ),
                  sentCount: Number(log.content.sentCount),
                  readCount:  (Number(this.notificationGroupsInfo[log.content.uid]))? Number(this.notificationGroupsInfo[log.content.uid]) : 0
                });
              }
            });
          });
        });
      },
      showPreview(title, body) {
        this.previewBody = body;
        this.previewTitle = title;
        this.$bvModal.show('preview-modal');
      },
      async getSentNotifications() {
        const headers = {};
        headers.Authorization = `Bearer ${this.user.loginApiToken}`;
        await axios({
          headers,
          url: '//api.delfi.lv/payment-processing/v1/graphql',
          method: 'post',
          data: {
            query: logProcessing,
            variables: JSON.stringify({
              process: 'GET',
              order: 'DESC',
              action: 'sendNotification',
              limit: this.filter.limit,
              offset: this.filter.offset,
              ignoreCronCapturedLogs: this.hideCronStats,
            }),
          },
        }).then(
          (response) => {
            this.loading = false;
            if (response.data.data.logProcessing.response.status === 'ok' && response.data.data.logProcessing.logs.length > 0) {
              this.logs = response.data.data.logProcessing.logs;
              console.log('this.logs', this.logs);
              this.totalRowCount = response.data.data.logProcessing.pager.count;
            }
          },
          (error) => {
            this.loading = false;
            console.log('getSentNotifications error', error);
            this.wentWrong = true;
          }
        );
      },
      async getInfoAboutNotificationGroups() {
        let qs = require('qs');
        await axios({
          url: this.switchLiveUrlsToNeo('//www.delfi.lv/delfi-plus/notifications.php'),
          method: 'post',
          data: qs.stringify({ 'action': 'GET', 'subject': 'stats' })
        }).then(
          (response) => {
            console.log('getInfoAboutNotificationGroups response', response);
            if (response.data.length > 0) {
              response.data.forEach((item) => {
                if (item.notification_group_id !== 'null') {
                  this.notificationGroupsInfo[item.notification_group_id] = item.count;
                }
              })
            }
            console.log('notificationGroupsInfo', this.notificationGroupsInfo);
          },
          (error) => {
            console.log('getInfoAboutNotificationGroups error', error);
          }
        );
      },
    },
    watch: {
      currentPage() {
        this.filter.offset = (this.currentPage - 1) * this.filter.limit;
        this.getLogData();
      },
    },
  };
</script>


<style lang="scss">
    .ql-editor img {
        max-width: 100%;
    }
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
