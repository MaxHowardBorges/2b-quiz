<template>
  <v-sheet class="ma-1 px-3 py-2" border="border" rounded="lg">
    <p class="text-subtitle-1 text-start">{{ session.idSession }}</p>
    <p class="text-caption text-start">{{ $t('session.Par') }} {{ session.teacherUsername }}</p>
    <div class="d-flex my-1">
      <v-spacer></v-spacer>
      <v-btn @click="handleJoin()">{{ $t("session.Join")}}</v-btn>
    </div>
  </v-sheet>
</template>

<script>
  import router from '@/router';

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
      async handleJoin() {
        await router.push({
          name: 'menu.SessionRouted',
          params: { idSession: this.session.idSession },
        });
      },
    },
  };
</script>

<style scoped></style>
