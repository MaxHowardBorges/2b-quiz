<template>
  <div class="event-column">
    <div v-for="(event, index) in events" :key="index">{{ event }}</div>
  </div>
</template>

<script>
  export default {
    name: 'EventColumn',
    data() {
      return {
        events: ['La session à commencé','Y a rejoint la session', 'X a répondu à la question'],
      };
    },
    methods: {
      addEvent(newEvent) {
        this.events.push(newEvent);
      },
    },
  }
</script>

<style scoped>
  .event-column {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    max-width: 100%;
    height: 100%;
    background-color: #f5f5f5;
    border-radius: 5px;
    padding: 10px;
    box-sizing: border-box;
    overflow-y: auto;
  }

  * {
    color: #007ea1;
  }
</style>