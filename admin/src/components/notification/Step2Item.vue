<template>
    <fragment>
        <td style="width: 77px;">
            <button class="btn btn-sm btn-outline-danger px-2 py-0"
                    @click="removeUser(source.userId)">
                <b-icon icon="trash"></b-icon>
            </button>
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
      removeUser: Function,
    },
  }
</script>
