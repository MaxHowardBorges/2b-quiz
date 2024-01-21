<template>
  <v-form class="ma-2" @submit.prevent="submitValidation">
    <v-btn-toggle
      v-model="accountType"
      group
      mandatory
      class="h-auto mt-2 mb-4"
      color="primary-darken-1"
      max-width="300px"
      variant="outlined"
      rounded="lg"
      :divided="true">
      <v-btn :value="UserRoles.STUDENT" class="h-auto px-2 px-sm-3">
        <div class="w-100 h-100 mx-sm-3 mx-md-6 my-5 pa-md-4 text-sm-h5">
          <v-icon :size="$vuetify.display.mdAndUp ? 'xxx-large' : 'x-large'">
            school
          </v-icon>
          <p>Student</p>
        </div>
      </v-btn>
      <v-btn :value="UserRoles.TEACHER" class="h-auto px-2 px-sm-3">
        <div class="w-100 h-100 mx-sm-3 mx-md-6 my-5 pa-md-4 text-sm-h5">
          <v-icon :size="$vuetify.display.mdAndUp ? 'xxx-large' : 'x-large'">
            menu_book
          </v-icon>
          <p>Teacher</p>
        </div>
      </v-btn>
    </v-btn-toggle>
    <v-alert
      class="my-4 text-justify"
      color="info"
      type="info"
      variant="tonal"
      v-if="accountType === UserRoles.TEACHER">
      You'll have to wait for an admin to validate your account
    </v-alert>
    <v-text-field
      class="my-2"
      validate-on="input"
      v-model="name"
      type="text"
      id="name"
      required
      autocomplete="given-name"
      :rules="stringRules"
      label="First name" />
    <v-text-field
      class="my-2"
      validate-on="input"
      v-model="surname"
      type="text"
      id="surname"
      required
      autocomplete="family-name"
      :rules="stringRules"
      label="Last name" />
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
    <v-btn
      type="submit"
      block=""
      class="mt-2"
      color="primary"
      :loading="loading">
      <p class="text-white font-weight-bold">Validate account</p>
    </v-btn>
  </v-form>
</template>

<script>
  import { ref } from 'vue';
  import { useUserStore } from '@/stores/userStore';
  import { UserRoles } from '@/utils/userRoles';

  export default {
    name: 'NewUserForm',
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
        checkConditionsRules: [
          (value) => {
            if (value) return true;
            return 'Conditions must read and accepted';
          },
        ],
        accountType: ref(UserRoles.STUDENT),
        surname: ref(''),
        name: ref(''),
        loading: ref(false),
      };
    },
    methods: {
      submitValidation() {
        try {
          this.userStore.validateSelf(
            this.name,
            this.surname,
            this.accountType,
          );
        } catch (e) {
          this.userStore.forceLogout();
        }
      },
    },
  };
</script>

<style scoped></style>
