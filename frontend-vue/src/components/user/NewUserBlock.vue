<template>
  <v-sheet
    max-width="500px"
    rounded="lg"
    width="90%"
    class="mt-5 mb-8 px-9 py-8 mx-auto"
    elevation="5">
    <div class="pa-2">
      <p class="text-h2 mb-3">{{ $t('user.NewAccount') }}</p>
      <p class="text-p mb-3">
        {{ $t('user.FillYourInformationsAccordingToThe') }}
        <a class="text-secondary" target="_blank" href="" @click.stop>
          {{ $t('user.UtilisationConditions') }}
        </a>
        {{ $t('user.andThe') }}
        <a class="text-secondary" target="_blank" href="" @click.stop>
          {{ $t('user.PrivacyPolicy') }}
        </a>
      </p>
    </div>
    <new-user-form />
  </v-sheet>
</template>

<script>
  import NewUserForm from '@/components/user/NewUserForm.vue';

  export default {
    name: 'NewUserBlock',
    components: { NewUserForm },
  };
</script>

<style scoped></style>
