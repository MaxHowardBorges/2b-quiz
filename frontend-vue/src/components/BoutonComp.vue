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
    min-height: 40px; /* Augmentation de la hauteur pour un meilleur aspect */
    border: none; /* Suppression de la bordure */
    border-radius: 8px; /* Coins arrondis */
    background-color: #f6c70a;
    padding: 12px 24px; /* Réduction de la taille du texte pour un aspect équilibré */
    margin: 10px 5px; /* Espacement des boutons */
    font-size: 16px; /* Réduction de la taille de la police */
    font-weight: 500; /* Police plus audacieuse */
    color: #0a0808; /* Couleur du texte */
    cursor: pointer;
    transition: background-color 0.3s ease; /* Transition en douceur pour le changement de couleur de fond */
  }

  /* Style de survol */
  .custom-button:hover {
    background-color: #ffdb4d; /* Couleur différente au survol */
  }
</style>


