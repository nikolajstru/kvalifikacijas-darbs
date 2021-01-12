<template>
    <vue-excel-xlsx
            :class="className"
            :data="users"
            :columns="columns"
            :filename="'filename'"
            :sheetname="'sheetname'">
        <slot></slot>
    </vue-excel-xlsx>
</template>

<script>

export default {
  name: 'ExcelExport',
  props: {
    users: Array,
    tableHead: Array,
    className: String,
  },
  computed: {
    columns() {
      return this.tableHead.map(e => {
        return {
          label: e.text,
          field: e.key,
        }
      });
    },
  },
};
</script>
