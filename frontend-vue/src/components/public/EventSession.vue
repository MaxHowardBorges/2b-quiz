<template>
  <div>
    <div class="ml-2 mr-auto event-column text-left" ref="eventList">
      <v-scroll-x-transition group tag="v-list">
        <v-sheet
          rounded="lg"
          elevation="1"
          border="sm"
          v-for="event in events"
          :key="event.id"
          transition="fade-transition"
          class="my-2 pa-1 pl-2">
          - {{ event.name }}
        </v-sheet>
      </v-scroll-x-transition>
    </div>
    <v-btn
      class="mt-2"
      color="primary"
      @click="addEvent({ id: 4, name: 'X a répondu à la question' })">
      Add event
    </v-btn>
  </div>
</template>

<script>
  export default {
    name: 'EventColumn',
    data() {
      return {
        events: [
          { id: 1, name: 'La session à commencé' },
          { id: 2, name: 'Y a rejoint la session' },
          { id: 3, name: 'X a répondu à la question' },
        ],
      };
    },
    methods: {
      addEvent(newEvent) {
        this.events.push(newEvent);

        this.$nextTick(() => {
          this.scrollToBottom();
        });
      },
      scrollToBottom() {
        const eventList = this.$refs.eventList;

        eventList.scrollTop = eventList.scrollHeight - eventList.clientHeight;
      },
    },
    mounted() {
      this.$nextTick(() => {
        this.scrollToBottom();
      });
    },
  };
</script>

<style scoped>
  .event-column {
    overflow-y: scroll;
    overflow-wrap: break-word;
    height: 100%;
  }

  * {
    color: #007ea1;
  }
</style>
