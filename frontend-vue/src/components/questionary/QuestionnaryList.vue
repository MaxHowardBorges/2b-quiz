<script>
  export default {
    props: {
      numberLabel: { type: String, default: 'N°' },
      typeLabel: { type: String, default: 'type' }
    },
  }
</script>

<template>
  <div class='blocklist'>
    <b>{{ numberLabel }}</b>
    <span class="spacer"></span>
    <b>{{ typeLabel }}</b>
    <span class="spacer"></span>
    <v-btn icon="edit"></v-btn>
  </div>
</template>

<style scoped>
  .blocklist {
    display: flex;
    align-items: center;
    padding: 15px;
    border: 1px solid #ddd;
    margin-bottom: 15px;
  }

  .blocklist b {
    margin-right: 20px;
  }

  .blocklist .spacer {
    flex: 1;
  }

  .blocklist v-btn {
    margin-left: 20px;
  }
</style>
