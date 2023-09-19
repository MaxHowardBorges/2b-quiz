<script>
  export default {
    name: 'QuestionComp',
    props: {
      quest: String,
    },
  };
</script>

<template>
  <div>
    <b>{{ quest }}</b>
  </div>
</template>

<style scoped>
  div {
    text-align: center;
    max-width: 620px;
    min-width: 75px;
    border: 4px solid #f6c70a;
    font-size: 18px;
    font-size-adjust: initial;
    background-color: #fcfcfc;
  }
</style>
