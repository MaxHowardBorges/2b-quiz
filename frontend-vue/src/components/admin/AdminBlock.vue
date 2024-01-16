<template>
  <error-snackbar
    ref="errorSnackbar"
    :title="errorSnackbarTitle"
    :content="errorSnackbarContent"></error-snackbar>
  <v-dialog v-model="addUser" width="auto" :persistent="true">
    <v-card class="pa-5" min-width="40vw">
      <p class="text-h3 ma-2">{{ $t('admin.RegisterNew') }}</p>
      <register-form
        class="ma-2"
        @user-registered="userAdded"
        @error-register="errorRegister" />
      <v-btn @click="addUser = false">{{ this.$t('admin.close') }}</v-btn>
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
      <v-btn @click="addMoreUser = false">{{ $t('admin.close') }}</v-btn>
    </v-card>
  </v-dialog>
  <info-snackbar
    ref="infoSnackbar"
    :title="infoSnackbarTitle"
    :content="infoSnackbarContent"></info-snackbar>
  <v-sheet class="pa-5 d-block w-100" elevation="3" rounded="lg" id="app">
    <admin-table-block
      @add-multiple-user="addMoreUser = true"
      @add-user="addUser = true"
      @error-restore="errorRestore"
      @error-delete="errorDelete"
      @error-reject="errorReject" />
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
        this.infoSnackbarTitle = this.$t('admin.UserAdded');
        this.infoSnackbarContent = 'The '+this.$t('admin.UserAdded')+': '+`${value.username}`+' has been added';
        this.$refs.infoSnackbar.snackbarInfo = true;
      },
      userMoreAdded(value) {
        this.addMoreUser = false;
        this.infoSnackbarTitle = this.$t('admin.UserAdded');
        this.infoSnackbarContent = `${value.nbUsers}`+this.$t('admin.usersHBadded');
        this.$refs.infoSnackbar.snackbarInfo = true;
      },
      errorRegister(username) {
        this.errorSnackbarTitle = this.$t('admin.Error');
        this.errorSnackbarContent = this.$t('user.username')+`${username}`+this.$t('admin.alreadyExist');
        this.$refs.errorSnackbar.snackbarError = true;
      },
      errorRegisterMultiple(error) {
        this.errorSnackbarTitle = this.$t('admin.Error');
        this.errorSnackbarContent = this.$t('admin.ErrorWAUsers')+`${error}`;
        this.$refs.errorSnackbar.snackbarError = true;
      },
      errorRegisterMultipleDuplicate(usernames) {
        this.errorSnackbarTitle = this.$t('admin.Error');
        this.errorSnackbarContent = this.$t('admin.Usernames')+` ${usernames.toString()}` +this.$t('admin.AreTheSame');
        this.$refs.errorSnackbar.snackbarError = true;
      },
      errorRegisterMultipleUsed(usernames) {
        this.errorSnackbarTitle = this.$t('admin.Error');
        this.errorSnackbarContent = this.$t('admin.Usernames')+` ${usernames.toString()}` + this.$t('admin.alreadyTaken');
        this.$refs.errorSnackbar.snackbarError = true;
      },
      errorRestore(id) {
        this.errorSnackbarTitle = this.$t('admin.Error');
        this.errorSnackbarContent = this.$t('admin.ErrorRestoringUserId') + id + '.';
        this.$refs.errorSnackbar.snackbarError = true;
      },
      errorDelete(id) {
        this.errorSnackbarTitle = this.$t('admin.Error');
        this.errorSnackbarContent = this.$t('admin.ErrorDeletingUserId') + id + '.';
        this.$refs.errorSnackbar.snackbarError = true;
      },
      errorReject(id) {
        this.errorSnackbarTitle = this.$t('admin.Error');
        this.errorSnackbarContent =this.$t('admin.ErrorRejectingUserId') + id + this.$t('admin.DeleteRequest');
        this.$refs.errorSnackbar.snackbarError = true;
      },
    },
  };
</script>

<style scoped></style>
