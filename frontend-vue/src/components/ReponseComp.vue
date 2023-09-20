<template>
  <button :style="{ backgroundColor: backgroundColor }" type="button">{{ reponseQuest }}</button>
</template>

<script>
  export default {
    name: 'ReponseComp',
    props: {
      reponseQuest: String,
      backgroundColor: String, // Ajoutez la prop pour la couleur de fond
    },
  };
</script>

<style scoped>
  /* Les styles restent les mêmes */
  button {
    min-height: 20px;
    border-radius: 4px;
    padding: 16px 32px;
    margin: 5px;
    text-overflow: ellipsis;
    width: auto;
    height: auto;
    max-width: 300px;
    white-space: normal;
    overflow: auto;

  }

  button:active {
    transform: scale(1.1);
  }

  button:hover {
    background-color: rgba(255, 255, 255, 0.85);
  }
</style>