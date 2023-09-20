<template>
  <div class="endof-session">
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
