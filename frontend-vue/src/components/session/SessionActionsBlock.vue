<template>
  <v-btn @click="handleSubmit" color="primary">
    <p class="text-white font-weight-bold">Send answer</p>
  </v-btn>
</template>

<script>
  import { useSessionStore } from '@/stores/sessionStore';
  import { ref } from 'vue';

  export default {
    name: 'SessionActionsBlock',
    setup() {
      const selectedValue = ref('');
      const sessionStore = useSessionStore();
      return {
        sessionStore,
        selectedValue,
      };
    },
    methods: {
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
