<template>
    <div>
        <div class="row">
            <!--clear filter-->
            <div class="col-12">
                <div class="text-right">
                    <u>
                        <span class="cursor-pointer" @click="clearFilter">Clear filter</span>
                    </u>
                </div>
            </div>
            <!--userId-->
            <div class="form-group col-12">
                <label for="searchByUser">User ID</label>
                <b-form-tags
                        id="searchByUser"
                        input-id="searchByUser"
                        v-model="filter.userId"
                        separator=" ,;"
                        remove-on-delete
                        placeholder="Enter new user ID separated by space, comma or semicolon"
                        class="mb-2"
                ></b-form-tags>
            </div>
            <!--firstName-->
            <div class="form-group col-3">
                <label for="searchByFirstName">First name</label>
                <input type="text"
                       class="form-control  form-control-sm"
                       id="searchByFirstName"
                       v-model="filter.firstName">
            </div>
            <!--lastName-->
            <div class="form-group col-3">
                <label for="searchByLastName">Last name</label>
                <input type="text"
                       class="form-control  form-control-sm"
                       id="searchByLastName"
                       v-model="filter.lastName">
            </div>
            <!--email-->
            <div class="form-group col-3">
                <label for="searchByEmail">Email</label>
                <input type="email"
                       class="form-control  form-control-sm"
                       id="searchByEmail"
                       v-model="filter.email">
            </div>
            <!--phone-->
            <div class="form-group col-3">
                <label for="searchByPhone">Phone</label>
                <input type="text"
                       class="form-control  form-control-sm"
                       id="searchByPhone"
                       v-model="filter.phone">
            </div>
        </div>
        <!--hide columns-->
        <div class="row mb-3">
            <div class="col-12">
                Necessary user data
                <b-icon id="necessary-data-info" icon="question-circle" aria-hidden="true"></b-icon>
                <b-tooltip target="necessary-data-info" triggers="hover">
                    Less data - faster search!
                </b-tooltip>
                <div class="d-flex">
                    <button class="btn btn-sm btn-outline-primary ml-auto"
                            @click="selectAllUserData">
                        Select all
                    </button>
                </div>
            </div>
            <div v-for="item in tableHead" :key="item.key" class="col-3">
                <div class="form-check">
                    <input type="checkbox"
                           class="form-check-input"
                           :id="item.key"
                           :disabled="item.required"
                           v-model="item.shown">
                    <label class="form-check-label" :for="item.key">
                        {{item.text}}
                    </label>
                </div>
            </div>
        </div>
        <!--search button-->
        <div class="row">
            <div class="form-group col-12 text-center">
                <button class="btn btn-primary"
                        @click="search">
                    Search
                </button>
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
                                @change="search">
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
                    <strong>{{totalUserCount}}</strong> rows in the table
                </div>
            </div>
        </div>
        <!--table-->
        <div style="overflow-x: scroll;">
            <div v-if="wentWrong" class="font-weight-bold text-center text-danger">
                Something went wrong... Try again or reload page.
            </div>
            <div v-else-if="searching" class="font-italic text-center text-muted py-5">
                <div class="d-flex justify-content-center my-5 py-5">
                    <div class="spinner-border" role="status">
                        <span class="sr-only">Loading...</span>
                    </div>
                </div>
            </div>
            <div v-else-if="Object.keys(users).length > 0" >
                <b-pagination
                        v-model="currentPage"
                        :total-rows="totalUserCount"
                        :per-page="filter.limit"
                        align="center"
                        first-number
                        last-number
                ></b-pagination>
                <div class="overflow-auto table-container">
                    <table class="table table-hover">
                        <virtual-list
                                :data-key="'userId'"
                                :data-sources="users"
                                :data-component="itemComponent"
                                :estimate-size="50"
                                root-tag="div"
                                class="virtual-list-table b-table table-striped table-hover"
                                wrap-tag="tbody"
                                item-tag="tr"
                                header-tag="thead"
                                :extra-props="{selected, tableHeadElements, selectUser }"
                        >
                            <tr slot="header">
                                <th scope="col" style="width: 37px;">
                                    <div class="form-check">
                                        <input class="form-check-input"
                                               type="checkbox"
                                               id="allUserSelect"
                                               :indeterminate.prop="usersSelected.some"
                                               :checked="usersSelected.all"
                                               @click="selectUserList">
                                        <label class="form-check-label" for="allUserSelect">
                                        </label>
                                    </div>
                                </th>
                                <th v-for="value in tableHeadElements"
                                    scope="col"
                                    class="cursor-pointer"
                                    @click="orderBy(value.key)"
                                    :key="value.key"
                                >
                                    {{value.text}}
                                    <span v-if="filter.orderBy === value.key">
                                        <i class="text-size-3 pl-1 position-absolute"
                                           :class="{
                                                'icon-arrows-thin-top': filter.order === 'DESC',
                                                'icon-arrows-thin-bottom': filter.order === 'ASC'
                                           }">
                                        </i>
                                    </span>
                                </th>
                            </tr>
                        </virtual-list>
                    </table>
                </div>
            </div>
            <div v-else class="text-center text-muted">
                <div>
                    <img src="https://g.delfi.lv/delfi-plus/icons/no-data.svg" alt="No data">
                </div>
                No data
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import format from 'date-fns/format'
import getUsers from '../../graphql/notification/getUsers.graphql'
import logProcessing from '../../graphql/notification/logProcessingMutation.graphql'
import Item from './Step1Item'
import VirtualList from 'vue-virtual-scroll-list'

