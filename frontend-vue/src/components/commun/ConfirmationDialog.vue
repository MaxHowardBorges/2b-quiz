<template>
  <v-dialog v-model="dialog" persistent width="auto">
    <v-card>
      <v-card-title class="text-h5">
        {{ title }}
      </v-card-title>
      <v-card-text>
        {{ content }}
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" variant="text" @click="cancel">{{ this.$t('user.cancel') }}</v-btn>
        <v-btn color="info" variant="text" @click="confirm">{{ this.$t('user.confirm') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    name: 'ConfirmationDialog',
    props: {
      content: String,
      title: String,
    },
    data: () => ({
      dialog: false,
    }),
    methods: {
      cancel() {
        this.dialog = false;
        this.$emit('cancel');
      },
      confirm() {
        this.dialog = false;
        this.$emit('confirm');
      },
    },
  };
</script>

<style scoped></style>
