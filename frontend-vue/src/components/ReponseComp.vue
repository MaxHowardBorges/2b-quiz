<template>
  <input
    type="radio"
    :id="answer.id"
    v-model="selectedOption"
    :value="answer.id"
    :name="field"
    @change="emitValue" />
  <label :for="answer.id">{{ answer.content }}</label>
  <button :style="{ backgroundColor: backgroundColor }" type="button">{{ reponseQuest }}</button>
</template>

<script>
  export default {
    name: 'ReponseComp',
    emits: ['selectedOptionChanged'],
    props: {
      reponseQuest: string,
      backgroundColor: String,
      answer: Object,
      field: String,
    },
    data() {
      return {
        selectedOption: null,
      };
    },
    methods: {
      emitValue() {
        this.$emit('selectedOptionChanged', this.selectedOption);
      },
    },
  };
</script>

<style scoped>
  /* Les styles restent les mêmes */
  button {
    min-height: 20px;
    border-radius: 4px;
    padding: 16px 32px;
    margin: 5px;
    text-overflow: ellipsis;
    width: auto;
    height: auto;
    max-width: 300px;
    white-space: normal;
    overflow: auto;

  }

  button:active {
    transform: scale(1.1);
  }

  button:hover {
    background-color: rgba(255, 255, 255, 0.85);
  }

  input:checked + label {
    box-shadow: inset 2px 2px 4px rgba(112, 110, 110, 0.64),
    inset 2px 3px 5px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(0, 0, 0, 0.12),
    0 1px 2px rgba(0, 0, 0, 0.24),
    inset -2px -3px 5px rgba(255, 255, 255, 0.5);
  }
</style>