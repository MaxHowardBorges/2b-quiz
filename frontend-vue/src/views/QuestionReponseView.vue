<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <h2>Question</h2>
    <QuestionComp quest='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo'/>
  </div>
  <div class='reponseQ'>
    <ReponseComp reponseQuest='1'/>
    <ReponseComp reponseQuest='2'/>
    <ReponseComp reponseQuest='3'/>
    <ReponseComp reponseQuest='4'/>

  </div>
</template>

<script>

  import QuestionComp from '@/components/QuestionComp.vue';
  import ReponseComp from '@/components/ReponseComp.vue';

  export default {
    name: 'QuestionReponseView',
    components: {
      QuestionComp,
      ReponseComp
    }
  }
</script>

<style scoped>

  .home {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  QuestionComp{
    margin-left: 10px;
    margin-right: 10px;
  }

  .reponseQ {
    margin-top: 2%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    max-width: 600px;
    border: 5px solid red;
  }


</style>
