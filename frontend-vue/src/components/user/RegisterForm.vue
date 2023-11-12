<template>
  <v-form fast-fail @submit.prevent="register">
    <v-text-field
      v-model="name"
      type="text"
      id="name"
      autocomplete="given-name"
      :rules="stringRules"
      label="First name"></v-text-field>
    <v-text-field
      v-model="surname"
      type="text"
      id="surname"
      autocomplete="family-name"
      :rules="stringRules"
      label="Last name"></v-text-field>
    <v-text-field
      v-model="username"
      type="text"
      id="username"
      autocomplete="username"
      :rules="stringRules"
      label="Username"></v-text-field>
    <v-text-field
      v-model="password"
      :type="passwordVisibility ? 'text' : 'password'"
      id="password"
      label="Password"
      autocomplete="new-password"
      :rules="passwordRules"
      :append-inner-icon="passwordVisibility ? 'visibility' : 'visibility_off'"
      @click:append-inner="togglePasswordVisibility"></v-text-field>
    <v-text-field
      v-model="confirmPassword"
      :type="confirmPasswordVisibility ? 'text' : 'password'"
      id="password-confirmation"
      label="Password confirmation"
      autocomplete="new-password"
      :append-inner-icon="
        confirmPasswordVisibility ? 'visibility' : 'visibility_off'
      "
      @click:append-inner="toggleConfirmPasswordVisibility"></v-text-field>
    <v-radio-group label="User type" :inline="$vuetify.display.mdAndUp">
      <v-radio
        direction="horizontal"
        v-model="accountType"
        :value="UserRoles.STUDENT"
        label="Student"></v-radio>
      <v-radio
        direction="horizontal"
        v-model="accountType"
        :value="UserRoles.TEACHER"
        label="Teacher"></v-radio>
    </v-radio-group>
    <v-btn color="primary" type="submit">
      <p class="text-white font-weight-bold">Register</p>
    </v-btn>
  </v-form>
</template>

<script>
  import { ref } from 'vue';
  import { UserRoles } from '@/utils/userRoles';

  export default {
    name: 'RegisterForm',
    computed: {
      UserRoles() {
        return UserRoles;
      },
    },
    setup() {
      return {
        stringRules: [
          (value) => {
            if (value?.length > 0) return true;
            return 'Required';
          },
        ],
        passwordRules: [
          (value) => {
            const regex =
              /^((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).{8,}$/;
            if (value?.match(regex)) return true;

            let content = 'Password must';
            let containError = [];

            const regexUpLetter = /^(?=.*[A-Z]).*$/;
            if (!value?.match(regexUpLetter))
              containError.push('1 uppercase letter');

            const regexLoLetter = /^(?=.*[a-z]).*$/;
            if (!value?.match(regexLoLetter))
              containError.push('1 lowercase letter');

            const regexNbSp = /^((?=.*\d)|(?=.*\W+)).*$/;
            if (!value?.match(regexNbSp))
              containError.push('1 number or 1 non-word character');

            const regexLength = /^.{8,}$/;
            if (!value?.match(regexLength)) {
              if (containError.length > 0)
                content += ' be at least 8 characters long and';
              else content += ' be at least 8 characters long';
            }
            if (containError.length > 0) content += ' contain';
            let i = 0;
            for (i; i < containError.length - 1; i++) {
              content += ' ' + containError[i] + ', ';
            }
            if (containError.length > 1)
              content = content.slice(0, content.length - 2) + ' and';
            if (containError.length > 0) content += ' ' + containError[i];

            return content;
          },
        ],
        passwordConfirmRules: [
          (value) => {
            if (value === this.password) return true;
            return 'Password confirmation mus match password';
          },
        ],
        username: ref(''),
        password: ref(''),
        confirmPassword: ref(''),
        accountType: '',
        surname: ref(''),
        name: ref(''),
        passwordVisibility: ref(false),
        confirmPasswordVisibility: ref(false),
      };
    },
    methods: {
      register() {
        console.log('Registration form submitted');
      },
      togglePasswordVisibility() {
        this.passwordVisibility = !this.passwordVisibility;
      },
      toggleConfirmPasswordVisibility() {
        this.confirmPasswordVisibility = !this.confirmPasswordVisibility;
      },
    },
  };
</script>

<style scoped></style>
