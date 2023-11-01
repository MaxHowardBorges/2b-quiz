<template>
  <v-tabs
    :selected-class="!vertical ? 'text-primary' : ''"
    grow="true"
    :direction="vertical ? 'vertical' : 'horizontal'"
    :bg-color="!vertical ? 'secondary' : ''"
    :class="!vertical ? 'align-self-center' : ''">
    <page-menu-item
      :show-tabs="showTabs"
      :vertical="vertical"
      content="Home"
      to="/"
      @toggle-tabs="toggleTabs"></page-menu-item>
    <page-menu-item
      :show-tabs="showTabs"
      :vertical="vertical"
      content="Teacher Menu"
      to="/teacher-home-page"
      @toggle-tabs="toggleTabs"></page-menu-item>
  </v-tabs>
</template>

<script>
  import PageMenuItem from '@/components/layout/PageMenuItem.vue';

  export default {
    name: 'PageMenu',
    components: { PageMenuItem },
    props: {
      vertical: false,
      showTabs: Boolean,
      withToggleTabs: false,
    },
    methods: {
      toggleTabs() {
        this.$emit('toggle-tabs');
      },
    },
  };
</script>

<style scoped></style>
