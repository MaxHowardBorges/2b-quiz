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
    padding: 16px 32px;
    margin: 5px;
    white-space: nowrap;
    overflow: hidden;
    width: 125px;
  }
</style>
