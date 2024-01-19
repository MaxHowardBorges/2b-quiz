<template>
  <v-dialog v-model="SelectionDialog" max-width="600">
    <v-card>
      <v-card-title>Choose members</v-card-title>
      <v-card-text>
        <v-btn-toggle>
          <v-btn>Etudiants</v-btn>
          <v-btn>Enseignants</v-btn>
          <v-btn>Groupes</v-btn>
        </v-btn-toggle>
        <v-list>
          <v-list-item></v-list-item>
        </v-list>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="">Ajouter</v-btn>
        <v-btn @click="closeSelectionDialog">Fermer</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <div>
    <div class="d-flex flex-row mt-4">
      <v-select
        v-if="!isInSession"
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
        v-if="selectedAcces === AccessType.PRIVATE"
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
  </div>
</template>

<script>
  import { ref } from 'vue';
  import { AccessType } from '@/utils/accesType';

  export default {
    name: 'SessionSetting',
    computed: {
      AccessType() {
        return AccessType;
      },
    },
    props: {
      isInSession: Boolean,
    },
    data() {
      return {
        items: ['piloté', 'libre', 'chronometré'],
        selected: ref('piloté'),
        itemsAcces: [AccessType.PUBLIC, AccessType.PRIVATE, AccessType.CLOSED],
        selectedAcces: ref(AccessType.CLOSED),
        SelectionDialog: ref(false),
        popup: ref(false),
        displaySetting: {
          displayQuestion: true,
          displayAnswer: true,
        },
      };
    },
    methods: {
      openSelectionDialog() {
        this.SelectionDialog = true;
      },
      closeSelectionDialog() {
        this.SelectionDialog = false;
      },
    },
  };
</script>

<style scoped></style>
