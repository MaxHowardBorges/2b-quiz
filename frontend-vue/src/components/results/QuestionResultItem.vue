<script>
  export default {
    props: {
      answer: {
        type: String,
        required: true,
      },
    },
  };
</script>

<template>
  <v-card
    class="d-flex align-center pa-5"
    :class="isSelected ? 'selected-item' : ''"
    :disabled="disabled"
    min-height="20px"
    height="100%"
    width="48%"
    style="background-color: green">
    <v-scroll-y-transition>
      <div class="text-body-1 flex-grow-1 text-center" style="opacity: 1">
        <b>{{ answer }}</b>
      </div>
    </v-scroll-y-transition>
  </v-card>
</template>

<style scoped></style>
