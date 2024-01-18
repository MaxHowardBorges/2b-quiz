<template>
  <div>
    <div class="d-flex flex-row mt-4">
      <v-select
        v-model="selected"
        :items="items"
        label="Type de session"
        class="mt-4 mx-3"
        outlined
        dense
        required></v-select>

      <v-select
        v-model="selectedAcces"
        :items="itemsAcces"
        label="Type d'accès"
        class="mt-4 mx-3"
        outlined
        dense
        required></v-select>

      <v-btn
        v-if="selectedAcces === 'privé'"
        @click="openSelectionDialog"
        class="mt-4 mx-3">
        Choisir étudiants
      </v-btn>
      <!--    TODO choisir les membres à ajouter en cours de route -->
    </div>
    <div class="d-flex">
      <v-switch
        color="primary"
        label="Display question on public screen"
        v-model="displaySetting.displayQuestion"
        @update:model-value="
          displaySetting.displayAnswer =
            displaySetting.displayAnswer && displaySetting.displayQuestion
        " />
      <v-switch
        color="primary"
        label="Display answers on public screen"
        v-model="displaySetting.displayAnswer"
        :disabled="!displaySetting.displayQuestion" />
    </div>
    <div class="d-flex">
      <v-switch />
      <v-switch />
      <v-switch />
    </div>
  </div>
</template>

<script>
  import { ref } from 'vue';

  export default {
    name: 'SessionSetting',
    data() {
      return {
        items: ['piloté', 'libre', 'chronometré'],
        selected: ref('piloté'),
        itemsAcces: ['fermé', 'public', 'privé'],
        selectedAcces: ref('fermé'),
        SelectionDialog: ref(false),
        popup: ref(false),
        displaySetting: {
          displayQuestion: true,
          displayAnswer: true,
        },
      };
    },
  };
</script>

<style scoped></style>
