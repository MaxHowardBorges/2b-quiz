<template>
  <v-dialog v-model="importCsvDialog" max-width="600px">
    <template v-slot:activator="{ props }">
      <v-btn dark class="mb-2" v-bind="props">{{ $t('login.ImportFromCSV') }}</v-btn>
    </template>
    <v-card class="pa-2">
      <v-card-title>
        <span> {{ $t('login.ImportCSV') }}</span>
      </v-card-title>
      <v-card-text>
        <v-alert color="info" icon="$info" class="mb-5 mx-5">
          <p class="mb-1">
            {{ $t('login.CSVContaint') }} :
            <code class="text-dark-color">username,name,surname,userType</code>
            .
          </p>
          <p>
            {{ $t('login.Field') }}
            <code>userType</code>
            {{ $t('login.values') }} :
            <code class="text-dark-color">student,teacher,admin</code>
            .
          </p>
        </v-alert>
        <v-file-input
          v-model="csv"
          accept=".csv"
          :label="$t('login.SelectCSV')"
          outlined
          dense
          :placeholder="$t('login.NoFile')"></v-file-input>
        <div v-if="csv">
          <v-divider></v-divider>
          <p class="mb-2 mt-4">{{ $t('login.Preview') }}:</p>
          <v-sheet class="pa-3" max-height="500" rounded="lg" border>
            <pre class="overflow-auto">{{ getPreview() }}</pre>
          </v-sheet>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="text" @click="importCsvDialog = false">{{ $t('user.cancel') }}</v-btn>
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
        try {
          const usersData = await parseUserListCsv(this.csv[0]);
          usersData.forEach((user) => {
            user.validate = true;
          });
          this.$emit('import-csv', usersData);
          this.importCsvDialog = false;
          this.succes = this.$t('login.Preview');
          this.error = '';
        } catch (error) {
          this.succes = '';
          this.error = this.$t('login.FileError');
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
          this.preview = lines.slice(0, 5).join('\n');
        };
        reader.readAsText(file);
        return this.preview;
      },
    },
  };
</script>

<style scoped></style>
