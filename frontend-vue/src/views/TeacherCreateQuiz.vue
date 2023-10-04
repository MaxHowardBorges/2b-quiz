<template>
  <div class="teacher-interface">
    <h1>Création d'un questionnaire</h1>

    <input
      id="QuizName"
      type="text"
      placeholder="Nom du questionnaire"
      v-model="QuizName"
      style="border: 1px solid #000000;margin-bottom: 20px"   />

  <div style='margin-bottom: 40px'>
    <select id="typeInput" name="typeInput" class="input">
      <option>A choix multiples</option>
      <option>Ouverte</option>
      <option>Vrai/Faux</option>
    </select></div>
<div id='qna'>
    <input id='Question' type='text' placeholder='Entrez votre question' style="border: 1px solid #000000;margin-bottom: 20px;height:50px;"/>

    <input id='Reponse' type='text' placeholder='Choix 1' style="border: 1px solid #000000;margin-bottom: 10px"/>
    <input id='Reponse' type='text' placeholder='Choix 2' style="border: 1px solid #000000;margin-bottom: 10px"/>
</div>
  </div>





</template>

<script>

</script>




<style scoped>
  .teacher-interface {
    text-align: center;
    margin: 0 auto; /* Centrer horizontalement */
    max-width: 400px; /* Largeur maximale pour le contenu */
    background-color: rgb(255, 255, 255); /* Fond blanc */
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .teacher-interface h1 {
    font-size: 24px;
    margin-bottom: 20px;
    color: #FFD700; /* Couleur jaune */
  }

  input::placeholder {
    color: #5e6567;
    opacity: 50%;
    margin-left: 50%;
  }
  input:placeholder-shown {
    border: 1px solid #ffffff;
  }

  #qna{
    display: grid;
  }

</style>
