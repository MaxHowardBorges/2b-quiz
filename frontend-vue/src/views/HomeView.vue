<template>
  <login-block
    v-if="!userStore.isAuthenticated"
    :expiredError="expiredError"
    :serverError="serverError"
    :ticket="ticket" />
  <div
    v-if="userStore.isAuthenticated"
    class="h-100 d-flex align-center justify-center ma-2">
    <join-form v-if="userStore.isStudent" />
    <v-btn
      @click="redirectToSessionHistory"
      color="primary"
      class="mx-6 my-3"
      max-width="250px">
      <p class="text-white font-weight-bold pa-2">Session history</p>
    </v-btn>
    <new-user-block v-if="userStore.isNotChoose" />
    <menu-teacher
      v-if="userStore.isTeacher"
      :error-snackbar="errorSnackbar"
      :dialog-error="serverError" />
    <admin-block v-if="userStore.isAdmin" />
  </div>
</template>

<script>
  import JoinForm from '@/components/home/JoinForm.vue';
  import { useUserStore } from '@/stores/userStore';
  import NewUserBlock from '@/components/user/NewUserBlock.vue';
  import LoginBlock from '@/components/user/LoginBlock.vue';
  import MenuTeacher from '@/components/home/MenuTeacherBlock.vue';
  import AdminBlock from '@/components/admin/AdminBlock.vue';
  import router from '@/router';

  export default {
    name: 'HomeView',
    components: { AdminBlock, MenuTeacher, LoginBlock, NewUserBlock, JoinForm },
    props: {
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
    methods: {
      redirectToSessionHistory() {
        router.push('/session-history');
      },
    },
  };
</script>

<style scoped></style>
