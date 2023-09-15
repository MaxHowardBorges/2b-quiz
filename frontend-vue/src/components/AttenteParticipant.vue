<template>
  <div class="participant-waiting-page">
    <h1>En attente des participants...</h1>
    <div class="session-info">
      <p>ID de Session : {{ sessionID }}</p>
      <img alt="Qr code" src="../assets/qrcode.png" style="width: 100px;">
    </div>
    <p>{{ participantsCount }} personnes ont rejoint la session !</p>
    <div class="actions">
      <button @click="cancelSession">Annuler la session</button>
      <button @click="startSession">Lancer la session</button>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        sessionID: '123456', // Remplacez par l'ID de session réel
        participantsCount: 0,
      };
    },
    methods: {
      cancelSession() {
        // Logique pour annuler la session
        console.log('Session annulée');
      },
      startSession() {
        // Logique pour démarrer la session
        console.log('Session lancée');
      },
    },
  };
</script>

<style scoped>
  .join-session {
    text-align: center;
    margin-top: 20px;
    background-color: #fff; /* Fond blanc */
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .join-session h1 {
    font-size: 24px;
    margin-bottom: 20px;
    color: #FFD700; /* Couleur jaune */
  }

  label {
    font-size: 16px;
    color: #333; /* Couleur de texte normale */
  }

  input[type="text"] {
    width: 100%;
    padding: 10px;
    margin: 10px 0;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
  }

  button {
    background-color: #FFD700; /* Jaune */
    color: #fff; /* Texte blanc */
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    margin: 10px;
    cursor: pointer;
  }

  button:hover {
    background-color: #FFA500; /* Jaune foncé au survol */
  }

  .language-switch {
    text-align: right;
  }

  .language-switch button {
    font-size: 14px;
  }
</style>


