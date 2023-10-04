<template>
  <div class="teacher-interface">
    <h1>Menu Enseignant</h1>

    <btn @click='handleCreateSession' nomB="Créer une session" />
    <router-link to="/"><btn nomB="Historique de sessions" /></router-link>
    <router-link to="/create-questionary"><btn nomB="Créer un questionnaire" /></router-link>



  </div>
</template>

<script>
  import btn from '@/components/BoutonComp.vue';

  export default {
    components: { btn },
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
