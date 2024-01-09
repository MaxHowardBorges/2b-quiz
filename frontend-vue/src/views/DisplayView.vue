

<template>
  <h1>Public screen</h1>
  <div class="h-10 d-flex align-center justify-center ma-2">

    <WaitForm />
  </div>

</template>

<style scoped>

</style>

<script>
  import WaitForm from '@/components/home/WaitForm.vue';

  export default {
    name: 'DisplayView',
    components: { WaitForm },

  };

</script>