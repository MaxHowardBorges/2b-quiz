<template>
  <v-sheet elevation="5" rounded="lg" class="d-flex flex-column my-2 pa-3">
    <div>
      <b>{{ question.content }}</b>
      <span class="spacer"></span>
      <span class="spacer"></span>
      <v-btn id="ic" icon="edit" @click="modifyQuestion"></v-btn>
      <v-btn id="ic" icon="visibility" @click="toggleDropdown"></v-btn>
      <v-btn id="ic" icon="content_copy" @click="copyQuestion"></v-btn>
    </div>
    <!-- Dropdown menu -->
    <v-list v-if="showDropdown" id="dropdown" class="mt-2">
      <v-list-item>
        <v-list-item v-for="(answer, index) in question.answers" :key="index">
          <template #default>
            <v-list-item>
              <v-list-item-title class="text-h6">
                Réponse {{ index + 1 }}
              </v-list-item-title>
              {{ answer.content }}
            </v-list-item>
          </template>
        </v-list-item>
      </v-list-item>
    </v-list>
  </v-sheet>
</template>

<script>
  export default {
    name: 'QuestionItem',
    props: {
      question: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {
        showDropdown: false,
      };
    },
    emits: ['modifyQuestionFromBank'],
    methods: {
      modifyQuestion() {
        this.$emit(
          'modifyQuestionFromBank',
          this.question.id,
          this.question.type,
        );
      },
      toggleDropdown() {
        this.showDropdown = !this.showDropdown;
      },
      copyQuestion() {
        const textarea = document.createElement('textarea');
        textarea.value = this.question.content;
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
