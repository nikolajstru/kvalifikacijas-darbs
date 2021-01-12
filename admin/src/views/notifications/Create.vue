<template>
    <div>
        <h2 class="mb-3">
            New notification
        </h2>
        <div>
            <b-card title="Card Title" no-body>
                <b-card-header header-tag="nav">
                    <b-nav card-header tabs>
                        <b-nav-item v-for="item  in navComponents"
                                    v-bind:key="item.component"
                                    :disabled="item.disabled"
                                    @click="activeComponent = item.component"
                                    :active="item.component === activeComponent">
                            {{item.name}}
                        </b-nav-item>
                    </b-nav>
                </b-card-header>

                <b-card-body>
                    <keep-alive>
                        <component
                                ref="components"
                                :is="activeComponent"
                                :selectedUsers="selectedUsers"
                                @setSelectedUsers="setSelectedUsers"
                                @setTableHead="setTableHead"
                                @notificationSent="notificationSent"
                                @clearAll="clearAll"
                                @reset="reset"
                                :removeSelectedUser="removeSelectedUser"
                                :user="user"
                                :tableHead="tableHead"
                        ></component>
                    </keep-alive>
                </b-card-body>
            </b-card>
        </div>
    </div>
</template>

<script>
import Step1 from '../../components/notification/Step1.vue';
import Step2 from '../../components/notification/Step2.vue';
import Step3 from '../../components/notification/Step3.vue';

export default {
  name: 'CreateNotifications',
  props: {
    user: Object,
  },
  components: {
    Step1,
    Step2,
    Step3,
  },
  data() {
    return {
      navComponents: [
        {
          name: 'Select users',
          component: 'Step1',
          disabled: false,
        },
        {
          name: 'Check users',
          component: 'Step2',
          disabled: false,
        },
        {
          name: 'Send notification',
          component: 'Step3',
          disabled: false,
        },
      ],
      activeComponent: 'Step1',
      selectedUsers: {},
      tableHead: [],
    };
  },
  methods: {
    notificationSent() {
      this.navComponents[0].disabled = true;
      this.navComponents[1].disabled = true;
    },
    reset() {
      this.activeComponent = 'Step1';
      this.navComponents[0].disabled = false;
      this.navComponents[1].disabled = false;
      this.selectedUsers = {};
      const self = this;
      setTimeout(function(){
        self.$refs.components.reset();
      }, 100);
    },
    setSelectedUsers(users) {
      this.selectedUsers = users;
    },
    clearAll() {
      this.selectedUsers = {};
    },
    setTableHead(value) {
      this.tableHead = value;
    },
    removeSelectedUser(id) {
      delete this.selectedUsers[id];
    },
  },
};
</script>

<style lang="scss">
    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s;
    }
    .fade-enter, .fade-leave-to {
        opacity: 0;
    }
    .table-cell-head:hover{
        background-color: #f9f9f9;
        cursor: pointer;
    }
    .table{
        display: table!important;
        min-width: 100%;

    }
    .table-row {
        display: table-row;
    }
    .table-cell {
        display: table-cell;
        padding: 10px;
        border-bottom: 1px solid rgb(222, 226, 230);
    }
    .table .table-row:hover{
        background-color: rgba(0,0,0,.075);
    }
</style>
