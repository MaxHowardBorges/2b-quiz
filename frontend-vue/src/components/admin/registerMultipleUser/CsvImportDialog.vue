<template>
  <v-dialog v-model="importCsvDialog" max-width="600px">
    <template v-slot:activator="{ props }">
      <v-btn dark class="mb-2" v-bind="props">Import from CSV</v-btn>
    </template>
    <v-card class="pa-2">
      <v-card-title>
        <span> {{ $t('login.ImportCSV') }}</span>
      </v-card-title>
      <v-card-text>
        <v-alert color="info" icon="$info" class="mb-5 mx-5">
          <p class="mb-1">
            The csv file must contain a header with the following fields:
            <code class="text-dark-color">username,name,surname,userType</code>
            .
          </p>
          <p>
            The field
            <code>userType</code>
            must be one of the following values:
            <code class="text-dark-color">student,teacher,admin</code>
            .
          </p>
        </v-alert>
        <v-file-input
          v-model="csv"
          accept=".csv"
          label="Select CSV file"
          outlined
          dense
          placeholder="No file selected"></v-file-input>
        <div v-if="csv">
          <v-divider></v-divider>
          <p class="mb-2 mt-4">Preview of the file:</p>
          <v-sheet class="pa-3" max-height="500" rounded="lg" border>
            <pre class="overflow-auto">{{ getPreview() }}</pre>
          </v-sheet>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="text" @click="importCsvDialog = false">Cancel</v-btn>
        <!-- TODO: add close popup message -->
        <v-btn variant="text" @click="importCsv" :disabled="!(csv && csv[0])">
          Save
        </v-btn>
      </v-card-actions>
      <v-alert
        color="red"
        dismissible
        type="warning"
        v-if="error"
      > {{ error }} </v-alert>
    </v-card>
  </v-dialog>
  <v-alert
    color="green"
    dismissible
    type="success"
    v-if="succes"
  > {{ succes }} </v-alert>
</template>

<script>
  import { parseUserListCsv } from '@/utils/csvParser';

  export default {
    name: 'CsvImportDialog',
    data: () => ({
      importCsvDialog: false,
      csv: null,
      preview: '',
      succes: "",
      error: "",
    }),
    methods: {
      async importCsv() {
        console.log(this.csv[0]);
        try {
          const usersData = await parseUserListCsv(this.csv[0]);
          usersData.forEach((user) => {
            user.validate = true;
          });
          this.$emit('import-csv', usersData);
          this.importCsvDialog = false;
          this.succes = 'Fichier csv traité avec succes.';
          this.error = '';
        } catch (error) {
          console.log(error);
          this.succes = '';
          this.error = 'Problème avec le fichier csv .';
        }
      },
      getPreview() {
        //return the content of the csv file
        const file = this.csv[0];
        const reader = new FileReader();
        if (!file) return;
        //read csv file for preview with Line Feed
        reader.onload = (e) => {
          const text = e.target.result;
          const lines = text.split(/[\r\n]/);
          console.log(lines);
          this.preview = lines.slice(0, 5).join('\n');
        };
        reader.readAsText(file);
        return this.preview;
      },
    },
  };
</script>

<style scoped></style>
