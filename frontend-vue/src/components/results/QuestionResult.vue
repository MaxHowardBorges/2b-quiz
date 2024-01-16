<script setup>
  import QuestionBlock from '@/components/question/QuestionBlock.vue';
  import AnswerItem from '@/components/question/AnswerItem.vue';
</script>

<template>
  <div>
    <v-sheet border rounded="lg" class="pa-3 mx-auto my-4" max-width="70%">
      <v-card-title>
        <div class="text-h5 text-center" style="white-space: normal">
          <p style="margin-bottom: 25px">Est-ce que Elias est arabe ?</p>
        </div>
      </v-card-title>
      <div style="display: flex">
        <v-card
          class="d-flex align-center pa-5"
          :class="isSelected ? 'selected-item' : ''"
          :disabled="disabled"
          min-height="20px"
          height="100%"
          width="50%"
          @click="toggle">
          <v-scroll-y-transition>
            <div class="text-body-1 flex-grow-1 text-center" style="opacity: 1">
              xxxxxxx
            </div>
          </v-scroll-y-transition>
        </v-card>
        <v-card
          class="d-flex align-center pa-5"
          :class="isSelected ? 'selected-item' : ''"
          :disabled="disabled"
          min-height="20px"
          height="100%"
          width="50%"
          @click="toggle">
          <v-scroll-y-transition>
            <div class="text-body-1 flex-grow-1 text-center" style="opacity: 1">
              xxxxxxx
            </div>
          </v-scroll-y-transition>
        </v-card>
      </div>
      <div style="display: flex">
        <v-card
          class="d-flex align-center pa-5"
          :class="isSelected ? 'selected-item' : ''"
          :disabled="disabled"
          min-height="20px"
          height="100%"
          width="50%"
          @click="toggle">
          <v-scroll-y-transition>
            <div class="text-body-1 flex-grow-1 text-center" style="opacity: 1">
              xxxxxxx
            </div>
          </v-scroll-y-transition>
        </v-card>
        <v-card
          class="d-flex align-center pa-5"
          :class="isSelected ? 'selected-item' : ''"
          :disabled="disabled"
          min-height="20px"
          height="100%"
          width="50%"
          @click="toggle">
          <v-scroll-y-transition>
            <div class="text-body-1 flex-grow-1 text-center" style="opacity: 1">
              xxxxxxx
            </div>
          </v-scroll-y-transition>
        </v-card>
      </div>
      <div style="margin-top: 20px">Résultats : 9/20</div>
    </v-sheet>
    <v-btn></v-btn>
  </div>
</template>

<style scoped></style>
