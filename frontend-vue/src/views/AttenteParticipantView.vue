<template>
  <div class="participant-waiting-page">
    <img alt="Vue logo" src="../assets/logo.png">
    <AttenteParticipant/>
  </div>
</template>

<script>
  // @ is an alias to /src
  import AttenteParticipant from '@/components/AttenteParticipant.vue'

  export default {
    name: 'AttenteParticipantView',
    components: {
      AttenteParticipant
    }
  }
</script>
