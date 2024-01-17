<template>
  <v-hover>
    <template v-slot:default="{ isHovering, props }">
      <th v-bind="props" :class="columnIcon ? 'minWidth' : ''" class="px-2">
        <template class="d-flex align-center justify-center">
          <template v-if="columnIcon">
            <td>
              <v-tooltip location="top" :text="$t('user.UserAskedDelete')">
                <template v-slot:activator="{ props }">
                  <v-icon v-bind="props">{{ columnIcon }}</v-icon>
                </template>
              </v-tooltip>
            </td>
          </template>
          <template
            v-else
            class="align-center justify-center center d-flex flex-row">
            {{ columnLabel }}
          </template>
          <table-sort-switch-button
            ref="switch"
            :isHovered="isHovering"
            @update-sorted="(value) => relayValue(value)" />
        </template>
      </th>
    </template>
  </v-hover>
</template>

<script>
  import TableSortSwitchButton from '@/components/commun/TableSortSwitchButton.vue';

  export default {
    name: 'AdminTableHeaderItem',
    components: { TableSortSwitchButton },
    props: {
      columnLabel: String,
      columnIcon: String,
    },
    methods: {
      relayValue(value) {
        this.$emit('update-sorted', value);
      },
    },
    emits: ['update-sorted'],
  };
</script>

<style scoped>
  th + th {
    border-left: 1px solid rgba(0, 0, 0, 0.12) !important;
  }
  .minWidth {
    width: 40px;
  }
</style>
