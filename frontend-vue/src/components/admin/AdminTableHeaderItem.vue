<template>
  <v-hover>
    <template v-slot:default="{ isHovering, props }">
      <th v-bind="props">
        {{ columnLabel }}
        <table-sort-switch-button
          ref="switch"
          :isHovered="isHovering"
          @update-sorted="(value) => relayValue(value)" />
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
    },
    methods: {
      relayValue(value) {
        this.$emit('update-sorted', value);
      },
    },
    emits: ['update-sorted'],
  };
</script>

<style scoped></style>
