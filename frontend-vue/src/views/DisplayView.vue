<template>
  <h1>Public screen</h1>
  <div class="h-10 d-flex align-center justify-center ma-2">
<!--  {{this.idSession}}-->
    <WaitForm
      :idSession="this.idSession"
    />
  </div>

</template>

<script>
  import WaitForm from '@/components/home/WaitForm.vue';

  export default {
    name: 'DisplayView',
    components: { WaitForm },
    props: {
      idSession: []
    },

  };

</script>

<style scoped>
  * {
    color: #007EA1;
  }

  h1, h2, h3, h4, h5, h6 {
    color: #000000;
  }


</style>