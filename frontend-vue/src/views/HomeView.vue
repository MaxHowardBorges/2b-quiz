<template>
  <div class="h-100 d-flex align-center justify-center ma-2">
    <join-form />
  </div>
</template>

<script>
  import JoinForm from '@/components/home/JoinForm.vue';

  export default {
    name: 'HomeView',
    components: { JoinForm },
  };
</script>

<style scoped></style>
