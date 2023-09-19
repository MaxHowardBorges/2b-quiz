<template>
  <div class="end-session-page">
    <h1>C'est la fin de la session !</h1>
    <div class="actions">
      <router-link to="/attenteparticipant"><btn nomB="Relancer une session" /></router-link>
      <router-link to="/menuenseignant"><btn nomB="Retourner au menu" /></router-link>
    </div>
  </div>
</template>

<script>
  import btn from '@/components/BoutonComp.vue';

  export default {
    components: { btn },
    methods: {
      relaunchSession() {
        // Logique pour relancer une nouvelle session
        // Vous pouvez rediriger l'utilisateur vers la page appropriée
      },
      returnToMenu() {
        // Logique pour retourner au menu principal
        // Vous pouvez rediriger l'utilisateur vers la page du menu
      },
    },
  };
</script>

<style scoped>
  .end-session-page {
    text-align: center;
    margin-top: 20px;
    background-color: #fff; /* Fond blanc */
    padding: 20px;
    border-radius: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .end-session-page h1 {
    font-size: 24px;
    margin-bottom: 10px;
    /* Styles CSS supplémentaires pour la police et la mise en forme */
  }

  .actions {
    margin-top: 10px;
  }


</style>
