<template>
  <ErrorDialog
    title="The Server is offline"
    content="Please, try later."
    ref="dialogError"></ErrorDialog>

  <ErrorSnackbar
    title="Error while connecting to the session"
    :content="errorSnackbarContent"
    ref="errorSnackbar"></ErrorSnackbar>

  <v-sheet
    max-width="450px"
    min-width="150px"
    class="pa-5 d-block w-100"
    elevation="3"
    rounded="lg"
    position="relative">
    <v-form @submit.prevent="handleJoinSession">
      <v-text-field
        id="username"
        v-model="username"
        label="Username"></v-text-field>
      <v-text-field
        id="idSession"
        v-model="idSession"
        label="Session ID"></v-text-field>
      <v-btn
        type="submit"
        block=""
        class="mt-2"
        color="primary"
        :loading="loading">
        <p class="text-white font-weight-bold">Join</p>
      </v-btn>
    </v-form>
  </v-sheet>
</template>

<script>
  import { ref } from 'vue';
  import ErrorDialog from '@/components/commun/ErrorDialog.vue';
  import { mainStore } from '@/stores/main.store';
  import { fetchAPIStore } from '@/stores/fetchAPI.store';
  import { mapStores } from 'pinia';
  import ErrorSnackbar from '@/components/commun/ErrorSnackbar.vue';
  import router from '@/router';

  export default {
    name: 'JoinForm',
    computed: {
      ...mapStores(mainStore, fetchAPIStore),
    },
    components: { ErrorSnackbar, ErrorDialog },
    data() {
      return {
        loading: false,
        idSession: ref(''),
        username: ref(''),
        snackbarError: ref(false),
        errorSnackbarContent: '',
      };
    },
    methods: {
      async handleJoinSession() {
        this.loading = true;
        try {
          const body = { idSession: this.idSession, username: this.username };
          this.mainStore.setRouter(this.$router);
          const response = await this.fetchAPIStore.joinSession(body);
          if (response === true) await router.push('/waiting-session');
          else {
            this.errorSnackbarContent = response;
            this.$refs.errorSnackbar.setSnackbarError(true);
          }
        } catch (error) {
          console.error('Error while joining session:', error);
          this.$refs.dialogError.setDialogError(true);
        }
        this.loading = false;
      },
    },
  };
</script>

<style scoped></style>
