<template>
  <thead>
    <tr>
      <template v-if="isDeletedUsers">
        <admin-table-header-item
          v-for="column in columns2"
          :column-label="column.label"
          :ref="column.id"
          @update-sorted="(value) => saveValue(column.id, value)" />
      </template>
      <template v-else>
        <admin-table-header-item
          v-for="column in columns1"
          :column-label="column.label"
          :column-icon="column.icon"
          :ref="column.id"
          @update-sorted="(value) => saveValue(column.id, value)" />
      </template>
    </tr>
  </thead>
</template>

<script>
  import TableSortSwitchButton from '@/components/commun/TableSortSwitchButton.vue';
  import AdminTableHeaderItem from '@/components/admin/AdminTableHeaderItem.vue';

  export default {
    name: 'AdminTableHeaderBlock',
    components: { AdminTableHeaderItem, TableSortSwitchButton },
    props: {
      isDeletedUsers: false,
    },
    data: () => ({
      columns1: [
        { id: 'id', label: 'ID' },
        { id: 'username', label: 'Username' },
        { id: 'name', label: 'Name' },
        { id: 'surname', label: 'Surname' },
        { id: 'type', label: 'Type' },
        { id: 'askedDelete', label: 'Asked delete', icon: 'feedback' },
        { id: 'validate', label: 'Validated' },
      ],
      columns2: [
        { id: 'id', label: 'ID' },
        { id: 'username', label: 'Username' },
        { id: 'type', label: 'Type' },
        { id: 'validate', label: 'Validated' },
      ],
      sorting: {
        id: null,
        username: null,
        name: null,
        surname: null,
        type: null,
        validate: null,
      },
    }),
    methods: {
      saveValue(ref, value) {
        this.$refs[ref][0].$refs.switch.sorted = value;
        this.sorting[ref] = value;
        this.nullifyOtherSorting(ref);
        this.$emit('update-sorting', this.sorting);
      },
      nullifyOtherSorting(ref) {
        for (const key in this.sorting) {
          if (key !== ref) {
            this.sorting[key] = null;
            this.$refs[key][0].$refs.switch.sorted = null;
          }
        }
      },
    },
    emits: ['update-sorting'],
  };
</script>

<style scoped></style>
