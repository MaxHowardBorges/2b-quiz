<template>

  <v-sheet max-width="450px"
       min-width="150px"
       class="pa-5 d-block w-100"
       elevation="3"
       rounded="lg"
       position="relative">
    <h2 > Waiting for the questionnary launch... </h2>
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
        loading: ref(false),
        waiting: ref(true),
      };
    },
    props: {
      idSession: String
    },
    methods: {
      async handleJoinSession() {
        console.log(this.sessionStore.start);

        if (!this.sessionStore.start) {
          this.loading = true;
          try {
            const userStore = useUserStore();
            userStore.setUserRoles(UserRoles.TEACHER);
            console.log(this.sessionStore.idSession);
            await this.$router.push({
              path: '/session',
              query: { idSession: this.sessionStore.idSession, key: 'display' },
            });
          } catch (error) {
            console.error(error);
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
  * {
    color: #007EA1;
  }
  </style>