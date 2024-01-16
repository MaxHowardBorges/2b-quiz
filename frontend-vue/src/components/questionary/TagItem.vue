<template>
  <v-sheet elevation="5" rounded="lg" class="d-flex flex-column my-5 pa-3">
    <div>
      <input
        v-model="newTagName"
        type="text"
        style="margin-right: 10px"
        :placeholder="tag.description" />

      <v-btn
        id="ic"
        icon="edit"
        @click="updateTag"
        size="30"
        style="margin-right: 10px"></v-btn>
      <v-btn id="ic" icon="delete" size="30" @click="deleteTag"></v-btn>
    </div>
  </v-sheet>
</template>

<script>
  export default {
    name: 'TagItem',
    props: {
      tag: {
        type: Object,
        required: true,
      },
    },
    emits: ['updateTag', 'deleteTag'],
    data() {
      return {
        newTagName: '',
      };
    },
    methods: {
      updateTag() {
        this.$emit('updateTag', {
          idTag: this.tag.idTag,
          description: this.newTagName,
        });
      },
      deleteTag() {
        this.$emit('deleteTag', this.tag);
      },
    },
  };
</script>

<style scoped></style>
