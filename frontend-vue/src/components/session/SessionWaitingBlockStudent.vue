<template>
  <v-sheet
    rounded="lg"
    width="70%"
    class="mt-5 px-6 py-8 mx-auto"
    elevation="5">
    <h1 v-if="waitingSessionStart">Waiting for the start of the session</h1>
    <h1 v-if="!waitingSessionStart">Answer submitted</h1>
    <div>
      <p v-if="!waitingSessionStart">Waiting for the next question</p>
      <p>Session ID: {{ idSession }}</p>
    </div>
  </v-sheet>
</template>

<script>
  export default {
    name: 'SessionWaitingBlockStudent',
    props: {
      idSession: String,
      waitingSessionStart: false,
    },
  };
</script>
