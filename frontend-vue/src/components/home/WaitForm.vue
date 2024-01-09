<template>

  <v-sheet max-width="450px"
       min-width="150px"
       class="pa-5 d-block w-100"
       elevation="3"
       rounded="lg"
       position="relative">
    <h2 v-if='waiting' > Waiting for the questionnary launch... </h2>
    <v-btn @click='handleJoinSession'>okk</v-btn>
  </v-sheet>



</template>

<script>

  import { useUserStore } from '@/stores/userStore';
  import { useSessionStore } from '@/stores/sessionStore';
  import { UserRoles } from '@/utils/userRoles';
  import router from '@/router';
  import { ref } from 'vue';

  export default {
    name: 'waitForm',
    setup: () => {
      const sessionStore = useSessionStore();
      return {
        sessionStore,
      };
    },
    methods: {
      async handleJoinSession() {
        console.log(this.sessionStore.start);
        if(!this.sessionStore.start) {
          this.loading = true;
          try {
            //const body = { idSession: this.idSession, username: this.username };
            //await this.sessionStore.joinSession(body);
            const userStore = useUserStore();
            userStore.setUserRoles(UserRoles.TEACHER);
            //await router.push('/session');
            console.log("ok");
            await this.$router.push({ path: '/session', query: { key: 'display' } });
            console.log("okk");
          } catch (error) {
            console.error(error)
          }
          this.loading = false;
          this.waiting = false;
        }
      },
    },
    data() {
      return {
        waiting: ref(true),
      }
    },
  }

</script>

<style scoped>

</style>