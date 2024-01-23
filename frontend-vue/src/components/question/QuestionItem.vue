<template>
  <v-sheet
    elevation="3"
    rounded="lg"
    class="d-flex flex-column my-2 pa-3 w-100">
    <div class="d-flex flex-row">
      <p class="text-h5">
        <b>{{ question.content }}</b>
      </p>
      <v-spacer></v-spacer>
      <div class="mt-3 mr-5 text-h5">
        Taux de réussite:
        <br />
        {{ global }}/{{ total }}
      </div>
      <v-btn
        v-if="!global && global !== 0"
        id="ic"
        icon="edit"
        @click="modifyQuestion"></v-btn>
      <v-btn
        id="ic"
        :icon="showDropdown ? 'visibility_off' : 'visibility'"
        class="mx-2"
        @click="toggleDropdown"></v-btn>
      <v-btn
        v-if="!global && global !== 0"
        id="ic"
        icon="library_add"
        @click="addToQuestionnary"></v-btn>
    </div>
    <div class="text-button text-start">
      <b>
        {{
          this.typeOptions.filter((type) => type.typeCode === question.type)[0]
            .typeLabel
        }}
      </b>
    </div>
    <!-- Dropdown menu -->
    <v-list v-if="showDropdown" id="dropdown" class="mt-2">
      <v-list-item>
        <v-list-item v-for="(answer, index) in question.answers" :key="index">
          <template #default>
            <v-list-item>
              <v-list-item-title class="text-subtitle-1">
                Réponse {{ index + 1 }}
              </v-list-item-title>
              {{ answer.content }}
              <template v-if="results"></template>
              <v-icon v-if="answer.isCorrect">check</v-icon>
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
      global: Number | null,
      total: Number | null,
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
    mounted() {
      console.log(this.global);
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
      addToQuestionnary() {
        this.$emit('showQuestionnaryList', this.question);
      },
    },
  };
</script>
