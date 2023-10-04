<script>


  import BoutonComp from '@/components/BoutonComp.vue';

  export default {
    name: 'loginView',
    data() {
      return {
        username: '',
        password: '',
        loginError: false,
        accountType: '',
      };
    },
    methods: {
      login() {
        if (this.username === 'ok' && this.password === 'ok') {
          this.$router.push('/');
        } else {
          this.loginError = true;
          console.error('Échec de la connexion');
        }
      }
    },
    components: {
      BoutonComp,
    },
  }

</script>

<template>
  <div class="login">
    <h1>Connexion</h1>
    <form @submit.prevent="login">
      <p v-if="loginError" class="error-message">Email ou mot de passe incorrect.</p>
      <div class="form-group">
        <label for="username">Email :</label>
        <input type="text" id="username" v-model="username" required>
      </div>
      <div class="form-group">
        <label for="password">Mot de passe :</label>
        <input type="password" id="password" v-model="password" required>
      </div>
      <router-link to="/register"><p>Créer un compte</p></router-link>
      <BoutonComp type="submit" nomB="Se connecter"/>
    </form>
  </div>
</template>

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

  .login {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #fff;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }

  .form-group {
    margin-bottom: 15px;
  }

  label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
  }

  input[type="text"],
  input[type="password"] {
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

  .login{
    min-width: 150px;
    min-height: 75px;
  }

</style>