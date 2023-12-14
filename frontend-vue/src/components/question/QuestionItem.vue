<template>
    <div class="blocklist" @click="toggleDropdown"()>
      <b>Est-ce que Santiago a eu son code ?</b>
      <span class="spacer"></span>
      <span class="spacer"></span>
      <!--    <v-btn icon="play_arrow" @click='startQuestionnary'></v-btn>-->
      <v-btn icon="edit" @click=""></v-btn>
      <v-btn icon="delete" @click=""></v-btn>
    </div>
  <div class="dropdown" id="dropdown" v-show="showDropdown">
    <p>Oui</p>
    <br>
    <p>Non</p>
    <br>
    <p>Il est mort</p>
    <br>
    <p>Il a abandonné</p>
  </div>

</template>

<script setup>

  new Vue({
    el: '#app', // Remplacez par l'ID de votre instance Vue
    data: {
      showDropdown: false
    },
    methods: {
      toggleDropdown() {
        this.showDropdown = !this.showDropdown;
      }
    }
  });

</script>

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

  #dropdown {
    display: none;
    position: absolute;
    background-color: #f9f9f9;
    min-width: 160px;
    box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
    z-index: 1;
  }

  #dropdown a {
    color: black;
    padding: 12px 16px;
    text-decoration: none;
    display: block;
  }

  #dropdown a:hover {
    background-color: #f1f1f1;
  }
</style>