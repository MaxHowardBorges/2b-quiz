<template>
  <v-snackbar v-model="snackbarInfo" vertical="">
    <div class="text-subtitle-1 pb-2">{{ title }}</div>

    <p>{{ content }}</p>

    <template v-slot:actions>
      <v-btn color="indigo" variant="text" @click="snackbarInfo = false">
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
  import { ref } from 'vue';

  export default {
    name: 'InfoSnackbar',
    props: {
      content: String,
      title: String,
    },
    data() {
      return {
        snackbarInfo: ref(false),
      };
    },
    methods: {
      setSnackbarError(bool) {
        this.snackbarInfo = bool;
      },
    },
  };
</script>

<style scoped></style>
