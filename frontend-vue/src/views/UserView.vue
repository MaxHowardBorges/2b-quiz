<template>

  <AccountBlock></AccountBlock>

</template>

<script>

  import { useUserStore } from '@/stores/userStore';
  import AccountBlock from '@/components/user/AccountBlock.vue';
  import { ref } from 'vue';

  export default {
    name: 'UserView',
    components: { AccountBlock },

  }

</script>

<style scoped>

</style>