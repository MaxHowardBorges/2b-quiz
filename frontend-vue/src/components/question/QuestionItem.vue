<template>
  <v-sheet elevation="5" rounded="lg" class="d-flex flex-column my-2 pa-3">
    <div>
      <b> {{ question }} </b>
      <span class="spacer"></span>
      <span class="spacer"></span>
      <v-btn id="ic" icon="edit" ></v-btn>
      <v-btn id="ic" icon="visibility" @click="toggleDropdown"></v-btn>
      <v-btn id="ic" icon="content_copy" @click="copyQuestion"></v-btn>
    </div>
    <!-- Dropdown menu -->
    <v-list v-if="showDropdown" id="dropdown" class="mt-2">
      <v-list-item-group>
        <v-list-item v-for="(answer, index) in answers" :key="index">
          <template #default>
            <v-list-item-content>
              <v-list-item-title class="text-h6">
                Réponse {{ index + 1 }}
              </v-list-item-title>
              {{ answer }}
            </v-list-item-content>
          </template>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-sheet>
</template>

<script>
  import { ref } from 'vue';

  export default {
    name: 'QuestionItem',
    props: {
      question: {
        type: String,
        required: true,
      },
    },
    setup() {
      return {
        showDropdown: ref(false),
        answers: [
          'Tu es clairement le goat',
          'Je suis pas sur',
          'Tu es cringe',
        ],
      };
    },
    methods: {
      toggleDropdown() {
        this.showDropdown = !this.showDropdown;
      },
      copyQuestion() {
        const textarea = document.createElement('textarea');
        textarea.value = this.question;
        document.body.appendChild(textarea);

        textarea.select();
        document.execCommand('copy');

        document.body.removeChild(textarea);
      },
    },
  };
</script>

<style scoped>
  /* Ajoutez du style au besoin */
</style>
