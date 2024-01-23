<template>
  <v-footer
    height="90px"
    bg-opacity="0.2"
    color="#007EA1"
    elevation="5"
    class="bg-gradiant">
    <div>
      <p class="logo">{{ $t('layout.LogoText')}}</p>
      <p>
        2023 -
        <strong>Équipe 2b</strong>
      </p>
    </div>
  </v-footer>
</template>

<script>
  export default {
    name: 'FooterBlock',
  };
</script>

<style scoped>
  div {
    width: 100%;
    align-items: center;
  }
  p {
    text-align: center;
  }
  .logo {
    font-size: xx-large;
  }
</style>
