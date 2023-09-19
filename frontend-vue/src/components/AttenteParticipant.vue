<template>
  <div class="participant-waiting-page">
    <div class="content-container">
      <h1>En attente des participants...</h1>
      <div class="session-info">
        <p>ID de Session : {{ sessionID }}</p>
        <img alt="Qr code" src="../assets/qrcode.png" style="width: 100px;">
      </div>
      <p>{{ participantsCount }} personnes ont rejoint la session !</p>
      <div class="actions">
        <button @click="cancelSession">Annuler la session</button>
        <button @click="startSession"><router-link to="/question">Lancer la session</router-link></button>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .participant-waiting-page {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50vh;
  }

  .content-container {
    background-color: #fff; /* Fond blanc */
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    text-align: center;
  }

  .content-container h1 {
    font-size: 24px;
    margin-bottom: 20px;
    color: #FFD700; /* Couleur jaune */
  }

  .session-info {
    margin-bottom: 20px;
  }

  .session-info p {
    font-size: 16px;
    color: #333; /* Couleur de texte normale */
  }

  img {
    width: 100px;
  }

  p {
    font-size: 16px;
    color: #333; /* Couleur de texte normale */
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
</style>
