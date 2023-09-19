<template>
  <div class="endof-session">
    <img alt="Vue logo" src="../assets/logo.png" />
    <MenuEnseignant/>
  </div>
</template>

<script>
  // @ is an alias to /src
  import MenuEnseignant from '@/components/MenuEnseignant.vue'

  export default {
    name: 'MenuEnseignantView',
    components: {
      MenuEnseignant
    }
  }
</script>
