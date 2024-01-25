<template>
  <v-tab
    :to="to"
    @click="toggleTabs"
    :class="vertical ? 'text-h5' : ''"
    :height="vertical ? '54px' : ''">
    {{ $t(content) }}
  </v-tab>
</template>

<script>
  export default {
    name: 'PageMenuItem',
    props: {
      vertical: { type: Boolean, default: false },
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
