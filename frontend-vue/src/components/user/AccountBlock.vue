<template>

  <v-sheet
    max-width="750px"
    rounded="lg"
    width="70%"
    class="mt-5 px-6 py-8 mx-auto"
    elevation="5">

    <h1>USER PAGE</h1>

    <v-text-field
      class="pa-4 mt-5"
      label="username"
    ></v-text-field>

    <v-text-field class='pa-4 ' label="name" ></v-text-field>

    <p> Status : <b>{{userStore.userRole}}</b></p>

  </v-sheet>

</template>

<script>

  import { useUserStore } from '@/stores/userStore';
  import { ref } from 'vue';

  export default {
    name: 'AccountBlock',
    setup() {
      const userStore = useUserStore();
      const updateUsername = () => {
        userStore.setUsername(userStore.username);
      };
      return {
        userStore,
        updateUsername,
        username: ref(''),
        password: ref(''),
      };
    },
  }

</script>
<style scoped>

</style>