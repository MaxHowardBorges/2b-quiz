<script>
  export default {
    name: 'ReponseComp',
    props: {
      reponseQuest: String,
    },
  };
</script>

<template>
  <button type="button">{{ reponseQuest }}</button>
</template>

<style scoped>
  button {
    min-height: 20px;
    border-radius: 4px;
    background-color: lightskyblue;
    white-space: nowrap;
    overflow: hidden;
    height: 85px;
    width: 45%;
  }

  button[type='button'] {
    background-color: #f6c70a;
    border: none;
    color: white;
    text-align: center;
    text-decoration: none;
    border-radius: 8px;
    margin: 5px;
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
