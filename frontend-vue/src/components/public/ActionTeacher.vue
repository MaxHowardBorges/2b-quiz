<template>
  <div class="action-block">
    <div>
      <p v-if="!sessionStore.status.nbAnswered">
        {{ sessionStore.status.nbJoined }} user joined
      </p>
      <p v-else>
        {{ sessionStore.status.nbAnswered }}/{{ sessionStore.status.nbJoined }}
        user answered
      </p>
    </div>
    <v-btn @click="endSession" class="btn btn-primary">Fin de la session</v-btn>
    <v-btn @click="nextQuestion" class="btn btn-success">
      Question suivante
    </v-btn>
    <v-btn @click="openSettings" class="btn btn-info">Settings</v-btn>
    <v-switch
      v-model="model"
      color="primary"
      hide-details
      :inset="true"
      @change="toggleSwitch"
      :label="`Switch: ${model ? 'ouvert' : 'fermé'}`"></v-switch>

    <v-dialog v-model="setting" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">Paramètres</span>
        </v-card-title>

        <v-card-text>A complété</v-card-text>

        <!-- TODO add settings -->

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="this.setting = false">Annuler</v-btn>
          <v-btn color="primary" @click="this.setting = false">
            Enregistrer
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  import router from '@/router';
  import { useSessionStore } from '@/stores/sessionStore';

  export default {
    setup() {
      const sessionStore = useSessionStore();
      return {
        sessionStore,
      };
    },
    name: 'ActionBlock',
    data() {
      return {
        model: false,
        setting: false,
      };
    },
    methods: {
      async endSession() {
        console.log('Fin de la session');
        this.sessionStore.sessionEnd();
        await router.push('/');
        //TODO to finish
      },
      async nextQuestion() {
        console.log('Question suivante');
        try {
          const response = await this.sessionStore.nextQuestion();
          await this.sessionStore.getCurrentQuestionForTeacher(response);
        } catch (e) {
          this.sessionStore.disconnectFromSession(
            'Error handling next question: ' + e.message,
          );
        }
      },
      openSettings() {
        console.log('Ouverture des paramètres');
        this.setting = true;
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
