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
          <v-btn @click="openAdd" icon="add"></v-btn>
          <v-btn @click="openLeave" icon="logout"></v-btn>
          <v-btn @click="openDelete" icon="delete"></v-btn>
        </td>
      </tr>
      <tr class="ma-2">
        <td class="text-center">2B QUIZ</td>
        <td class="text-center">7</td>
        <td class="text-center">
          <v-btn @click="openAdd" icon="add"></v-btn>
          <v-btn @click="openLeave" icon="logout"></v-btn>
          <v-btn @click="openDelete" icon="delete"></v-btn>
        </td>
      </tr>
      <tr class="ma-2">
        <td class="text-center">2B QUIZ</td>
        <td class="text-center">7</td>
        <td class="text-center">
          <v-btn @click="openAdd " icon="add"></v-btn>
          <v-btn @click="openLeave" icon="logout"></v-btn>
          <v-btn @click="openDelete" icon="delete"></v-btn>
        </td>
      </tr>
      </tbody>
    </table>

    <v-dialog v-model="addDialog" max-width="500px">
      <v-card>
        <v-card-title>
          Add User
        </v-card-title>
        <v-card-actions>
          <v-btn @click="closeDialogs">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="leaveDialog" max-width="500px">
      <v-card>
        <v-card-title>
          Leave Group
        </v-card-title>
        <v-card-actions>
          <v-btn @click="closeDialogs">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="deleteDialog" max-width="500px">
      <v-card>
        <v-card-title>
          Delete Group
        </v-card-title>
        <v-card-text>Are you sure to delete this Group?</v-card-text>
        <v-card-actions>
          <v-btn @click="closeDialogs">Yes</v-btn>
          <v-btn @click="closeDialogs">No</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-btn class="mt-5" color="primary">Create a group</v-btn>
  </v-sheet>
</template>

<script>

  export default {
    data() {
      return {
        addDialog: false,
        leaveDialog: false,
        deleteDialog: false,
      };
    },
    methods: {
      openAdd() {
        this.addDialog = true;
      },
      openLeave() {
        this.leaveDialog = true;
      },
      openDelete() {
        this.deleteDialog = true;
      },
      closeDialogs() {
        this.addDialog = false;
        this.leaveDialog = false;
        this.deleteDialog = false;
      },
    },
  };

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