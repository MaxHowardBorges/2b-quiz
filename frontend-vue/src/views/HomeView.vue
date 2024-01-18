<template>
  <error-dialog
    ref="sessionErrorDialog"
    :content="sessionErrorContent"
    :title="sessionErrorTitle"></error-dialog>
  <login-block
    v-if="!userStore.isAuthenticated"
    :expiredError="expiredError"
    :serverError="serverError"
    :ticket="ticket" />
  <div
    v-if="userStore.isAuthenticated"
    class="h-100 d-flex align-center justify-center ma-2">
    <join-form v-if="userStore.isStudent" />
    <new-user-block v-if="userStore.isNotChoose" />
    <menu-teacher
      v-if="userStore.isTeacher"
      :error-snackbar="errorSnackbar"
      :dialog-error="serverError" />
    <admin-block v-if="userStore.isAdmin" />
  </div>
</template>

<script>
  import JoinForm from '@/components/session/JoinForm.vue';
  import { useUserStore } from '@/stores/userStore';
  import NewUserBlock from '@/components/user/NewUserBlock.vue';
  import LoginBlock from '@/components/user/LoginBlock.vue';
  import MenuTeacher from '@/components/home/MenuTeacherBlock.vue';
  import AdminBlock from '@/components/admin/AdminBlock.vue';
  import ErrorDialog from '@/components/commun/ErrorDialog.vue';

  export default {
    name: 'HomeView',
    components: {
      ErrorDialog,
      AdminBlock,
      MenuTeacher,
      LoginBlock,
      NewUserBlock,
      JoinForm,
    },
    props: {
      sessionError: null,
      errorSnackbar: null,
      expiredError: Boolean,
      serverError: Boolean,
      ticket: null,
    },
    setup() {
      const userStore = useUserStore();
      return {
        userStore,
      };
    },
    data() {
      return {
        sessionErrorTitle: 'sessionErrorTitle',
        sessionErrorContent: 'sessionErrorContent',
      };
    },
    mounted() {
      if (this.sessionError) {
        this.sessionErrorTitle = 'Error in the session';
        this.sessionErrorContent =
          'The following error occurred in the session:' +
          this.sessionError +
          '.\nPlease retry later.';
        this.$refs.sessionErrorDialog.dialogError = true;
      }
    },
  };
</script>
