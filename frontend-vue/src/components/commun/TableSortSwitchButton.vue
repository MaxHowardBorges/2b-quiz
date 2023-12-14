<template>
  <span>
    <v-btn
      variant="text"
      density="compact"
      :color="isHovered && sorted === null ? 'grey' : ''"
      :icon="getIcon()"
      @click="switchSort"></v-btn>
  </span>
</template>

<script>
  export default {
    name: 'TableSortSwitchButton',
    props: {
      isHovered: Boolean,
    },
    data: () => ({
      sorted: null,
    }),
    methods: {
      getIcon() {
        if (
          this.sorted === true ||
          (this.isHovered === true && this.sorted === null)
        ) {
          return 'arrow_upward_alt';
        } else if (this.sorted === false) {
          return 'arrow_downward_alt';
        } else {
          return '';
        }
      },
      switchSort() {
        if (this.sorted === null) {
          this.sorted = true;
        } else if (this.sorted === true) {
          this.sorted = false;
        } else {
          this.sorted = null;
        }
        this.$emit('update-sorted', this.sorted);
      },
    },
  };
</script>

<style scoped></style>
