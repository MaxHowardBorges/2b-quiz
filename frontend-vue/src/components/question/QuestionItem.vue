<template>
  <v-sheet elevation="5" rounded="lg" class="d-flex flex-column my-2 pa-3">
    <div>
      <b>
        {{
          this.typeOptions.filter((type) => type.typeCode === question.type)[0]
            .typeLabel
        }}
      </b>
      <br />
      <b>{{ question.content }}</b>
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
        typeOptions: [
          { typeLabel: 'Unique', typeCode: 'qcu' },
          { typeLabel: 'Multiple', typeCode: 'qcm' },
          { typeLabel: 'Open-Ended', typeCode: 'ouv' },
          { typeLabel: 'True-False', typeCode: 'tof' },
          { typeLabel: 'Open-Ended-Constraint', typeCode: 'qoc' },
        ],
      };
    },
    emits: ['modifyQuestionFromBank', 'showQuestionnaryList'],
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
        // TODO change icon and name
        this.$emit('showQuestionnaryList', this.question);
      },
    },
  };
</script>
