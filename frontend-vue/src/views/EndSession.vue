<template>
  <div class="participant-waiting-page">
    <h1>Fin du Questionnaire <br> Merci d'avoir participé</h1>

    <div class="actions">
      <tableP />
      <button @click="quitSession">Quitter la session</button>
      <button >Se déconnecter</button>
      <button >Paramètres</button>
    </div>
  </div>
</template>

<script>
  import tableP from '@/components/QuizzResultsTable.vue';

  export default {
    methods: {
      quitSession() {
        // Logique pour annuler la session
        console.log('Session quittée');
      },
    },
    components: {
      tableP
    }
  };
</script>

<style scoped>
  h1{

    top: 150px;
  }

  .actions{
    bottom: 300px;
  }

  body{
    font-family: "Roboto Thin",sans-serif;
    justify-content: center;
    display: flex;
    align-items: center;
    height: 100vh;
    margin: 0;
    text-align: center;
  }

    label {
        font-size: 16px;
        color: #333;
    }

    input[type='text'] {
        width: 100%;
        padding: 10px;
        margin: 10px 0;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-size: 14px;
    }



    button {
        background-color: #ffd700;
        color: #fff;
        padding: 10px 20px;
        border: none;
        border-radius: 4px;
        font-size: 16px;
        margin: 10px;
        cursor: pointer;
    }

    button:hover {
        background-color: #ffa500;
  }

  .language-switch button {
    font-size: 14px;
  }

  *{
    align-content: center;
    align-items: center;
    align-self: center;
    background-color:white ;
  }
</style>
