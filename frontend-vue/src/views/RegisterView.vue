<template>
  <v-sheet
    max-width="500px"
    rounded="lg"
    width="70%"
    class="mt-5 mb-8 px-6 py-8 mx-auto"
    elevation="5">
    <p class="text-lg-h2 text-sm-h3 text-h4 mb-5">Register</p>
    <register-form />
  </v-sheet>
</template>

<script>
  import RegisterForm from '@/components/user/RegisterForm.vue';

  export default {
    name: 'RegisterView',
    components: { RegisterForm },
  };
</script>

<style scoped></style>
