<template>

  <ListOFGroup></ListOFGroup>
</template>

<script>

  import ListOFGroup from '@/components/group/ListOFGroup.vue';
  import { useUserStore } from '@/stores/userStore';
  export default {
    name: 'GroupView',
    components: { ListOFGroup },

  }
</script>



<style scoped>

</style>