<template>
  <v-item v-slot="{ isSelected, toggle }">
    <v-card
      :color="
        isSelected ? getAnswerItemColor(index) : getAnswerItemColor(index)
      "
      class="d-flex align-center pa-5"
      :class="isSelected ? 'selected-item' : ''"
      :disabled="disabled"
      min-height="20px"
      height="100%"
      @click="toggle">
      <v-scroll-y-transition>
        <div class="text-body-1 flex-grow-1 text-center" style="opacity: 1">
          {{ content }}
        </div>
      </v-scroll-y-transition>
    </v-card>
  </v-item>
</template>

<script>
  import { getAnswerItemColor } from '@/utils/sessionColors';

  export default {
    name: 'AnswerItem',
    methods: { getAnswerItemColor },
    props: {
      content: String,
      disabled: Boolean,
      index: Number,
    },
  };
</script>

<style scoped>
  .selected-item {
    box-shadow:
      inset 2px 2px 4px rgba(112, 110, 110, 0.64),
      inset 2px 3px 5px rgba(0, 0, 0, 0.3),
      0 1px 3px rgba(0, 0, 0, 0.12),
      0 1px 2px rgba(0, 0, 0, 0.24),
      inset -2px -3px 5px rgba(255, 255, 255, 0.5);
  }
</style>
