<template>
  <span :style="{ backgroundColor: backgroundColor }">
    {{ answerContent }}
  </span>
</template>

<script>
  export default {
    name: 'ReponseCompTeacher',
    props: {
      backgroundColor: String,
      answerContent: String,
    },
  };
</script>

<style scoped>
  /* Les styles restent les mêmes */
  span {
    min-height: 20px;
    border-radius: 4px;
    padding: 16px 32px;
    margin: 5px;
    text-overflow: ellipsis;
    width: auto;
    height: auto;
    max-width: 300px;
    white-space: normal;
  }
</style>
