<template>
  <div class="blocklist">
    <b>{{ questionName.title }}</b>
    <span class="spacer"></span>
    <span class="spacer"></span>
    <!--    <v-btn icon="play_arrow" @click='startQuestionnary'></v-btn>-->
    <v-btn icon="edit" @click=""></v-btn>
    <v-btn icon="delete" @click=""></v-btn>
  </div>
</template>

<script setup>

</script>

<style scoped>
  .blocklist {
    display: flex;
    align-items: center;
    padding: 15px;
    border: 1px solid #ddd;
    margin-bottom: 15px;
  }

  .blocklist b {
    margin-right: 20px;
  }

  .blocklist .spacer {
    flex: 1;
  }

  .blocklist v-btn {
    margin-left: 20px;
  }
</style>