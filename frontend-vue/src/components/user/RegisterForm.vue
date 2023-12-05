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
    <v-text-field
      class="my-2"
      validate-on="input"
      v-model="password"
      :type="passwordVisibility ? 'text' : 'password'"
      id="password"
      label="Password"
      required
      autocomplete="new-password"
      :rules="passwordRules"
      :append-inner-icon="passwordVisibility ? 'visibility' : 'visibility_off'"
      @click:append-inner="togglePasswordVisibility"></v-text-field>
    <v-text-field
      class="my-2"
      validate-on="submit"
      v-model="confirmPassword"
      :type="confirmPasswordVisibility ? 'text' : 'password'"
      id="password-confirmation"
      label="Password confirmation"
      required
      autocomplete="new-password"
      :append-inner-icon="
        confirmPasswordVisibility ? 'visibility' : 'visibility_off'
      "
      :rules="passwordConfirmRules"
      @click:append-inner="toggleConfirmPasswordVisibility"></v-text-field>
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
    </v-radio-group>
    <v-checkbox validate-on="submit" :rules="checkConditionsRules" class="my-2">
      <template v-slot:label>
        <p class="text-left">
          I confirm that I read and accept the
          <a class="text-secondary" target="_blank" href="" @click.stop>
            Utilisation conditions
          </a>
          and the
          <a class="text-secondary" target="_blank" href="" @click.stop>
            Privacy policy
          </a>
        </p>
      </template>
    </v-checkbox>
    <v-btn color="primary" type="submit" class="my-2">
      <p class="text-white font-weight-bold">Register</p>
    </v-btn>
  </v-form>
</template>

<script>
  import { ref } from 'vue';
  import { UserRoles } from '@/utils/userRoles';
  import { useUserStore } from '@/stores/userStore';
  import router from '@/router';

  export default {
    name: 'RegisterForm',
    computed: {
      UserRoles() {
        return UserRoles;
      },
      passwordConfirmRules() {
        return [
          (value) => {
            if (this.compareInputs(value, this.password)) return true;
            return 'Password confirmation must match password';
          },
        ];
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
        passwordRules: [
          (value) => {
            const regex =
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            if (value?.match(regex)) return true;

            const regexInvalidChar = /[^A-Za-z\d@$!%*?&]/;
            if (value && regexInvalidChar.test(value))
              return 'Special character only can be @, $, !, %, *, ?, &';

            let content = 'Password must';
            let containError = [];

            const regexUpLetter = /^(?=.*[A-Z]).*$/;
            if (!value?.match(regexUpLetter))
              containError.push('1 uppercase letter');

            const regexLoLetter = /^(?=.*[a-z]).*$/;
            if (!value?.match(regexLoLetter))
              containError.push('1 lowercase letter');

            const regexNbSp = /^(?=.*\d).*$/;
            if (!value?.match(regexNbSp)) containError.push('1 number');

            const regexSp = /^(?=.*[@$!%*?&]).*$/;
            if (!value?.match(regexSp))
              containError.push('1 special character (@,$,!,%,*,?,&)');

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
        checkConditionsRules: [
          (value) => {
            if (value) return true;
            return 'Conditions must read and accepted';
          },
        ],
        username: ref(''),
        password: ref(''),
        confirmPassword: ref(''),
        accountType: ref('student'),
        surname: ref(''),
        name: ref(''),
        passwordVisibility: ref(false),
        confirmPasswordVisibility: ref(false),
      };
    },
    methods: {
      compareInputs(input1, input2) {
        return input1 === input2;
      },
      async register() {
        try {
          await this.userStore.register(
            this.name,
            this.surname,
            this.username,
            this.password,
            this.confirmPassword,
            this.accountType,
          );
          await router.push({ name: 'Login' });
        } catch (error) {
          this.$emit('error-register', error);
        }
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
