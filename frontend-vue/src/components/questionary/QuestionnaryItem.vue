<template>

  <div class='blocklist'>
    <b>Questionnaire 1</b>
    <span class="spacer"></span>
    <span class="spacer"></span>
    <v-btn icon="play_arrow" ></v-btn>
    <v-btn icon="edit" ></v-btn>
    <v-btn icon="delete" ></v-btn>
  </div>

</template>

<script>

  import { useQuestionnaryStore } from '@/stores/questionnaryStore';

  export default {
    data() {
      return {
        iflist: true,
      };
    },
    setup() {
      const useQ = useQuestionnaryStore();
      return {
        useQ
      };
    },
    name: 'QuestionnaryItem',

  }

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