export default {
  name: 'UserCriteriaTable',
  props: {
    selectedUsers: Object,
    loginApiToken: String,
    removeSelectedUser: Function,
    user: Object,
  },
  components: {
    'virtual-list': VirtualList
  },
  data() {
    return {
      itemComponent: Item,
      users: [],
      selected: {},
      usersSelected: {
        all: false,
        some: false,
      },
      minDate: null,
      maxDate: null,
      textForPredefinedField: '',
      currentPage: 1,
      filter: {
        limit: 100,
        offset: 0,
        orderBy: null,
        order: null,
        product: ['DELFIPLUS'],
        userId: [],
        firstName: null,
        lastName: null,
        email: null,
        phone: null,
      },
      order: {
        by: null,
        sequence: {
          asc: 'ASC',
          desc: 'DESC',
        },
      },
      getUsersResponse: {},
      searching: true,
      wentWrong: false,
      tableHead: [
        {
          key: 'userId',
          text: 'User ID',
          shown: true,
          required: true,
        },
        {
          key: 'email',
          text: 'Email',
          shown: false,
        },
        {
          key: 'phone',
          text: 'Phone',
          shown: false,
        },
        {
          key: 'firstName',
          text: 'First name',
          shown: false,
        },
        {
          key: 'lastName',
          text: 'Last name',
          shown: false,
        },
        {
          key: 'lastTimeLoggedIn',
          text: 'lastTimeLoggedIn',
          shown: false,
        },
      ],
      totalUserCount: 0,
    };
  },
  activated() {
    /*
      On  component activation:
        1. Update selected users list by passing new data from parent component
        2. Run "checkbox checker"
    */
    this.selected = this.selectedUsers;
    this.checkCheckbox();
  },
  deactivated() {
    /*
      On  component deactivation trigger events:
        1. Update selected users list
        2. Update collectable data
    */
    this.$emit('setSelectedUsers', this.selected);
    this.$emit('setTableHead', this.tableHeadElements);
  },
  created() {
    /*
      On  component initial load automatically run user search method
    */
    this.search();
  },
  computed: {
    tableHeadElements () {
      return this.tableHead.filter(item => {
        if (item.shown || item.required) {
          return item
        }
      });
    },
    /*
      Dynamically created query for request to avoid redundant data ir response
    */
    getUsersQuery() {
      let chosenSelectData = [];
      for (const item of this.tableHead) {
        if (item.shown) {
          chosenSelectData.push(item.key);
        }
      }
      return `
        query (
            $limit: Int
            $offset: Int
            $orderBy: UserAndProductFields
            $order: OrderAscDsc
            $product: [String]!
            $userId: [Int]
            $firstName: String
            $lastName: String
            $email: String
            $phone: String
        ){
            getUsers(
                input: {
                    limit: $limit
                    offset: $offset
                    orderBy: $orderBy
                    order: $order
                    product: $product
                    userId: $userId
                    firstName: $firstName
                    lastName: $lastName
                    email: $email
                    phone: $phone
                }
            ) {
                users {
                    userId
                    ${chosenSelectData.join("\r\n")}
                }
                response{
                    status
                    message
                    error{
                        message
                        origin
                    }
                }
                pager{
                    count
                    limit
                    offset
                }
            }
        }
      `;
    },
  },
  watch: {
    /*
      Watch for currentPage variable to update table content on every new page of pagination
    */
    currentPage() {
      this.filter.offset = (this.currentPage - 1) * this.filter.limit;
      this.search();
    },
  },
  methods: {
    selectAllUserData() {
      for (const key in this.tableHead) {
        this.tableHead[key].shown = true;
      }
    },
    selectUser(user) {
      if (this.selected[user.userId]) {
        delete this.selected[user.userId];
      } else {
        this.selected[user.userId] = user;
      }
      this.checkCheckbox();
    },
    reset() {
      /*
        Reset all searching field and auto-run user searching method
      */
      this.clearFilter();
      this.search();
    },
    checkCheckbox() {
      /*
        Go through all users in table and check their checkbox.
        If user is selected => fill checkbox
      */
      if (Object.keys(this.selected).length > 0) {
        let inTableFound = 0;
        this.users.forEach((user) => {
          if (this.selected[user.userId]) {
            inTableFound += 1;
          }
        });
        if (inTableFound === 0) {
          this.usersSelected.all = false;
          this.usersSelected.some = false;
        } else if (inTableFound === this.users.length) {
          this.usersSelected.all = true;
          this.usersSelected.some = false;
        } else {
          this.usersSelected.all = false;
          this.usersSelected.some = true;
        }
      } else {
        this.usersSelected.all = false;
        this.usersSelected.some = false;
      }
    },
    orderBy(item) {
      /*
       Change order field and direction
      */
      if (this.filter.orderBy !== item) {
        this.filter.order = this.order.sequence.asc;
        this.filter.orderBy = item;
      } else if (this.filter.orderBy === item) {
        if (this.filter.order === this.order.sequence.asc) {
          this.filter.order = this.order.sequence.desc;
          this.filter.orderBy = item;
        } else {
          this.filter.orderBy = null;
          this.filter.order = null;
        }
      }
      this.search();
    },
    search() {
      this.wentWrong = false; // hide error messages before each searching processes
      this.searching = true; // show  progress bar before each searching processes
      if (this.checkValidation()) {
        this.getUsers().then(() => {
          this.searching = false;
          if (!this.wentWrong) {
            this.users = this.getUsersResponse.data.data.getUsers.users;
            this.totalUserCount = this.getUsersResponse.data.data.getUsers.pager.count;
            this.checkCheckbox();
          }
        });
      } else {
        this.searching = false;
      }
    },
    async getUsers() {
      const variables = {};
      Object.keys(this.filter).forEach((key) => {
        if (
          this.filter[key] !== ''
          && this.filter[key] !== '-'
          && this.filter[key] !== null
          && this.filter[key] !== 'null'
          &&  key !== 'userId'
        ) {
          variables[key] = this.filter[key];
        } else if (key === 'userId') {
          let userIds = [];
          this.filter[key].forEach((item) => {
            if (Number(item) == item) {
              userIds.push(Number(item));
            }
          });
          if (userIds.length > 0) {
            variables[key] = userIds;
          }
        }
      });
      const headers = {};
      headers.Authorization = `Bearer ${this.user.loginApiToken}`;
      await axios({
        headers,
        url: 'https://api.delfi.lv/payment-processing/v1/graphql',
        method: 'post',
        data: {
          query: this.getUsersQuery,
          variables,
        },
      }).then(
        (response) => {
          if ((typeof response.data.errors !== 'undefined' && response.data.errors.length > 0) || response.data.data.getUsers.response.status === 'failed') {
            this.wentWrong = true;
          } else {
            this.getUsersResponse = response;
          }
        },
        (error) => {
          this.wentWrong = true;
          console.log('getUsers error', error);
        }
      );
    },
    selectUserList() {
      this.searching = true;
      const self = this;
      setTimeout(function(){
        self.updateUserList();
      }, 1);
    },
    updateUserList() {
      if (this.usersSelected.all) {
        this.users.forEach((user) => {
          delete this.selected[user.userId];
        });
      } else {
        this.users.forEach((user) => {
          this.selected[user.userId] = user;
        });
      }
      this.checkCheckbox();
      this.searching = false;
    },
    clearFilter() {
      Object.keys(this.filter).forEach((key) => {
        if (key === 'limit') {
          this.filter[key] = 100;
        } else if (key === 'userId') {
          this.filter[key] = [];
        } else if (key === 'subscriptionValidFrom' || key === 'subscriptionValidTo') {
          this.filter[key] = null;
        } else if (key === 'product') {
          this.filter[key] = ['DELFIPLUS'];
        } else {
          this.filter[key] = '';
        }
      });
    },
  },
};
</script>

<style scoped>
    .table-hover th:hover {
        background-color: #f9f9f9;
    }
    .table-container {
        position: relative;
        box-shadow: inset 0 -9px 9px -7px rgba(0,0,0,0.7);
    }
</style>

