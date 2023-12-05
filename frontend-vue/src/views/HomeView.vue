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
    <new-user-block v-if="userStore.isNotChoose" />
  </div>
</template>

<script>
  import JoinForm from '@/components/home/JoinForm.vue';
  import { useUserStore } from '@/stores/userStore';
  import NewUserBlock from '@/components/user/NewUserBlock.vue';
  import LoginBlock from '@/components/user/LoginBlock.vue';

  export default {
    name: 'HomeView',
    components: { LoginBlock, NewUserBlock, JoinForm },
    props: {
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
  };
</script>

<style scoped></style>
