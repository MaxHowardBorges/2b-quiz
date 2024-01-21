<template>
  <v-dialog v-model="dialogError" width="auto">
    <v-card class="pa-5" min-width="40vw">
      <v-card-text>
        <p class="mb-3 text-h3 text-error text-uppercase">
          {{ title }}
        </p>
        <p>{{ content }}</p>
      </v-card-text>
      <v-card-actions class="align-self-end">
        <v-btn variant="elevated" color="info" @click="setDialogError(false)">
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import { ref } from 'vue';

  export default {
    name: 'ErrorDialog',
    props: {
      content: String,
      title: String,
    },
    data() {
      return {
        dialogError: ref(false),
      };
    },
    methods: {
      setDialogError(bool) {
        this.dialogError = bool;
      },
    },
  };
</script>