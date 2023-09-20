<template>
  <button class="custom-button">
    {{ nomB }}
  </button>
</template>

<script>
  export default {
    name: 'BoutonComp',
    props: {
      nomB: String,
    },
  };
</script>

<style scoped>
  .custom-button {
    min-height: 20px;
    border-radius: 4px;
    background-color: #f6c70a;
    padding: 16px 32px;
    margin: 5px;
    font-size: 19px;
    transition: background-color 0.3s ease; /* Ajoute une transition sur le changement de couleur de fond */
  }

  /* Style de survol */
  .custom-button:hover {
    background-color: #ffdb4d; /* Couleur différente au survol */
  }
</style>
