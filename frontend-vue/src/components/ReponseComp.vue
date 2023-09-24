<script>
  export default {
    name: 'ReponseComp',
    emits: ['selectedOptionChanged'],
    props: {
      reponse: Object,
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

<template>
  <input
    type="radio"
    :id="reponse.id"
    v-model="selectedOption"
    :value="reponse.id"
    :name="field"
    @change="emitValue" />
  <label :for="reponse.id">{{ reponse.content }}</label>
</template>

<style scoped>
  input {
    display: none;
  }

  label {
    min-height: 20px;
    white-space: nowrap;
    overflow: hidden;
    height: 85px;
    width: 45%;
  }

  label {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f6c70a;
    border: none;
    color: white;
    text-align: center;
    text-decoration: none;
    border-radius: 8px;
    margin: 5px;
    font-size: 15px;
    cursor: pointer;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  }

  label:hover {
    transform: scale(1.06);
    background-position: -60px;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  }

  label:active {
    transform: scale(1);
    background-position: 500px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  }

  input:checked + label {
    box-shadow: inset 2px 2px 4px rgba(112, 110, 110, 0.64),
      inset 2px 3px 5px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(0, 0, 0, 0.12),
      0 1px 2px rgba(0, 0, 0, 0.24),
      inset -2px -3px 5px rgba(255, 255, 255, 0.5);
  }
</style>
