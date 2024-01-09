<template>

  <v-sheet max-width="450px"
       min-width="150px"
       class="pa-5 d-block w-100"
       elevation="3"
       rounded="lg"
       position="relative">
    <h2> Waiting for the questionnary launch... </h2>
  </v-sheet>



</template>

<script>

  import { useUserStore } from '@/stores/userStore';
  import { UserRoles } from '@/utils/userRoles';
  import router from '@/router';
  import { ValidationError } from '@/utils/valdiationError';

  export default {
    name: 'JoinForm',
    methods: {
      async handleJoinSession() {
        this.loading = true;
        try {
          const body = { idSession: this.idSession, username: this.username };
          //await this.sessionStore.joinSession(body);
          const userStore = useUserStore();
          userStore.setUserRoles(UserRoles.TEACHER);
          await router.push('/session');
        } catch (error) {
          console.error(error)
        }
        this.loading = false;
      },
    },
  }

</script>

<style scoped>

</style>