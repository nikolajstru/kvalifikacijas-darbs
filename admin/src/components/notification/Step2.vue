<template>
    <div>
        <div v-if="users.length > 0">
            <div class="form-group d-flex">
                <div>
                    <button class="btn btn-outline-secondary mr-3"
                            @click="clearAll">
                        <b-icon icon="table" aria-hidden="true"></b-icon>
                        Clear
                    </button>
                    <export-button className="btn btn-outline-info"
                                   :users="users"
                                   :tableHead="tableHead">
                        <b-icon icon="download" aria-hidden="true"></b-icon>
                        Export
                    </export-button>
                </div>
                <div class="ml-auto my-auto">
                    <strong>{{users.length}}</strong> users in the table
                </div>
            </div>
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
                            :extra-props="{tableHeadElements, removeUser }"
                    >
                        <tr slot="header">
                            <th scope="col" style="width: 77px;"></th>
                            <th v-for="value in tableHeadElements"
                                scope="col"
                                class="cursor-pointer"
                                :key="value.key"
                            >
                                {{value.text}}
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
</template>

<script>
import ExcelExport from './ExcelExport.vue'
import Item from './Step2Item'
import VirtualList from 'vue-virtual-scroll-list'

export default {
  name: 'SelectedUserTable',
  props: {
    removeSelectedUser: Function,
    selectedUsers: Object,
    tableHead: Array,
  },
  components: {
    'export-button': ExcelExport,
    'virtual-list': VirtualList
  },
  activated() {
    this.updateUserList();
  },
  computed: {
    tableHeadElements () {
      return this.tableHead.filter(item => {
        if (item.shown) {
          return item
        }
      });
    },
  },
  data() {
    return {
      itemComponent: Item,
      users: [],
    }
  },
  methods: {
    removeUser(id) {
      this.removeSelectedUser(id);
      this.updateUserList();
    },
    clearAll() {
      this.$emit('clearAll');
      this.users = [];
    },
    updateUserList() {
      this.users = [];
      for (const user in this.selectedUsers){
        this.users.push(this.selectedUsers[user]);
      }
    },
  },
};
</script>
