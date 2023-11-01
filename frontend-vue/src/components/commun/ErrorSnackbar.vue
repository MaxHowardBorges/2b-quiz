<template>
  <v-snackbar v-model="snackbarError" vertical="">
    <div class="text-subtitle-1 pb-2">{{ title }}</div>

    <p>{{ content }}</p>

    <template v-slot:actions>
      <v-btn color="indigo" variant="text" @click="snackbarError = false">
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
  import { ref } from 'vue';

  export default {
    name: 'ErrorSnackbar',
    props: {
      title: String,
      content: String,
    },
    data() {
      return {
        snackbarError: ref(false),
      };
    },
    methods: {
      setSnackbarError(bool) {
        this.snackbarError = bool;
      },
    },
  };
</script>

<style scoped></style>
