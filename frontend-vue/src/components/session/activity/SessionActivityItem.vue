<template>
  <v-sheet class="ma-1 px-3 py-2" border="border" rounded="lg">
    <p class="text-subtitle-1 text-start">{{ session.title }}</p>
    <p class="text-caption text-start">{{ session.idSession }}</p>
    <div class="my-2">
      <v-icon>calendar_month</v-icon>
      <span>{{ timeRemainingToString() }}</span>
    </div>
    <div class="d-flex my-1">
      <v-spacer></v-spacer>
      <v-btn>Join</v-btn>
    </div>
  </v-sheet>
</template>

<script>
  export default {
    name: 'SessionActivityItem',
    props: {
      session: null,
    },
    data() {
      return {
        timeRemaining: 0,
      };
    },
    methods: {
      calculTimeRemaining() {
        const date = new Date(this.session.end);
        const now = new Date();
        const diff = date.getTime() - now.getTime();
        this.timeRemaining = Math.floor(diff / 1000);
      },
      timeRemainingToString() {
        const days = Math.floor(this.timeRemaining / 86400);
        const hours = Math.floor((this.timeRemaining % 86400) / 3600);
        const minutes = Math.floor((this.timeRemaining % 3600) / 60);
        const seconds = Math.floor((this.timeRemaining % 3600) % 60);
        return `${days}days ${hours}h ${minutes}m ${seconds}s`;
      },
    },
    watch: {
      session: {
        immediate: true,
        handler() {
          this.calculTimeRemaining();
          setInterval(() => {
            this.calculTimeRemaining();
          }, 200);
        },
      },
    },
  };
</script>

<style scoped></style>
