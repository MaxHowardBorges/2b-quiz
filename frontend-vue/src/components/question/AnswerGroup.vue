<template>
  <v-item-group mandatory v-model="selected">
    <v-container class="d-flex flex-wrap flex-column">
      <v-row
        v-for="nLine in getNumberOfRow()"
        :key="nLine"
        class="align-stretch">
        <v-col
          class="flex-grow-1"
          v-for="nAnswer in getNbAnswerInLine(nLine - 1)"
          cols="12"
          :md="getMd(nLine)">
          <answer-item
            :disabled="disabled"
            :content="answers[getAnswerId(nAnswer, nLine)].content"
            :index="getAnswerId(nAnswer, nLine)" />
        </v-col>
      </v-row>
    </v-container>
  </v-item-group>
</template>

<script>
  import AnswerItem from '@/components/question/AnswerItem.vue';
  import { ref } from 'vue';

  export default {
    name: 'AnswerGroup',
    components: { AnswerItem },
    props: {
      answers: Array,
      disabled: Boolean,
    },
    data() {
      return {
        selected: ref(''),
      };
    },
    methods: {
      getNumberOfRow() {
        const answersNb = this.answers.length;
        if (answersNb <= 2) return 1;
        else if (answersNb <= 6) return 2;
        else {
          return 3;
        }
      },
      getNbAnswerInLine(lineNb) {
        const answersNb = this.answers.length;
        if (answersNb <= 4) {
          const nbAnswerRemained = answersNb - lineNb * 2;
          return nbAnswerRemained < 2 ? nbAnswerRemained : 2;
        } else {
          const nbAnswerRemained = answersNb - lineNb * 3;
          return nbAnswerRemained < 3 ? nbAnswerRemained : 3;
        }
      },
      getAnswerId(nAnswer, nLine) {
        if (this.answers.length <= 4) return nAnswer - 1 + (nLine - 1) * 2;
        else return nAnswer - 1 + (nLine - 1) * 3;
      },
      getMd(nLine) {
        const answersNb = this.answers.length;
        const nbAnswerInLine = this.getNbAnswerInLine(nLine - 1);
        if (nLine === this.getNumberOfRow())
          if (
            (answersNb <= 4 && nbAnswerInLine !== 2) ||
            (answersNb > 4 && nbAnswerInLine !== 3)
          )
            return 'auto';
        return answersNb <= 4 ? 6 : 4;
      },
    },
    watch: {
      selected(newValue) {
        this.$emit('new-selected-value', newValue);
      },
    },
  };
</script>

<style scoped></style>
