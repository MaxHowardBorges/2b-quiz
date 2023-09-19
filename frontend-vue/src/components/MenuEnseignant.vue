<template>
  <div class="teacher-interface">
    <h1>Menu enseignant</h1>
    <button @click="createSession"><router-link to="/attenteparticipant">Créer une session</router-link></button>
    <button @click="viewHistory"><router-link to="/">Historique de sessions</router-link></button>
  </div>
</template>

<script>
  export default {
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
    margin-top: 20px;
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

  button {
    background-color: #FFD700; /* Jaune */
    color: #fff; /* Texte blanc */
    padding: 15px 30px;
    border: none;
    border-radius: 4px;
    font-size: 20px;
    margin: 10px;
    cursor: pointer;
  }

  button:hover {
    background-color: #FFA500; /* Jaune foncé au survol */
  }
</style>
