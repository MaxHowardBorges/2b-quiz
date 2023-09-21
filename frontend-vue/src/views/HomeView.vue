<template>
  <form @submit="joinSession">
    <label id="id" for="id"></label>
    <input
      type="text"
      placeholder="ID de la Session"
      style="border: 1px solid #000000" />
    <input id="submit1" type="submit" value="Join" />
  </form>
</template>

<script>
  export default {
    methods: {
      joinSession() {
        // Logique pour annuler la session
        console.log('Session joined');
      },
    },
  };
</script>

<style scoped>
  body {
    font-family: 'Roboto Light', serif;
  }

  form {
    margin: 15% auto; /* Ajoutez cette ligne pour centrer le formulaire horizontalement */
    width: 20%;
    padding: 30px;
    border: 1px solid #f1f1f1;
    background: #fff;
    box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.2), 0 5px 5px 0 rgba(0, 0, 0, 0.24);
  }

  input[type='text'] {
    width: 100%;
    padding: 12px 20px;
    margin: 8px 0;
    display: inline-block;
    border: 1px solid #5e6567;
    box-sizing: border-box;
  }

  input::placeholder {
    color: #5e6567;
    opacity: 50%;
    margin-left: 50%;
  }
  input:placeholder-shown {
    border: 1px solid #ffffff;
  }

  input[type='submit'] {
    background-color: #f1dc66;
    border: none;
    color: white;
    padding: 14px 20px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    border-radius: 8px;
    margin: 8px 0;
    font-size: 15px;
    cursor: pointer;
    width: 100%;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  }

  input[type='submit']:hover {
    transform: scale(1.06);
    background-position: -60px;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  }

  input[type='submit']:active {
    transform: scale(1);
    background-position: 500px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  }
</style>
<script setup></script>
