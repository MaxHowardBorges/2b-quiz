<template>
  <error-snackbar
    ref="errorBar"
    :title="$t('user.ErrorWhileAskingDelete')"
    :content="$t('home.PleaseTryLater')"></error-snackbar>
  <confirmation-dialog
    ref="confirmationDialog"
    :title="$t('user.ConfirmationForDelete')"
    :content="$t('user.SureDeleteAccount')"
    @confirm="askDelete"></confirmation-dialog>
  <v-sheet
    max-width="750px"
    rounded="lg"
    width="90%"
    class="mt-5 px-6 py-8 mx-auto"
    elevation="5">
    <h1>{{ $t('user.userPage') }}</h1>

    <v-sheet border rounded="lg" class="pa-3 mx-auto my-4" max-width="600px">
      <div class="ma-2">
        <p>
          {{ $t('user.username') }} :
          <b>{{ this.user.username }}</b>
        </p>
      </div>
      <v-divider class="w-33 mx-auto"></v-divider>
      <div class="userinfo" v-if="!modification">
        <div class="ma-2">
          <p>
            {{ $t('user.name') }} :
            <b>{{ this.user.name }}</b>
          </p>
        </div>
        <v-divider class="w-33 mx-auto"></v-divider>
        <div class="ma-2">
          <p>
            {{ $t('user.surname') }} :
            <b>{{ this.user.surname }}</b>
          </p>
        </div>
      </div>
      <v-sheet v-else max-width="450px" class="mx-auto">
        <v-text-field
          variant="outlined"
          class="px-10 mt-5"
          :label="$t('user.name')"
          v-model="this.user.name"></v-text-field>
        <v-divider class="w-33 mx-auto"></v-divider>
        <v-text-field
          variant="outlined"
          class="px-10 mt-5"
          :label="$t('user.surname')"
          v-model="this.user.surname"></v-text-field>
      </v-sheet>
      <v-divider class="w-33 mx-auto"></v-divider>
      <p class="ma-2">
        {{ $t('user.status') }} :
        <b>{{ userStore.userRole }}</b>
      </p>
    </v-sheet>

    <v-btn
      v-if="modification"
      class="mt-5"
      color="primary"
      @click="updateUserData">
      {{ $t('user.validate') }}
    </v-btn>
    <v-btn class="mt-5" color="primary text-button" @click="modification = !modification">
      {{ modification ? $t('user.cancel') : $t('user.modify') }}
    </v-btn>
    <v-divider class="my-5"></v-divider>
    <v-btn @click="askDeleteDialog" class="text-button">
      {{ $t('user.askDelete') }}
    </v-btn>
  </v-sheet>
</template>

<script>
  import { useUserStore } from '@/stores/userStore';
  import { ref } from 'vue';
  import ErrorSnackbar from '@/components/commun/ErrorSnackbar.vue';
  import ConfirmationDialog from '@/components/commun/ConfirmationDialog.vue';

  export default {
    name: 'AccountBlock',
    components: { ConfirmationDialog, ErrorSnackbar },
    setup() {
      const userStore = useUserStore();
      return {
        userStore,
        user: ref({ username: '', name: '' }),
        name: ref('test'),
        modification: ref(false),
      };
    },
    async mounted() {
      this.user = await this.userStore.getSelf();

    },
    methods: {
      async updateUserData() {
        await this.userStore.updateSelf(this.user.name, this.user.surname);
        this.modification = false;
      },
      askDeleteDialog() {
        this.$refs.confirmationDialog.dialog = true;
      },
      async askDelete() {
        try {
          await this.userStore.askDelete();
        } catch (e) {
          this.$refs.errorBar.snackbarError = true;
        }
      },
    },
  };
</script>

<style scoped></style>
