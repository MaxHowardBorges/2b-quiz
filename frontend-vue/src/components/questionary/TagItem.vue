<script>
  export default {
    name: 'TagItem',
    props: {
      tag: {
        type: Object,
        required: true,
      },
    },
  };
</script>

<template>
  <v-sheet elevation="5" rounded="lg" class="d-flex flex-column my-5 pa-3">
    <div>
      <input
        type="text"
        style="margin-right: 10px"
        :placeholder="tag.description" />

      <v-btn
        id="ic"
        icon="edit"
        @click="updateTags"
        size="30"
        style="margin-right: 10px"></v-btn>
      <v-btn id="ic" icon="delete" size="30"></v-btn>
    </div>
  </v-sheet>
</template>

<style scoped></style>
