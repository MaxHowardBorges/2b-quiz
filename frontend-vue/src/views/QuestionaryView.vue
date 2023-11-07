<template>
  <div class="endof-session">
    <CreateQuestionary/>
  </div>
</template>

<script>
  // @ is an alias to /src
  import CreateQuestionary from '@/components/questionary/CreateQuestionary.vue'

  export default {
    name: 'CreateQuestionaryView',
    components: {
      CreateQuestionary
    }
  }
</script>
