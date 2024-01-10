<script setup>
  import { ref } from 'vue';

  const showMCQ = ref(false);
  const showtf = ref(false);

  function changeColor(x) {
    var buttons = document.getElementsByClassName('validate2');
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].style.background = '#605E73'; // Réinitialise la couleur de fond de tous les boutons
    }
    buttons[x].style.background = '#f1dc66';
    this.style['background'] = '#f1dc66';
  }

  function displayq(x) {
    var truefalsetype = document.getElementsByClassName('truefalse');
    var multitype = document.getElementsByClassName('multiple');
    if (x === 1) {
      truefalsetype.style.display = none;
      multitype.style.display = contents;
    }
    if (x === 2) {
      truefalsetype.style.display = none;
      multitype.style.display = none;
    }
    if (x === 3) {
      truefalsetype.style.display = contents;
      multitype.style.display = none;
    }
  }
</script>
$
<template>
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />

  <div class="teacher-interface">
    <h1>Quiz Creation</h1>

    <input
      id="QuizName"
      type="text"
      placeholder="Quiz name"
      v-model="QuizName"
      style="border: 1px solid #000000; margin-bottom: 20px" />

    <div>
      <button
        @click="
          showMCQ = true;
          showtf = false;
        "
        onclick="var buttons = document.getElementsByClassName('qtype');
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].style.background = '#605E73'; // Réinitialise la couleur de fond de tous les boutons
        }this.style['background']='#00afd7';"
        class="qtype"
        type="button">
        Multiple Choice question
      </button>
      <button
        @click="
          showtf = false;
          showMCQ = false;
        "
        onclick="var buttons = document.getElementsByClassName('qtype');
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].style.background = '#605E73'; // Réinitialise la couleur de fond de tous les boutons
        }this.style['background']='#00afd7';"
        class="qtype"
        type="button">
        Open question
      </button>
      <button
        @click="
          showtf = true;
          showMCQ = false;
        "
        onclick="var buttons = document.getElementsByClassName('qtype');
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].style.background = '#605E73'; // Réinitialise la couleur de fond de tous les boutons
        }this.style['background']='#00afd7';"
        style="margin-bottom: 20px"
        class="qtype"
        type="button">
        True/False question
      </button>
    </div>

    <div id="qna">
      <input
        id="Question"
        type="text"
        placeholder="Type you question"
        style="border: 1px solid #000000; margin-bottom: 20px; height: 50px" />

      <div class="multiple" v-show="showMCQ">
        <div id="icons">
          <button
            style="border: 0; background-color: transparent; cursor: pointer">
            <span class="material-symbols-outlined">remove</span>
          </button>
          <input
            id="Reponse"
            type="text"
            placeholder="Choice 1"
            style="border: 1px solid #000000; margin-bottom: 10px" />
          <button
            style="border: 0; background-color: transparent; cursor: pointer">
            <span class="material-symbols-outlined">
              radio_button_unchecked
            </span>
          </button>
        </div>
        <div id="icons">
          <button
            style="border: 0; background-color: transparent; cursor: pointer">
            <span class="material-symbols-outlined">remove</span>
          </button>
          <input
            id="Reponse"
            type="text"
            placeholder="Choice 2"
            style="border: 1px solid #000000; margin-bottom: 10px" />
          <button
            style="border: 0; background-color: transparent; cursor: pointer">
            <span class="material-symbols-outlined">
              radio_button_unchecked
            </span>
          </button>
        </div>
        <div id="icons">
          <button
            style="border: 0; background-color: transparent; cursor: pointer">
            <span class="material-symbols-outlined">remove</span>
          </button>
          <input
            id="Reponse"
            type="text"
            placeholder="Choice 3"
            style="border: 1px solid #000000; margin-bottom: 10px" />
          <button
            style="border: 0; background-color: transparent; cursor: pointer">
            <span id="check" class="material-symbols-outlined">
              radio_button_unchecked
            </span>
          </button>
        </div>
      </div>

      <div class="truefalse" v-show="showtf">
        <div style="display: flex; margin-bottom: 20px; margin-top: 20px">
          <button
            onclick="var buttons = document.getElementsByClassName('validate2');
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].style.background = '#605E73'; // Réinitialise la couleur de fond de tous les boutons
        }this.style['background']='#00afd7';"
            class="validate2"
            type="button">
            True
          </button>
          <button
            onclick="var buttons = document.getElementsByClassName('validate2');
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].style.background = '#605E73'; // Réinitialise la couleur de fond de tous les boutons
        }this.style['background']='#00afd7';"
            class="validate2"
            type="button">
            False
          </button>
        </div>
      </div>
    </div>

    <div><button class="validate" type="button">Create quiz</button></div>
  </div>
</template>

<style scoped>
  #check:before {
  }

  #check {
  }

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
    color: #00afd7; /* Couleur jaune */
  }

  input::placeholder {
    color: #5e6567;
    opacity: 50%;
    margin-left: 50%;
  }
  input:placeholder-shown {
    border: 1px solid #ffffff;
  }

  #qna {
    display: grid;
  }

  .validate {
    background-color: #00afd7;
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
    box-shadow:
      0 1px 3px rgba(0, 0, 0, 0.12),
      0 1px 2px rgba(0, 0, 0, 0.24);
  }

  .validate:hover {
    transform: scale(1.06);
    background-position: -60px;
    box-shadow:
      0 3px 6px rgba(0, 0, 0, 0.16),
      0 3px 6px rgba(0, 0, 0, 0.23);
  }

  .validate:active {
    transform: scale(1);
    background-position: 500px;
    box-shadow:
      0 1px 3px rgba(0, 0, 0, 0.12),
      0 1px 2px rgba(0, 0, 0, 0.24);
  }

  .validate2 {
    background-color: #605e73;
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
    box-shadow:
      0 1px 3px rgba(0, 0, 0, 0.12),
      0 1px 2px rgba(0, 0, 0, 0.24);
  }

  .validate2:hover {
    transform: scale(1.06);
    background-position: -60px;
    box-shadow:
      0 3px 6px rgba(0, 0, 0, 0.16),
      0 3px 6px rgba(0, 0, 0, 0.23);
  }

  .validate2:active {
    transform: scale(1);
    background-position: 500px;
    box-shadow:
      0 1px 3px rgba(0, 0, 0, 0.12),
      0 1px 2px rgba(0, 0, 0, 0.24);
  }

  .qtype {
    background-color: #605e73;
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
    box-shadow:
      0 1px 3px rgba(0, 0, 0, 0.12),
      0 1px 2px rgba(0, 0, 0, 0.24);
  }

  .qtype:hover {
    transform: scale(1.06);
    background-position: -60px;
    box-shadow:
      0 3px 6px rgba(0, 0, 0, 0.16),
      0 3px 6px rgba(0, 0, 0, 0.23);
  }

  .qtype:active {
    transform: scale(1);
    background-position: 500px;
    box-shadow:
      0 1px 3px rgba(0, 0, 0, 0.12),
      0 1px 2px rgba(0, 0, 0, 0.24);
  }

  .material-symbols-outlined {
    font-variation-settings:
      'FILL' 0,
      'wght' 400,
      'GRAD' 0,
      'opsz' 24;
  }

  #QuizName {
    width: 100%;
    padding: 12px 20px;
    margin: 8px 0;
    display: inline-block;
    border: 1px solid #5e6567;
    box-sizing: border-box;
  }

  #QuizName::placeholder {
    color: #007ea1;
    opacity: 50%;
    margin-left: 50%;
  }
</style>
