<template>
  <v-dialog v-model="dialog" persistent width="auto">
    <v-card>
      <v-card-title class="text-h5">
        Restore User {{ user.username }}
      </v-card-title>
      <v-card-text>
        <v-text-field v-model="name" label="Name" />
        <v-text-field v-model="surname" label="Surname" />
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" variant="text" @click="close">{{ this.$t('admin.close') }}</v-btn>
        <v-btn color="success" variant="text" @click="save">{{ this.$t('admin.save') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    name: 'RestoreUserDialog',
    props: {
      user: null,
    },
    data: () => ({
      dialog: false,
      name: '',
      surname: '',
    }),
    methods: {
      close() {
        this.dialog = false;
        this.$emit('close');
      },
      save() {
        this.$emit('save', {
          id: this.user.id,
          name: this.name,
          surname: this.surname,
        });
        this.dialog = false;
      },
    },
  };
</script>

<style scoped></style>
