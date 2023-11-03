<template>
  <v-sheet
    rounded="lg"
    width="70%"
    class="mt-5 px-6 py-8 mx-auto"
    elevation="5">
    <h1>Session ended</h1>
    <h2>Thanks for participating</h2>

    <div class="mt-3">
      <v-btn @click="quitSession" color="primary" class="ma-2">
        <p class="text-white font-weight-bold">Quit the session</p>
      </v-btn>
      <v-btn color="primary" class="ma-2">
        <p class="text-white font-weight-bold">Logout</p>
      </v-btn>
      <v-btn color="primary" class="ma-2">
        <p class="text-white font-weight-bold">Settings</p>
      </v-btn>
    </div>
  </v-sheet>
</template>

<script>
  import router from '@/router';

  export default {
    name: 'SessionEnded',
    methods: {
      quitSession() {
        router.push('/');
      },
    },
  };
</script>

<style scoped></style>
