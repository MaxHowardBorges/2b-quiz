<template>
  <error-dialog
    :title="$t('login.ServerOffline')"
    content="Please, try later."
    ref="dialogServerError"></error-dialog>

  <error-dialog
    :title="$t('login.SessionExpired')"
    content="Please, reconnect yourself."
    ref="dialogExpiredError"></error-dialog>

  <error-snackbar
    :title="$t('login.ErrorLogin')"
    :content="errorSnackbarContent"
    ref="errorSnackbar"></error-snackbar>

  <v-sheet
    max-width="500px"
    rounded="lg"
    width="70%"
    class="mt-5 px-6 py-8 mx-auto"
    elevation="5">
    <div class="logo ma-2 pa-2">{{ $t('user.SVD')}}</div>

    <v-alert
      class="ma-5 pa-2 text-left"
      color="error"
      type="error"
      variant="tonal">
      <b>{{$t('login.sessionError')}}</b>
    </v-alert>

    <h2><b>{{$t('login.LoginWithAccount')}}</b></h2>
    <v-form @submit.prevent="login" class="ma-2" max-width="500px">
      <v-btn width="100%" color="primary" type="submit">
        <p class="text-white font-weight-bold">{{$t('login.login')}}</p>
      </v-btn>
    </v-form>
  </v-sheet>
</template>

<script>
  import ErrorDialog from '@/components/commun/ErrorDialog.vue';
  import ErrorSnackbar from '@/components/commun/ErrorSnackbar.vue';
  import { useUserStore } from '@/stores/userStore';
  import { ref } from 'vue';
  import { resetPiniaStores } from '@/utils/piniaUtils';
  import router from '@/router';
  import { ValidationError } from '@/utils/valdiationError';

  export default {
    name: 'LoginBlock',
    components: { ErrorDialog, ErrorSnackbar },
    props: {
      expiredError: Boolean,
      serverError: Boolean,
      ticket: null,
    },
    setup() {
      const userStore = useUserStore();
      return {
        userStore,
        username: ref(''),
        password: ref(''),
        passwordVisibility: ref(false),
        errorSnackbarContent: ref(''),
      };
    },
    async mounted() {
      if (this.expiredError) this.$refs.dialogExpiredError.setDialogError(true);
      if (this.serverError) {
        resetPiniaStores();
        this.$refs.dialogServerError.setDialogError(true);
      }
      if (this.ticket) {
        await this.checkTicket();
      }
    },
    methods: {
      getServiceURL() {
        if (this.$route.query.from) {
          return (
            window.location.origin +
            this.$route.path +
            '?from=' +
            decodeURIComponent(this.$route.query.from)
          );
        }
        return window.location.origin + this.$route.path;
      },
      login() {
        window.location.href =
          import.meta.env.VITE_CAS_URL +
          import.meta.env.VITE_CAS_LOGIN_ROUTE +
          '?service=' +
          encodeURIComponent(this.getServiceURL());
      },
      async checkTicket() {
        try {
          await this.userStore.login(this.ticket, this.getServiceURL());
          if (!!this.$route.query.from) {
            await router.push(decodeURIComponent(this.$route.query.from));
          } else {
            await router.push('/');
          }
        } catch (error) {
          if (error instanceof ValidationError) {
            this.errorSnackbarContent = error.message;
            this.$refs.errorSnackbar.setSnackbarError(true);
          } else {
            console.error('Error while validating ticket:', error);
            this.$refs.dialogError.setDialogError(true);
          }
        }
      },
      togglePasswordVisibility() {
        this.passwordVisibility = !this.passwordVisibility;
      },
    },
  };
</script>

<style scoped>
  .logo {
    font-size: xx-large;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
