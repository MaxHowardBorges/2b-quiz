<template>
  <v-sheet
    max-width="1500px"
    rounded="lg"
    width="70%"
    class="mt-5 px-6 py-8 mx-auto"
    elevation="5"
  >
    <h1 class="text-h4 ma-5">List of groups</h1>
    <table class="w-full">
      <thead>
      <tr>
        <th class="text-center">Group name</th>
        <th class="text-center">Number of people</th>
        <th class="text-center">Actions</th>
      </tr>
      </thead>
      <tbody>
      <tr class="ma-2">
        <td class="text-center">2B QUIZ</td>
        <td class="text-center">7</td>
        <td class="text-center">
          <v-btn @click="" icon="adds"></v-btn>
          <v-btn @click="" icon="logout"></v-btn>
          <v-btn @click="" icon="delete"></v-btn>
        </td>
      </tr>
      <tr class="ma-2">
        <td class="text-center">2B QUIZ</td>
        <td class="text-center">7</td>
        <td class="text-center">
          <v-btn @click="" icon="add"></v-btn>
          <v-btn @click="" icon="logout"></v-btn>
          <v-btn @click="" icon="delete"></v-btn>
        </td>
      </tr>
      <tr class="ma-2">
        <td class="text-center">2B QUIZ</td>
        <td class="text-center">7</td>
        <td class="text-center">
          <v-btn @click="" icon="add"></v-btn>
          <v-btn @click="" icon="logout"></v-btn>
          <v-btn @click="" icon="delete"></v-btn>
        </td>
      </tr>
      </tbody>
    </table>

    <v-btn class="mt-5" color="primary">Create a group</v-btn>
  </v-sheet>
</template>

<script>

</script>

<style scoped>
  table {
    border-collapse: collapse;
    width: 100%;
  }

  th, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }

  th {
    background-color: #f2f2f2;
  }

  tr:hover {
    background-color: #f5f5f5;
  }

</style>