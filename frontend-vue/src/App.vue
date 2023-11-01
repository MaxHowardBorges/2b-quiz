<template>
  <v-app class="custom_background">
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
  @import './styles/global.css';
</style>
