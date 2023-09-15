<template>
  <div class="endof-session">
    <img alt="Vue logo" src="../assets/logo.png">
    <FinDeSession/>
  </div>
</template>

<script>
  // @ is an alias to /src
  import FinDeSession from '@/components/FinDeSession.vue'

  export default {
    name: 'CreateSessionView',
    components: {
      FinDeSession
    }
  }
</script>
