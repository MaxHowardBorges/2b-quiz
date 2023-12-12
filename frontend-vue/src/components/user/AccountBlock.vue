<template>
  <v-sheet
    max-width="750px"
    rounded="lg"
    width="90%"
    class="mt-5 px-6 py-8 mx-auto"
    elevation="5"
  >
    <h1>USER PAGE</h1>

    <!-- Bind v-model to userStore.username and add @change event handler -->
    <v-text-field
      class="pa-4 mt-5"
      label="username"
      v-model="this.name"
      @change="updateUsername"
    ></v-text-field>

    <v-text-field
      class="pa-4 mt-5"
      label="name"
      v-model="this.name"
    ></v-text-field>

    <p> Status : <b>{{ userStore.userRole }}</b></p>
  </v-sheet>
</template>

<script>
  import { useUserStore } from '@/stores/userStore';
  import { ref } from 'vue';

  export default {
    name: 'AccountBlock',
    setup() {
      const userStore = useUserStore();

      return {
        userStore,
        name: ref('test'),
      };
    },
    methods:{
      updateUsername(){
        console.log("start",this.userStore.username)
        this.userStore.setUsername(this.name);
        console.log("variable",this.name);
        console.log("store",this.userStore.username)
      },
    }
  };
</script>

<style scoped>
</style>
