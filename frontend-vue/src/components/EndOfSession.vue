<template>
  <div class="end-session-page">
    <h1>C'est la fin de la session !</h1>
    <div class="actions">
      <btn  @click='handleCreateSession()' nomB="Relancer une session" />
      <router-link to="/teacher-home-page"><btn nomB="Retourner au menu" /></router-link>

      <tableP />
    </div>
  </div>
</template>

<script>
  import btn from '@/components/BoutonComp.vue';
  import tableP from '@/components/QuizzResultsTable.vue';

  export default {
    components: { tableP, btn },
    methods: {
      handleCreateSession() {
        this.$store.dispatch('createSession')
          .then(() => {
            this.$router.push('/waiting-participant');
          })
          .catch((error) => {
            console.error('Error while creating session:', error);
          });
      },
    },
  };
</script>

<style scoped>
  .end-session-page {
    text-align: center;
    margin: 0 auto; /* Centrer horizontalement */
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 10px 6px rgba(0, 0, 0, 0.1);
    background-color: #fff; /* Fond blanc */
    max-width: 100%;
    align-items: center;
    justify-content: center;
    display: flex;
    flex-direction: column;
  }

  .end-session-page h1 {
    font-size: 24px;
    margin-bottom: 10px;
    color: #f6c70a;
    /* Styles CSS supplémentaires pour la police et la mise en forme */
  }

  .actions {
    margin-top: 10px;
  }


</style>
