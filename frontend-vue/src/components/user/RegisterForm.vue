<template>
  <v-form @submit.prevent="register">
    <v-text-field
      class="my-2"
      validate-on="input"
      v-model="name"
      type="text"
      id="name"
      required
      autocomplete="given-name"
      :rules="stringRules"
      label="First name"></v-text-field>
    <v-text-field
      class="my-2"
      validate-on="input"
      v-model="surname"
      type="text"
      id="surname"
      required
      autocomplete="family-name"
      :rules="stringRules"
      label="Last name"></v-text-field>
    <v-text-field
      class="my-2"
      validate-on="input"
      v-model="username"
      type="text"
      id="username"
      required
      autocomplete="username"
      :rules="stringRules"
      label="Username"></v-text-field>
    <v-radio-group
      class="my-2"
      validate-on="input"
      label="User type"
      v-model="accountType"
      :inline="$vuetify.display.mdAndUp"
      required>
      <v-radio
        direction="horizontal"
        :value="UserRoles.STUDENT"
        label="Student"></v-radio>
      <v-radio
        direction="horizontal"
        :value="UserRoles.TEACHER"
        label="Teacher"></v-radio>
      <v-radio
        direction="horizontal"
        :value="UserRoles.ADMIN"
        label="Admin"></v-radio>
    </v-radio-group>
    <v-btn color="primary" type="submit" class="my-2">
      <p class="text-white font-weight-bold">Register</p>
    </v-btn>
  </v-form>
</template>

<script>
  import { ref } from 'vue';
  import { UserRoles } from '@/utils/userRoles';
  import { useUserStore } from '@/stores/userStore';
  import ErrorSnackbar from '@/components/commun/ErrorSnackbar.vue';
  import { ValidationError } from '@/utils/valdiationError';

  export default {
    name: 'RegisterForm',
    components: { ErrorSnackbar },
    computed: {
      UserRoles() {
        return UserRoles;
      },
    },
    setup() {
      const userStore = useUserStore();
      return {
        userStore,
        stringRules: [
          (value) => {
            if (value?.length > 0) return true;
            return 'Required';
          },
        ],
        username: ref(''),
        accountType: ref('student'),
        surname: ref(''),
        name: ref(''),
      };
    },
    methods: {
      async register() {
        try {
          await this.userStore.register(
            this.name,
            this.surname,
            this.username,
            this.accountType,
          );
          this.$emit('user-registered', {
            username: this.username,
            name: this.name,
            surname: this.surname,
            accountType: this.accountType,
          });
        } catch (error) {
          if (error instanceof ValidationError) {
            this.$emit('error-register', this.username);
          } else this.$emit('error-register', error);
        }
      },
    },
  };
</script>

<style scoped></style>
