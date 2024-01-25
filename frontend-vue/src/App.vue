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
  import { onBeforeMount } from 'vue';
  import { useActivityStore } from '@/stores/activityStore';
  import { useUserStore } from '@/stores/userStore';

  const activityStore = useActivityStore();
  const userStore = useUserStore();

  onBeforeMount(async () => {
    document.addEventListener('click', () => {
      activityStore.updateActivityTime();
    });
    if (userStore.isAuthenticated) {
      await userStore.updateUserType();
    }
    if (!userStore.interval) {
      userStore.intervalChecker();
    }
    document.title = 'SVD' ;
  });
</script>

<style>
  @import './fonts/Brother1816-Bold/style.css';
  @import './fonts/Brother1816-Book/style.css';
  @import './fonts/ApexNew-Light/style.css';
  @import url('./styles/main.scss');
  @import './styles/z-indexes.css';
  @import './styles/global.css';

  main {
    padding-top: 15px;
    padding-bottom: 15px;
  }
</style>
