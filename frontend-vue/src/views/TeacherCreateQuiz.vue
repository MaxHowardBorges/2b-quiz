<template>

  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />

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

  <div id='icons'><button style='border: 0;background-color: transparent;cursor:pointer;'><span class="material-symbols-outlined">
remove
</span></button><input id='Reponse' type='text' placeholder='Choix 1' style="border: 1px solid #000000;margin-bottom: 10px"/><button style='border: 0;background-color: transparent;cursor:pointer;'><span class="material-symbols-outlined">
radio_button_unchecked
</span></button></div>
  <div id='icons'><button style='border: 0;background-color: transparent;cursor:pointer;'><span class="material-symbols-outlined">
remove
</span></button><input id='Reponse' type='text' placeholder='Choix 2' style="border: 1px solid #000000;margin-bottom: 10px"/><button style='border: 0;background-color: transparent;cursor:pointer;'><span class="material-symbols-outlined">
radio_button_unchecked
</span></button></div>
  <div id='icons'><button style='border: 0;background-color: transparent;cursor:pointer;'><span class="material-symbols-outlined">
remove
</span></button><input id='Reponse' type='text' placeholder='Choix 3' style="border: 1px solid #000000;margin-bottom: 10px"/><button style='border: 0;background-color: transparent;cursor:pointer;'><span class="material-symbols-outlined">
radio_button_unchecked
</span></button></div>

</div>

    <div><button class="validate" type="button">Valider quiz</button></div>
  </div>





</template>

<script>

</script>




<style scoped>
  .teacher-interface {
    text-align: center;
    margin: 0 auto;
    max-width: 400px;
    background-color: rgb(255, 255, 255);
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


  .validate {
    background-color: #f1dc66;
    border: none;
    color: white;
    padding: 14px 20px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    border-radius: 8px;
    margin: 8px 0;
    font-size: 15px;
    cursor: pointer;
    width: 100%;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  }

  .validate:hover {
    transform: scale(1.06);
    background-position: -60px;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  }

  .validate:active {
    transform: scale(1);
    background-position: 500px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  }

   .material-symbols-outlined{
     font-variation-settings:
       'FILL' 0,
       'wght' 400,
       'GRAD' 0,
       'opsz' 24
   }

</style>
