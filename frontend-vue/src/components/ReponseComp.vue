<script >
  export default {
    name: 'ReponseComp',
    props: {
      reponseQuest: String,
    },
  };
</script>

<template>

  <div>{{reponseQuest}}</div>

</template>

<style scoped>

  *{
    text-align: center;
    max-width: 100px;
    border: 3px solid;
    font-size: 18px;
    font-size-adjust: initial;
  }


</style>