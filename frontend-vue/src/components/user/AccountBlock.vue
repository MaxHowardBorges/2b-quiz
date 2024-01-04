<template>
  <v-sheet
    max-width="750px"
    rounded="lg"
    width="90%"
    class="mt-5 px-6 py-8 mx-auto"
    elevation="5">
    <h1>USER PAGE</h1>

    <v-sheet border rounded="lg" class="pa-3 mx-auto my-4" max-width="600px">
      <div class="ma-2">
        <p>
          Username :
          <b>{{ this.user.username }}</b>
        </p>
      </div>
      <v-divider class="w-33 mx-auto"></v-divider>
      <div class="userinfo" v-if="!modification">
        <div class="ma-2">
          <p>
            Name :
            <b>{{ this.user.name }}</b>
          </p>
        </div>
        <v-divider class="w-33 mx-auto"></v-divider>
        <div class="ma-2">
          <p>
            Surname :
            <b>{{ this.user.surname }}</b>
          </p>
        </div>
      </div>
      <v-sheet v-else max-width="450px" class="mx-auto">
        <v-text-field
          variant="outlined"
          class="px-10 mt-5"
          label="name"
          v-model="this.user.name"></v-text-field>
        <v-divider class="w-33 mx-auto"></v-divider>
        <v-text-field
          variant="outlined"
          class="px-10 mt-5"
          label="name"
          v-model="this.user.surname"></v-text-field>
      </v-sheet>
      <v-divider class="w-33 mx-auto"></v-divider>
      <p class="ma-2">
        Status :
        <b>{{ userStore.userRole }}</b>
      </p>
    </v-sheet>

    <v-btn
      v-if="modification"
      class="mt-5"
      color="primary"
      @click="updateUserData">
      Validate
    </v-btn>
    <v-btn class="mt-5" color="primary" @click="modification = !modification">
      {{ modification ? 'Cancel' : 'Modify' }}
    </v-btn>
  </v-sheet>
</template>

<script>
  import { useUserStore } from '@/stores/userStore';
  import { ref } from 'vue';

  export default {
    name: 'AccountBlock',
    setup() {
      const userStore = useUserStore();
      return {
        userStore,
        user: ref({ username: '', name: '' }),
        name: ref('test'),
        modification: ref(false),
      };
    },
    async mounted() {
      this.user = await this.userStore.getSelf();
      console.log('user', this.user);
    },
    methods: {
      async updateUserData() {
        await this.userStore.updateSelf(this.user.name, this.user.surname);
        this.modification = false;
      },
    },
  };
</script>

<style scoped></style>
