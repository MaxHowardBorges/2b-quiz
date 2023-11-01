<template>
  <v-app>
    <Header></Header>
    <main>
      <router-view />
    </main>
    <Footer></Footer>
  </v-app>
</template>

<script setup>
  import Header from '@/components/header.vue';
  import Footer from '@/components/footer.vue';
</script>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Damion&family=Roboto:wght@300&display=swap');
  @import './styles/z-indexes.css';

  :root {
    --v-theme-overlay-multiplier: 1;
  }

  main {
    height: 100%;
  }

  #app {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    font-family: 'Roboto', sans-serif;
  }

  div.v-application {
    content: '';
    background-image: url('@/assets/hexagons.svg');
    background-repeat: no-repeat;
    background-attachment: fixed;
    background-size: cover;
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

  .logo {
    font-family: 'Damion', cursive;
  }
</style>
