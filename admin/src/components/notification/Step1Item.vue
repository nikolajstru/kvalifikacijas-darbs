<template>
    <fragment>
        <td style="width: 37px;">
            <div class="form-check">
                <input class="form-check-input"
                       type="checkbox"
                       :checked="selected[source.userId]"
                       @change="selectUser(source)">
            </div>
        </td>
        <td v-for="tableHeadElement in tableHeadElements"
            :key="tableHeadElement.key"
            class="table-cell"
            :class="tableHeadElement.key"
        >
            <span v-if="tableHeadElement.key === 'lastTimeLoggedIn' && source[tableHeadElement.key] !== null && typeof source[tableHeadElement.key] !== 'undefined'">
                {{source[tableHeadElement.key].slice(0,-9)}}
            </span>
            <span v-else>{{source[tableHeadElement.key]}}</span>
        </td>
    </fragment>
</template>

<script>
  import { Fragment } from 'vue-fragment'

  export default {
    name: 'item-component',
    components: { Fragment },
    props: {
      source: {
        type: Object,
        default () {
          return {}
        }
      },
      tableHeadElements: Array,
      selected: Object,
      selectUser: Function,
    },
  }
</script>
