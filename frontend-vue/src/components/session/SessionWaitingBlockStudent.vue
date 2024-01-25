<template>
  <v-sheet
    rounded="lg"
    width="70%"
    class="mt-5 px-6 py-8 mx-auto"
    elevation="5">
    <h1 v-if="waitingSessionStart">{{ $t('session.Waiting') }}</h1>
    <h1 v-if="!waitingSessionStart">{{ $t('session.AnswerSub') }}</h1>
    <div>
      <p v-if="!waitingSessionStart">{{ $t('session.WaitingNext') }}</p>
      <p>{{ $t('session.SessionID') }}: {{ idSession }}</p>
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
