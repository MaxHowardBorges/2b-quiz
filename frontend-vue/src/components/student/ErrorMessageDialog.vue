<template>
  <div class="error-dialog">
    <div class="dialog-content">
      <h2>Erreur</h2>
      <p>{{ errorMessage }}</p>
      <button @click="closeDialog">Fermer</button>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      errorMessage: String,
      onClose: Function,
    },
    methods: {
      closeDialog() {
        this.onClose();
      },
    },
  };
</script>

<style scoped>
  /* Styles pour le dialogue d'erreur */
  .error-dialog {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .dialog-content {
    background: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    text-align: center;
  }

  button {
    margin-top: 10px;
  }
</style>
