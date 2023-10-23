<template>
  <div class="participant-waiting-page">
    <h1>En attente du prochain question</h1>
    <div class="session-info">
      <p>ID de Session : {{ idSession }}</p>
    </div>
  </div>
</template>

<script>
  import { ref } from 'vue';
  import { mapStores } from 'pinia';
  import { mainStore } from '@/stores/main.store';

  export default {
    setup() {
      return {
        idSession: ref('data'),
      };
    },
    computed: {
      ...mapStores(mainStore),
    },
    mounted() {
      this.idSession = this.mainStore.getIdSession;
    },
  };
</script>

<style scoped>
  .join-session h1 {
    font-size: 24px;
    margin-bottom: 20px;
    color: #ffd700; /* Couleur jaune */
  }

  label {
    font-size: 16px;
    color: #333; /* Couleur de texte normale */
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
    background-color: #ffd700; /* Jaune */
    color: #fff; /* Texte blanc */
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    margin: 10px;
    cursor: pointer;
  }

  button:hover {
    background-color: #ffa500; /* Jaune foncé au survol */
  }

  .language-switch button {
    font-size: 14px;
  }
</style>
