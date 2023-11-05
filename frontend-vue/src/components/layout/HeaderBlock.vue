<template>
  <v-app-bar
    prominent
    v-resize="getVS"
    :elevation="8"
    color="secondary"
    :sroll-behavior="!mdAndUp ? 'collapse' : ''">
    <template v-slot:prepend>
      <v-btn
        @click="toggleTabs"
        :icon="!mdAndUp ? 'menu' : ''"
        :disabled="mdAndUp"></v-btn>
      <v-btn icon="" disabled=""></v-btn>
      <v-btn icon="" disabled=""></v-btn>
    </template>

    <div class="logo ma-2 pa-2">Two Bee Quizz</div>

    <template v-if="mdAndUp" v-slot:extension>
      <page-menu-block />
    </template>

    <template v-slot:append>
      <v-btn icon="dark_mode" @click="toggleTheme" class=""></v-btn>
      <v-btn icon="translate" @click="toggleLocale"></v-btn>
      <v-btn icon="logout" @click="toggleLogout"></v-btn>
    </template>
  </v-app-bar>

  <v-expand-transition>
    <div id="header_space"></div>
  </v-expand-transition>
  <v-expand-transition>
    <div id="header_space_extend" v-if="mdAndUp"></div>
  </v-expand-transition>

  <v-scroll-y-transition>
    <v-card
      width="100%"
      height="100%"
      v-if="!mdAndUp && showTabs"
      class="mt-16 z-3"
      position="fixed">
      <page-menu-block
        :vertical="true"
        :show-tabs="showTabs"
        :with-toggle-tabs="true"
        @toggle-tabs="toggleTabs" />
    </v-card>
  </v-scroll-y-transition>
</template>

<script>
  import { ref } from 'vue';
  import PageMenuBlock from '@/components/layout/PageMenuBlock.vue';
  import router from '@/router';

  export default {
    name: 'HeaderBlock',
    components: { PageMenuBlock },
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
      toggleLogout() {
        // TODO a lier avec le back
        router.push('/');
      },
      getVS() {
        this.mdAndUp = this.$vuetify.display.mdAndUp;
      },
      toggleLocale() {
        const id = this.$i18n.availableLocales.findIndex(
          (locale) => locale === this.$i18n.locale,
        );
        this.$i18n.locale =
          this.$i18n.availableLocales[
            (id + 1) % this.$i18n.availableLocales.length
          ];
      },
    },
  };
</script>

<style scoped>
  #header_space {
    height: 64px;
    flex: none;
  }
  #header_space_extend {
    height: 48px;
    flex: none;
  }

  .logo {
    font-size: xx-large;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
