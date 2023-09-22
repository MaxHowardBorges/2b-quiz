<template>
  <div class="teacher-interface">
    <h1>Menu enseignant</h1>

    <router-link to="/attenteparticipant">
      <btn nomB="Créer une session" />
    </router-link>
    <router-link to="/">
      <btn nomB="Historique de sessions" />
    </router-link>
  </div>
</template>

<script>
  import btn from "@/components/BoutonComp.vue";

  export default {
    components: { btn },
    methods: {
      createSession() {
        // Logique pour créer une nouvelle session
        // Vous pouvez rediriger l'enseignant vers la page de création de session
      },
      viewHistory() {
        // Logique pour accéder à l'historique de sessions
        // Vous pouvez rediriger l'enseignant vers la page d'historique de sessions
      },
    },
  };
</script>

<style scoped>
  .teacher-interface {
    text-align: center;
    margin: 0 auto; /* Centrer horizontalement */
    max-width: 400px; /* Largeur maximale pour le contenu */
    background-color: rgb(255, 255, 255); /* Fond blanc */
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .teacher-interface h1 {
    font-size: 24px;
    margin-bottom: 20px;
    color: #FFD700; /* Couleur jaune */
  }
</style>
