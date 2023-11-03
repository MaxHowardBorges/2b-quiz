<template>
  <menu-teacher :dialog-error="dialogError" :error-snackbar="errorSnackbar" />
</template>

<script>
  // @ is an alias to /src
  import MenuTeacher from '@/components/home/MenuTeacherBlock.vue';

  export default {
    name: 'TeacherHomeView',
    components: {
      MenuTeacher,
    },
    props: {
      dialogError: false,
      errorSnackbar: false,
    },
  };
</script>
