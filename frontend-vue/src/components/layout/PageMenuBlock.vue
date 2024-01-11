<template>
  <v-tabs
    :selected-class="!vertical ? 'text-primary' : ''"
    grow=""
    :direction="vertical ? 'vertical' : 'horizontal'"
    :bg-color="!vertical ? 'dark-color' : ''"
    :class="!vertical ? 'align-self-center' : ''">
    <page-menu-item
      v-if="userStore.isAuthenticated && !userStore.isNotChoose"
      v-for="page in getAllRoutes()"
      :show-tabs="showTabs"
      :vertical="vertical"
      :content="page.name.toString()"
      :to="page.path"
      @toggle-tabs="toggleTabs"></page-menu-item>
    <page-menu-item
      v-if="!userStore.isAuthenticated || userStore.isNotChoose"
      v-for="page in getPublicRoutes()"
      :show-tabs="showTabs"
      :vertical="vertical"
      :content="page.name.toString()"
      :to="page.path"
      @toggle-tabs="toggleTabs"></page-menu-item>
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
      vertical: false,
      showTabs: Boolean,
      withToggleTabs: false,
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