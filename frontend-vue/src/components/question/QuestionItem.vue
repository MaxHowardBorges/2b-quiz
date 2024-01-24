<template>
  <v-sheet
    :color="getColor()"
    elevation="3"
    rounded="lg"
    class="d-flex flex-column my-2 pa-3 w-100">
    <div class="d-flex flex-row">
      <p class="text-h5">
        <b>{{ question.content }}</b>
      </p>
      <v-spacer></v-spacer>
      <div v-if="global || global === 0" class="mt-3 mr-5 text-h5">
        Taux de réussite:
        <br />
        {{ global }}/{{ total }}
      </div>
      <v-btn
        v-if="isHost === null"
        id="ic"
        icon="edit"
        @click="modifyQuestion"></v-btn>
      <v-btn
        v-if="!(!isHost && !question)"
        id="ic"
        :icon="showDropdown ? 'visibility_off' : 'visibility'"
        class="mx-2"
        @click="toggleDropdown"></v-btn>
      <v-btn
        v-if="isHost === null"
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
    <v-list
      v-if="showDropdown && question"
      id="dropdown"
      class="mt-2"
      :color="getColor()">
      <v-list-item v-if="isHost">
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
      <v-sheet
        v-else
        class="d-flex flex-row flex-wrap w-100 my-n2"
        :color="getColor()">
        <v-spacer></v-spacer>
        <v-sheet :color="getColor()">
          <p><b>Réponse correcte:</b></p>
          <p>{{ question.correctAnswers.join(', ') }}</p>
        </v-sheet>
        <v-spacer></v-spacer>
        <v-sheet :color="getColor()">
          <p><b>Votre réponse:</b></p>
          <p>{{ question.studentAnswers.join(', ') }}</p>
        </v-sheet>
        <v-spacer></v-spacer>
      </v-sheet>
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
      global: {
        type: Number,
        required: false,
        default: null,
      },
      total: {
        type: Number,
        required: false,
        default: null,
      },
      isHost: {
        type: Boolean,
        required: false,
        default: null,
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
      getColor() {
        if (
          this.question &&
          this.question.studentAnswers &&
          this.question.correctAnswers &&
          this.question.hasAnsweredCorrectly !== null
        ) {
          if (this.question.hasAnsweredCorrectly) {
            return 'green-lighten-3';
          }
          return 'red-lighten-3';
        }
        return '';
      },
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
