<template>
  <v-tabs
    :selected-class="!vertical ? 'text-primary' : ''"
    grow=""
    :direction="vertical ? 'vertical' : 'horizontal'"
    :bg-color="!vertical ? 'secondary' : ''"
    :class="!vertical ? 'align-self-center' : ''">
    <page-menu-item
      v-for="page in pageList"
      :show-tabs="showTabs"
      :vertical="vertical"
      :content="page.name"
      :to="page.link"
      @toggle-tabs="toggleTabs"></page-menu-item>
  </v-tabs>
</template>

<script>
  import PageMenuItem from '@/components/layout/PageMenuItem.vue';

  export default {
    name: 'PageMenuBlock',
    components: { PageMenuItem },
    props: {
      vertical: false,
      showTabs: Boolean,
      withToggleTabs: false,
    },
    data() {
      return {
        pageList: [
          {
            link: '/',
            name: 'Home',
          },
          {
            link: '/questionary',
            name: 'Questionnary',
          },
          {
            link: '/teacher-home-page',
            name: 'Teacher Menu',
          },
        ],
      };
    },
    methods: {
      toggleTabs() {
        this.$emit('toggle-tabs');
      },
    },
  };
</script>

<style scoped></style>
