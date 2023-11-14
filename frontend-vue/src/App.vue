<template>
  <v-app class="custom_background">
    <header-block></header-block>
    <main>
      <router-view />
    </main>
    <footer-block></footer-block>
  </v-app>
</template>

<script setup>
  import HeaderBlock from '@/components/layout/HeaderBlock.vue';
  import FooterBlock from '@/components/layout/FooterBlock.vue';
  import { onMounted } from 'vue';
  import { useActivityStore } from '@/stores/activityStore';

  const activityStore = useActivityStore();

  onMounted(() => {
    activityStore.updateActivityTime();

    document.addEventListener('click', () => {
      activityStore.updateActivityTime();
    });
  });
</script>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Damion&family=Roboto:wght@300&display=swap');
  @import './styles/z-indexes.css';
  @import './styles/global.css';

  main {
    padding-top: 15px;
  }
</style>
