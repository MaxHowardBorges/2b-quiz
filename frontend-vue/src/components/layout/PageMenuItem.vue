<template>
  <v-tab
    :to="to"
    @click="toggleTabs"
    :class="vertical ? 'text-h5' : ''"
    :height="vertical ? '54px' : ''">
    {{ content }}
  </v-tab>
</template>

<script>
  export default {
    name: 'PageMenuItem',
    props: {
      vertical: false,
      showTabs: Boolean,
      content: String,
      to: String,
    },
    methods: {
      toggleTabs() {
        this.$emit('toggle-tabs');
      },
    },
  };
</script>

<style scoped></style>
