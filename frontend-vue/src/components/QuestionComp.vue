<script >
  export default {
    name: 'QuestionComp',
    props: {
      quest: String,
    },
  };
</script>

<template>

  <div>{{quest}}</div>

</template>

<style scoped>

  *{
    text-align: center;
    max-width: 800px;
    border: 3px solid;
    font-size: 18px;
    font-size-adjust: initial;
  }


</style>