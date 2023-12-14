<script>
  import { useUserStore } from '@/stores/userStore';
  import { ref } from 'vue';
  import TableSortSwitchButton from '@/components/commun/TableSortSwitchButton.vue';

  export default {
    components: { TableSortSwitchButton },
    data() {
      return {
        sortId: ref(null),
        sortName: ref(null),
        sortSurname: ref(null),
        sortUsername: ref(null),
        sortType: ref(null),
        sortValidate: ref(null),
        nbItemsOptions: [10, 20, 50, 100],
        indexpage: ref(1),
        itemsPerPage: ref(10),
      };
    },
    setup() {
      const userStore = useUserStore();
      return {
        users: ref([]),
        nbPage: ref(1),
        userStore,
      };
    },
    async mounted() {
      await this.loadUser();
    },
    computed: {
      pageOptions() {
        return Array.from({ length: this.nbPage }, (_, index) => index + 1);
      },
    },
    methods: {
      async loadUser() {
        const data = await this.userStore.getUsers(
          this.indexpage,
          this.itemsPerPage,
        );
        this.users = data.userList;
        this.nbPage = data.nbPage;
      },
      async nextPage() {
        this.indexpage++;
        await this.loadUser();
      },
      async prevPage() {
        this.indexpage--;
        await this.loadUser();
      },
      async loadUserW() {
        await this.userStore.getUsers(this.indexpage, this.itemsPerPage);
        console.log('test', this.indexpage, this.itemsPerPage);
      },
      saveValue(key, value) {
        this.sortId = null;
        this.sortName = null;
        this.sortSurname = null;
        this.sortUsername = null;
        this.sortType = null;
        this.sortValidate = null;
        this.$refs.sortId.sorted = null;
        this.$refs.sortName.sorted = null;
        this.$refs.sortSurname.sorted = null;
        this.$refs.sortUsername.sorted = null;
        this.$refs.sortType.sorted = null;
        if (key === 'sortId') {
          this.sortId = value;
          this.$refs.sortId.sorted = value;
        } else if (key === 'sortName') {
          this.sortName = value;
          this.$refs.sortName.sorted = value;
        } else if (key === 'sortSurname') {
          this.sortSurname = value;
          this.$refs.sortSurname.sorted = value;
        } else if (key === 'sortUsername') {
          this.sortUsername = value;
          this.$refs.sortUsername.sorted = value;
        } else if (key === 'sortType') {
          this.sortType = value;
          this.$refs.sortType.sorted = value;
        } else if (key === 'sortValidate') {
          this.sortValidate = value;
        }
      },
    },
  };
</script>

<template>
  <v-sheet
    class="pa-5 d-block w-100"
    elevation="3"
    rounded="lg"
    id="app"
    v-if="userStore.isAuthenticated && userStore.isAdmin">
    <v-sheet class="ma-2"></v-sheet>
    <v-data-iterator
      :items="users"
      :page="indexpage"
      :items-per-page="itemsPerPage">
      <template v-slot:header="{ page }">
        <div
          class="text-h4 font-weight-bold d-flex justify-space-between mb-4 align-center">
          <div class="text-truncate">List of Users</div>
        </div>
      </template>
      <template v-slot:default="{ items }">
        <v-fade-transition>
          <table>
            <thead>
              <tr>
                <v-hover>
                  <template v-slot:default="{ isHovering, props }">
                    <th v-bind="props">
                      ID
                      <table-sort-switch-button
                        ref="sortId"
                        :isHovered="isHovering"
                        @update-sorted="
                          (value) => saveValue('sortId', value)
                        " />
                    </th>
                  </template>
                </v-hover>
                <v-hover>
                  <template v-slot:default="{ isHovering, props }">
                    <th v-bind="props">
                      Username
                      <table-sort-switch-button
                        ref="sortUsername"
                        :isHovered="isHovering"
                        @update-sorted="
                          (value) => saveValue('sortUsername', value)
                        " />
                    </th>
                  </template>
                </v-hover>
                <v-hover>
                  <template v-slot:default="{ isHovering, props }">
                    <th v-bind="props">
                      Name
                      <table-sort-switch-button
                        ref="sortName"
                        :isHovered="isHovering"
                        @update-sorted="
                          (value) => saveValue('sortName', value)
                        " />
                    </th>
                  </template>
                </v-hover>
                <v-hover>
                  <template v-slot:default="{ isHovering, props }">
                    <th v-bind="props">
                      Surname
                      <table-sort-switch-button
                        ref="sortSurname"
                        :isHovered="isHovering"
                        @update-sorted="
                          (value) => saveValue('sortSurname', value)
                        " />
                    </th>
                  </template>
                </v-hover>
                <v-hover>
                  <template v-slot:default="{ isHovering, props }">
                    <th v-bind="props">
                      Type
                      <table-sort-switch-button
                        ref="sortType"
                        :isHovered="isHovering"
                        @update-sorted="
                          (value) => saveValue('sortType', value)
                        " />
                    </th>
                  </template>
                </v-hover>
              </tr>
            </thead>
            <tbody>
              <template v-for="(item, i) in items" :key="i">
                <tr
                  :class="
                    item.raw.validate
                      ? 'professeurs-valides'
                      : 'professeurs-attente'
                  ">
                  <td>{{ item.raw.id }}</td>
                  <td>{{ item.raw.username }}</td>
                  <td>{{ item.raw.name }}</td>
                  <td>{{ item.raw.surname }}</td>
                  <td>{{ item.raw.userType }}</td>
                </tr>
              </template>
            </tbody>
          </table>
        </v-fade-transition>
      </template>
      <template v-slot:footer="">
        <div class="d-flex align-sm-center justify-end pa-4">
          <div>Items per page:</div>
          <v-select
            class="mt-6 mx-2 flex-0-1"
            id="lineSelector"
            v-model="itemsPerPage"
            @update:modelValue="loadUser"
            density="compact"
            :items="nbItemsOptions"
            variant="outlined"></v-select>
          <div class="d-inline-flex">
            <div class="mx-2 my-auto">Page {{ indexpage }} of {{ nbPage }}</div>
            <v-btn
              :disabled="indexpage.valueOf() === 1"
              icon="arrow_back"
              variant="tonal"
              density="comfortable"
              @click="prevPage"></v-btn>
            <v-btn
              :disabled="indexpage >= nbPage"
              icon="arrow_forward"
              variant="tonal"
              density="comfortable"
              @click="nextPage"></v-btn>
          </div>
        </div>
      </template>
    </v-data-iterator>
  </v-sheet>
</template>

<style scoped>
  #app {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }

  h1 {
    font-size: 24px;
    margin-bottom: 20px;
    text-align: center;
  }

  h2 {
    font-size: 20px;
    margin-top: 20px;
    margin-bottom: 10px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    margin-bottom: 20px;
  }

  th,
  td {
    padding: 10px;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }

  th {
    background-color: #f2f2f2;
  }

  tbody tr:hover {
    background-color: #f0f0f0;
  }

  .professeurs-valides {
    background-color: #c9f7c5;
  }

  .professeurs-attente {
    background-color: #fce5cd;
  }
</style>
