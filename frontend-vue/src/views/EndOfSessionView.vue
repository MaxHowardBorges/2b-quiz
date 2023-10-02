<template>
  <div class="endof-session">
    <EndOfSession/>
  </div>
</template>

<script>
  // @ is an alias to /src
  import EndOfSession from '@/components/EndOfSession.vue'

  export default {
    name: 'CreateSessionView',
    components: {
      EndOfSession
    }
  }
</script>
