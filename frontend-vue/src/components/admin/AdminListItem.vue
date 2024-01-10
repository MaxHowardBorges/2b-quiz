<template>
  <tr
    :class="
      user.validate
        ? user.askedDelete
          ? 'bg-red-lighten-3'
          : 'bg-green-lighten-4'
        : 'bg-amber-lighten-4'
    ">
    <td class="">{{ user.id }}</td>
    <td>{{ user.username }}</td>
    <td v-if="!isDeletedUsers">{{ user.name }}</td>
    <td v-if="!isDeletedUsers">{{ user.surname }}</td>
    <td>{{ user.userType }}</td>
    <td v-if="!isDeletedUsers">
      <template v-if="user.askedDelete">
        <v-tooltip
          location="start"
          text="This user asked to delete his account">
          <template v-slot:activator="{ props }">
            <v-icon v-bind="props">info</v-icon>
          </template>
        </v-tooltip>
      </template>
    </td>
    <td class="pa-2">
      <div v-if="isDeletedUsers">
        <v-btn
          class="mr-2"
          variant="outlined"
          density="comfortable"
          icon="settings_backup_restore"
          @click="restoreUser"></v-btn>
        <v-btn
          variant="outlined"
          density="comfortable"
          icon="delete"
          @click="removeUser"></v-btn>
      </div>
      <div v-else>
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
        <div v-else>
          <v-icon class="mr-4">check</v-icon>
          <v-btn
            variant="outlined"
            density="comfortable"
            icon="delete"
            @click="softDeleteUser"></v-btn>
        </div>
      </div>
    </td>
  </tr>
</template>

<script>
  export default {
    name: 'AdminListItem',
    props: {
      user: null,
      isDeletedUsers: false,
    },
    methods: {
      validateUser() {
        this.$emit('validate-user', this.user.id);
      },
      removeUser() {
        this.$emit('remove-user', this.user.id);
      },
      softDeleteUser() {
        this.$emit('soft-delete-user', this.user.id);
      },
      restoreUser() {
        this.$emit('restore-user', this.user.id);
      },
    },
    emits: ['validate-user', 'remove-user', 'soft-delete-user', 'restore-user'],
  };
</script>

<style scoped>
  td + td {
    border-left: 1px solid rgba(0, 0, 0, 0.12) !important;
  }
</style>
