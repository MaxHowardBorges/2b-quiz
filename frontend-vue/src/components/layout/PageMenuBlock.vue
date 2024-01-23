<template>
  <v-tabs
    :selected-class="!vertical ? 'text-dark-color' : ''"
    grow=""
    :direction="vertical ? 'vertical' : 'horizontal'"
    :bg-color="!vertical ? 'transparent' : ''"
    :class="!vertical ? 'align-self-center' : ''">
    <template v-if="userStore.isAuthenticated && !userStore.isNotChoose">
      <page-menu-item
        v-for="page in getAllRoutes(userStore.userRole)"
        v-bind:key="page.name"
        :show-tabs="showTabs"
        :vertical="vertical"
        :content="page.name.toString()"
        :to="page.path"
        @toggle-tabs="toggleTabs"></page-menu-item>
    </template>
    <template v-if="!userStore.isAuthenticated || userStore.isNotChoose">
      <page-menu-item
        v-for="page in getPublicRoutes()"
        v-bind:key="page.name"
        :show-tabs="showTabs"
        :vertical="vertical"
        :content="page.name.toString()"
        :to="page.path"
        @toggle-tabs="toggleTabs"></page-menu-item>
    </template>
  </v-tabs>
</template>

<script>
  import PageMenuItem from '@/components/layout/PageMenuItem.vue';
  import { useUserStore } from '@/stores/userStore';
  import { getAllRoutes, getPublicRoutes } from '@/router/routerUtils';

  export default {
    name: 'PageMenuBlock',
    components: { PageMenuItem },
    setup() {
      const userStore = useUserStore();
      return {
        userStore,
      };
    },
    props: {
      vertical: Boolean || false,
      showTabs: Boolean,
      withToggleTabs: Boolean || false,
    },
    data() {
      return {
        pageList: [
          {
            link: '/',
            name: 'menu.home',
          },
          {
            link: '/questionary',
            name: 'menu.questionnary',
          },
          {
            link: '/teacher-home-page',
            name: 'menu.menuTeacher',
          },
        ],
      };
    },
    methods: {
      getAllRoutes,
      getPublicRoutes,
      toggleTabs() {
        this.$emit('toggle-tabs');
      },
    },
  };
</script>
