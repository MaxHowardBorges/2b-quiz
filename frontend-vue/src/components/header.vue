<template>
  <v-app-bar
    prominent
    v-resize="getVS"
    :elevation="8"
    color="secondary"
    :sroll-behavior="!mdAndUp ? 'collapse' : ''">
    <template v-slot:prepend>
      <v-btn v-if="!mdAndUp" @click="toggleTabs" icon="menu"></v-btn>
    </template>
    <v-toolbar-title>Two Bee Quizz</v-toolbar-title>
    <template v-if="mdAndUp" v-slot:extension>
      <v-tabs
        v-if="mdAndUp"
        color="primary"
        bg-color="secondary"
        class="align-self-center">
        <v-tab to="/">Home</v-tab>
        <v-tab to="/teacher-home-page">Teacher Page</v-tab>
      </v-tabs>
    </template>

    <template v-slot:append>
      <v-btn icon="dark_mode" @click="toggleTheme" class=""></v-btn>
    </template>
  </v-app-bar>
  <div id="header_space"></div>
  <div id="header_space_extend" v-if="mdAndUp"></div>
  <Transition>
    <v-card
      width="100%"
      height="100%"
      v-if="!mdAndUp && showTabs"
      class="mt-16"
      position="fixed">
      <v-tabs v-if="showTabs" direction="vertical" class="hidden-xs-only">
        <v-tab to="/" @click="toggleTabs" class="text-h5" height="54px">
          Home
        </v-tab>
        <v-tab
          to="/teacher-home-page"
          @click="toggleTabs"
          class="text-h5"
          height="54px">
          Teacher Page
        </v-tab>
      </v-tabs>
    </v-card>
  </Transition>
</template>

<script>
  import { ref } from 'vue';

  export default {
    name: 'Header',
    setup() {
      return {
        mdAndUp: ref(true),
        showTabs: ref(false),
      };
    },
    methods: {
      toggleTabs() {
        this.showTabs = !this.showTabs;
      },
      toggleTheme() {
        console.log(this.$vuetify.theme.themes);
        this.$vuetify.theme.global.name = this.$vuetify.theme.global.current
          .dark
          ? 'lightTheme'
          : 'darkTheme';
      },
      getVS() {
        this.mdAndUp = this.$vuetify.display.mdAndUp;
      },
    },
  };
</script>

<style scoped>
  #header_space {
    height: 64px;
  }
  #header_space_extend {
    height: 48px;
  }

  .v-enter-active,
  .v-leave-active {
    transition: opacity 0.5s ease;
  }

  .v-enter-from,
  .v-leave-to {
    opacity: 0;
  }
</style>
