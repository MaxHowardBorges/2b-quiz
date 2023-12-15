<template>
  <tr :class="user.validate ? 'bg-green-lighten-4' : 'bg-amber-lighten-4'">
    <td class="">{{ user.id }}</td>
    <td>{{ user.username }}</td>
    <td>{{ user.name }}</td>
    <td>{{ user.surname }}</td>
    <td>{{ user.userType }}</td>
    <td class="pa-2">
      <div v-if="!user.validate">
        <v-btn
          class="mr-2"
          variant="outlined"
          density="comfortable"
          icon="check"
          @click="validateUser"></v-btn>
        <v-btn
          variant="outlined"
          density="comfortable"
          icon="delete"
          @click="removeUser"></v-btn>
      </div>
      <v-icon v-else>check</v-icon>
    </td>
  </tr>
</template>

<script>
  import TableSortSwitchButton from '@/components/commun/TableSortSwitchButton.vue';

  export default {
    name: 'AdminListItem',
    components: { TableSortSwitchButton },
    props: {
      user: null,
    },
    methods: {
      validateUser() {
        this.$emit('validate-user', this.user.id);
      },
      removeUser() {
        this.$emit('remove-user', this.user.id);
      },
    },
  };
</script>

<style scoped></style>
