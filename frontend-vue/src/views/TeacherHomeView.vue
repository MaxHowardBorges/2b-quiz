<template>
  <div class="endof-session">
    <MenuTeacher/>
  </div>
</template>

<script>
  // @ is an alias to /src
  import MenuTeacher from '@/components/MenuTeacher.vue'

  export default {
    name: 'MenuTeacherView',
    components: {
      MenuTeacher
    }
  }
</script>
