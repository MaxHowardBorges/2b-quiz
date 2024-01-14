<template>
  <div class="action-block">
    <v-btn @click="endSession" class="btn btn-primary">Fin de la session</v-btn>
    <v-btn @click="nextQuestion" class="btn btn-success">Question suivante</v-btn>
    <v-btn @click="openSettings" class="btn btn-info">Settings</v-btn>
    <v-switch
      v-model="model"
      color="primary"
      hide-details
      inset
      @change="toggleSwitch"
      :label="`Switch: ${model?'ouvert':'fermé'}`"
    ></v-switch>
  </div>
</template>

<script>
  export default {
    name: 'ActionBlock',
    data() {
      return {
        model: false,
      };
    },
    methods: {
      endSession() {
        console.log('Fin de la session');
      },
      nextQuestion() {
        console.log('Question suivante');
      },
      openSettings() {
        console.log('Ouverture des paramètres');
      },
      toggleSwitch() {
        console.log('Switch changé :', this.isOpen ? 'ouvert' : 'fermé');
      },
    },
  };
</script>

<style scoped>
  .action-block {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    align-items: center;
    margin: 10px;
  }
</style>
