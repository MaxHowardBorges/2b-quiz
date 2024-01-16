<template>
  <v-btn @click="handleSubmit" color="primary" v-if="userStore.isStudent">
    <p class="text-white font-weight-bold">{{ $t('session.SendAnswer') }}</p>
  </v-btn>

  <v-divider v-if="userStore.isTeacher" class="mx-6 my-5"></v-divider>
  <div class="d-flex flex-row justify-center" v-if="userStore.isTeacher">
    <v-btn
      @click="handleStop"
      color="primary"
      max-width="250"
      class="mx-6 my-3 flex-grow-1">
      <p class="text-white font-weight-bold">{{ $t('session.StopTheSession') }}</p>
    </v-btn>
    <v-btn
      @click="handleNextQuestion"
      color="primary"
      max-width="250"
      class="mx-6 my-3 flex-grow-1">
      <p class="text-white font-weight-bold">{{ $t('session.NextQuestion') }} </p>
    </v-btn>
  </div>
</template>

<script>
  import { ref } from 'vue';
  import router from '@/router';
  import { useSessionStore } from '@/stores/sessionStore';
  import { useUserStore } from '@/stores/userStore';

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
    emits: ['answer-sent'],
    methods: {
      async handleNextQuestion() {
        await this.sessionStore.nextQuestion();
      },
      async handleStop() {
        await router.push('/');
        //TODO to finish
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
