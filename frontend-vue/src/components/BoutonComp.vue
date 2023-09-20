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

  button[type='button'] {
    background-color: #4ac2e8;
    border: none;
    color: white;
    padding: 14px 20px;
    text-align: center;
    text-decoration: none;
    border-radius: 8px;
    margin: 8px 0;
    font-size: 15px;
    cursor: pointer;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  }

  button[type='button']:hover {
    transform: scale(1.06);
    background-position: -60px;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  }

  button[type='button']:active {
    transform: scale(1);
    background-position: 500px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  }
</style>
