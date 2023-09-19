<template>
  <nav>
    <router-link to="/">Home</router-link>
    |
    <router-link to="/about">About</router-link>
    |
    <router-link to="/question">Question</router-link>
    |
    <router-link to="/findesession">Fin de Session</router-link>
    |
    <router-link to="/attenteparticipant">
      En Attente de Participant
    </router-link>
    |
  </nav>
  <router-view />
</template>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300&display=swap');

  #app {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    font-family: 'Roboto', sans-serif;
  }

  body::before {
    content: '';
    background-image: url('@/assets/hexagons.svg');
    background-repeat: no-repeat;
    background-attachment: fixed;
    background-size: cover;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    opacity: 0.7;
  }

  nav {
    padding: 30px;
  }

  nav a {
    font-weight: bold;
    color: #2c3e50;
  }

  nav a.router-link-exact-active {
    color: #42b983;
  }
</style>
<script setup></script>
