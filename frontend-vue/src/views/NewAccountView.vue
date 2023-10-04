<template>
  <div class="register">
    <h1>Création de compte</h1>
    <form @submit.prevent="register">
      <div class="form-group">
        <label for="email">Prénom :</label>
        <input type="text" id="prenom" v-model="prenom" required>
      </div>
      <div class="form-group">
        <label for="email">Nom :</label>
        <input type="text" id="nom" v-model="nom" required>
      </div>
      <div class="form-group">
        <label for="email">Email :</label>
        <input type="email" id="email" v-model="email" required>
      </div>
      <div class="form-group">
        <label for="password">Mot de passe :</label>
        <input type="password" id="password" v-model="password" required>
      </div>
      <div class="form-group">
        <label for="confirmPassword">Confirmer le mot de passe :</label>
        <input type="password" id="confirmPassword" v-model="confirmPassword" required>
      </div>
      <div class="form-group" >
        <label for="accountType">Type de compte :</label>
        <div class="btnRadio" >
          <label>
            <input type="radio" id="student" value="student" v-model="accountType" required checked> Élève
          </label>
          <label>
            <input type="radio" id="teacher" value="teacher" v-model="accountType"> Enseignant
          </label>
        </div>
      </div>
      <BoutonComp type="submit" nomB="Créer un compte"/>
    </form>
  </div>
</template>

<script>
  import BoutonComp from '@/components/BoutonComp.vue';

  export default {
    components: { BoutonComp },
    data() {
      return {
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        accountType: '',
        nom: '',
        prenom: '',
      };
    },
    methods: {
      register() {
        console.log('Registration form submitted');
        this.$router.push('/login');
      },
    },
  };
</script>

<style scoped>

  .btnRadio{
    display:inline-flex;
    flex-wrap: wrap;
    align-items: center;
    align-content: center;
    align-self: center;
  }

  div{
    display:block;
    margin: 15px;
  }

  .register {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #fff;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    min-width: 150px;
    min-height: 75px;
  }

  .form-group {
    margin-bottom: 15px;
  }

  label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
  }

  input {
    width: 90%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 3px;
  }

  .error-message {
    color: red;
    font-size: 14px;
    margin-top: 10px;
  }

</style>
