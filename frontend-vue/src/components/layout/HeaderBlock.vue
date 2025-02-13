<template>
  <v-app-bar
    prominent
    v-resize="getVS"
    :elevation="8"
    color="primary"
    class="bg-gradiant"
    :sroll-behavior="!mdAndUp ? 'collapse' : ''">
    <template v-slot:prepend>
      <v-btn
        @click="toggleTabs"
        :icon="
          !mdAndUp && userStore.isAuthenticated && !sessionStore.isDisplay
            ? 'menu'
            : ''
        "
        :disabled="
          mdAndUp ||
          !userStore.isAuthenticated ||
          sessionStore.idSession !== null
        "></v-btn>
      <v-btn icon="" disabled=""></v-btn>
      <v-btn v-if="userStore.isAuthenticated" icon="" disabled=""></v-btn>
    </template>

    <div class="logo ma-2 pa-2">{{ $t('layout.LogoText') }}</div>

    <template
      v-if="
        mdAndUp &&
        userStore.isAuthenticated &&
        this.sessionStore.idSession === null
      "
      v-slot:extension>
      <page-menu-block />
    </template>

    <template v-slot:append>
      <v-btn icon="dark_mode" @click="toggleTheme" class=""></v-btn>
      <v-btn icon="translate" @click="showLanguageList"></v-btn>
      <v-dialog v-model="showTranslation" max-width="500">
        <v-card>
          <v-card-title>{{ $t('menu.translationListTitle') }}</v-card-title>
          <v-card-text>
            <v-list
              v-for="(language, index) in this.$i18n.availableLocales"
              :key="index">
              <v-list-item @click="toggleLocale(language)">
                <v-list-item-title>
                  {{
                    $t('locale', 'language', {
                      locale: language,
                    })
                  }}
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-btn
        v-if="userStore.isAuthenticated && !sessionStore.isDisplay"
        icon="logout"
        @click="toggleLogout"></v-btn>
    </template>
  </v-app-bar>

  <v-expand-transition>
    <div id="header_space"></div>
  </v-expand-transition>
  <v-expand-transition>
    <div
      id="header_space_extend"
      v-if="mdAndUp || !userStore.isAuthenticated"></div>
  </v-expand-transition>

  <v-scroll-y-transition>
    <v-card
      width="100%"
      height="100%"
      v-if="
        !mdAndUp &&
        showTabs &&
        userStore.isAuthenticated &&
        !this.sessionStore.isInSession
      "
      class="mt-16 z-3"
      position="fixed">
      <page-menu-block
        v-if="showMenus"
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
  import { useUserStore } from '@/stores/userStore';
  import { useSessionStore } from '@/stores/sessionStore';

  export default {
    name: 'HeaderBlock',
    components: { PageMenuBlock },
    setup() {
      const userStore = useUserStore();
      const sessionStore = useSessionStore();
      return {
        sessionStore,
        userStore,
        mdAndUp: ref(true),
        showTabs: ref(false),
        showTranslation: ref(false),
      };
    },
    methods: {
      showMenus() {
        return (
          this.userStore.isAuthenticated && this.sessionStore.idSession === null
        );
      },
      toggleTabs() {
        this.showTabs = !this.showTabs;
      },
      toggleTheme() {
        this.$vuetify.theme.global.name = this.$vuetify.theme.global.current
          .dark
          ? 'lightTheme'
          : 'darkTheme';
      },
      toggleLogout() {
        this.userStore.selfLogout();
      },
      getVS() {
        this.showTabs = false;
        this.mdAndUp = this.$vuetify.display.mdAndUp;
      },
      showLanguageList() {
        this.showTranslation = !this.showTranslation;
      },
      toggleLocale(language) {
        this.$i18n.locale = language;
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
