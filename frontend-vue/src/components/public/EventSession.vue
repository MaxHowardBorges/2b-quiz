<template>
  <div>
    <div class="ml-2 mr-auto event-column text-left" ref="eventList">
      <v-scroll-x-transition :group="true" tag="v-list">
        <v-sheet
          rounded="lg"
          elevation="1"
          border="sm"
          v-for="(event, index) in events"
          v-bind:key="index"
          transition="fade-transition"
          class="my-2 pa-1 pl-2">
          - {{ event }}
        </v-sheet>
      </v-scroll-x-transition>
    </div>
  </div>
</template>

<script>
  import { ref } from 'vue';
  import { useSessionEventStore } from '@/stores/sessionEventStore';

  export default {
    name: 'EventColumn',
    setup() {
      const events = ref([]);
      const sessionEventStore = useSessionEventStore();
      return {
        events,
        sessionEventStore,
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
      getNewEvent(newEventList) {
        return newEventList.filter((event) => !this.events.includes(event));
      },
    },
    mounted() {
      this.$nextTick(() => {
        this.scrollToBottom();
      });
      this.sessionEventStore.$subscribe((mutation, state) => {
        if (state.eventList.length > this.events.length) {
          const newEvents = this.getNewEvent(state.eventList);
          for (const newEvent of newEvents) {
            this.addEvent(newEvent);
          }
          this.$nextTick(() => {
            this.scrollToBottom();
          });
        }
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
