<template>
  <v-dialog v-model="dialogVisible" max-width="500">
    <v-card>
      <v-card-title>Are you sure ?</v-card-title>

      <v-card-text>
        If you stop the session, all of results will be lost !
      </v-card-text>
      <v-card-actions class="text-center">
        <v-btn @click="yesCancel">Yes</v-btn>
        <v-btn @click="noCancel">No</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-btn @click="handleSubmit" color="primary" v-if="userStore.isStudent">
    <p class="text-white font-weight-bold">Send answer</p>
  </v-btn>

  <v-divider v-if="userStore.isTeacher" class="mx-6 my-5"></v-divider>
  <div class="d-flex flex-row justify-center" v-if="userStore.isTeacher">
    <v-btn
      @click="handleStop"
      color="primary"
      max-width="250"
      class="mx-6 my-3 flex-grow-1">
      <p class="text-white font-weight-bold">Stop the session</p>
    </v-btn>
    <v-btn
      @click="handleNextQuestion"
      color="primary"
      max-width="250"
      class="mx-6 my-3 flex-grow-1">
      <p class="text-white font-weight-bold">Next question</p>
    </v-btn>
  </div>
</template>

<script>
  import { ref } from 'vue';
  import router from '@/router';
  import { useSessionStore } from '@/stores/sessionStore';
  import { useUserStore } from '@/stores/userStore';
  import { th } from 'vuetify/locale';

  export default {
    name: 'SessionActionsBlock',
    setup() {
      const selectedValue = ref('');
      const sessionStore = useSessionStore();
      const userStore = useUserStore();
      return {
        selectedValue,
        sessionStore,
        userStore,
      };
    },
    data() {
      return {
        dialogVisible: false,
      };
    },
    emits: ['answer-sent'],
    methods: {
      async handleNextQuestion() {
        await this.sessionStore.nextQuestion();
      },
      async handleStop() {
        this.dialogVisible = true;
      },
      async noCancel() {
        this.dialogVisible = false;
      },
      async yesCancel() {
        await router.push('/');
        this.sessionStore.stopSession();
      },
      async handleSubmit() {
        try {
          await this.sessionStore.sendAnswer(this.selectedValue);
          this.$emit('answer-sent');
        } catch (e) {
          console.error(e); //TODO manage error
        }
      },
    },
  };
</script>

<style scoped></style>
