<template>
  <div class="participant-waiting-page">
    <div class="content-container">
      <h1>En attente des participants...</h1>
      <div class="session-info">
        <p>ID de Session : {{ idSession }}</p>
        <img alt="Qr code" src="../assets/qrcode.png" style="width: 100px" />
      </div>
      <p>{{ participantsCount }} personnes ont rejoint la session !</p>
      <div class="actions">
        <router-link to="/menuenseignant">
          <BoutonComp nomB="Annuler la session" />
        </router-link>
        <BoutonComp @click="handleLaunch" nomB="Lancer la session" />
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
    color: #ffd700; /* Couleur jaune */
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
</style>

<script>
  import { mapActions, mapGetters, mapMutations } from 'vuex';
  import { ref } from 'vue';
  import BoutonComp from '@/components/BoutonComp.vue';

  export default {
    components: { BoutonComp },
    computed: {
      ...mapGetters(['actualSession']), // Use mapGetters to map the getter to a computed property
    },
    setup() {
      return {
        idSession: ref('data'),
      };
    },
    mounted() {
      this.idSession = this.actualSession;
    },
    methods: {
      ...mapMutations(['setRouter']),
      ...mapActions(['nextQuestion']),
      async handleLaunch() {
        await this.nextQuestion();
        this.setRouter(this.$router);
        this.$router.push('/question');
      },
    },
  };
</script>
