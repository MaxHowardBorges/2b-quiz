<template>
  <error-snackbar
    ref="errorSnackbar"
    :title="errorSnackbarTitle"
    :content="errorSnackbarContent"></error-snackbar>
  <v-dialog v-model="addUser" width="auto" :persistent="true">
    <v-card class="pa-5" min-width="40vw">
      <p class="text-h3 ma-2">Register new user</p>
      <register-form
        class="ma-2"
        @user-registered="userAdded"
        @error-register="errorRegister" />
      <v-btn @click="addUser = false">Close</v-btn>
    </v-card>
  </v-dialog>
  <v-dialog v-model="addMoreUser" width="auto" :persistent="true">
    <v-card class="pa-1" min-width="40vw">
      <register-group-user
        class="ma-2 pa-4"
        @user-registered="userMoreAdded"
        @error-register-multiple="errorRegisterMultiple"
        @error-register-multiple-dulicate="errorRegisterMultipleDuplicate"
        @error-register-multiple-used="errorRegisterMultipleUsed" />
      <v-btn @click="addMoreUser = false">Close</v-btn>
    </v-card>
  </v-dialog>
  <info-snackbar
    ref="infoSnackbar"
    :title="infoSnackbarTitle"
    :content="infoSnackbarContent"></info-snackbar>
  <v-sheet class="pa-5 d-block w-100" elevation="3" rounded="lg" id="app">
    <admin-table-block
      @add-multiple-user="addMoreUser = true"
      @add-user="addUser = true" />
  </v-sheet>
</template>

<script>
  import RegisterGroupUser from '@/components/admin/registerMultipleUser/RegisterGroupUser.vue';
  import RegisterForm from '@/components/admin/RegisterForm.vue';
  import InfoSnackbar from '@/components/commun/InfoSnackbar.vue';
  import ErrorSnackbar from '@/components/commun/ErrorSnackbar.vue';
  import AdminTableBlock from '@/components/admin/AdminTableBlock.vue';
  import { ref } from 'vue';

  export default {
    name: 'AdminBlock',
    components: {
      AdminTableBlock,
      ErrorSnackbar,
      InfoSnackbar,
      RegisterForm,
      RegisterGroupUser,
    },
    data() {
      return {
        addUser: ref(false),
        addMoreUser: ref(false),
        infoSnackbarTitle: '',
        infoSnackbarContent: '',
        errorSnackbarTitle: '',
        errorSnackbarContent: '',
      };
    },
    methods: {
      userAdded(value) {
        this.addUser = false;
        this.infoSnackbarTitle = 'User added';
        this.infoSnackbarContent = `The ${value.accountType}: ${value.username} has been added`;
        this.$refs.infoSnackbar.snackbarInfo = true;
      },
      userMoreAdded(value) {
        this.addMoreUser = false;
        this.infoSnackbarTitle = 'Users added';
        this.infoSnackbarContent = `${value.nbUsers} users have been added`;
        this.$refs.infoSnackbar.snackbarInfo = true;
      },
      errorRegister(username) {
        this.errorSnackbarTitle = 'Error';
        this.errorSnackbarContent = `Username ${username} already exist`;
        this.$refs.errorSnackbar.snackbarError = true;
      },
      errorRegisterMultiple(error) {
        this.errorSnackbarTitle = 'Error';
        this.errorSnackbarContent = `Error while adding users: ${error}`;
        this.$refs.errorSnackbar.snackbarError = true;
      },
      errorRegisterMultipleDuplicate(usernames) {
        this.errorSnackbarTitle = 'Error';
        this.errorSnackbarContent = `Usernames ${usernames.toString()} are the same`;
        this.$refs.errorSnackbar.snackbarError = true;
      },
      errorRegisterMultipleUsed(usernames) {
        this.errorSnackbarTitle = 'Error';
        this.errorSnackbarContent = `Usernames ${usernames.toString()} already taken`;
        this.$refs.errorSnackbar.snackbarError = true;
      },
    },
  };
</script>

<style scoped></style>
