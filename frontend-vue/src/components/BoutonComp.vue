<script>
  export default {
    name: 'BoutonComp',
    props: {
      nomB: String,
    },
  };
</script>

<template>
  <button type="button">{{ nomB }}</button>
</template>

<style scoped>
  * {
    min-height: 20px;
    border-radius: 4px;
    background-color: #f6c70a;
    padding: 16px 32px;
    margin: 5px;
    font-size: 19px;
  }
</style>
