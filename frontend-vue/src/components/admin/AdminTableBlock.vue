<template>
  <confirmation-dialog
    ref="confirmationDialog"
    :title="confirmationDialogContent"
    :content="confirmationDialogTextCaption"
    @confirm="deleteConfirmation"
    @cancel="echoUserToRemove = null"></confirmation-dialog>
  <RestoreUserDialog
    ref="restoreUserDialog"
    :user="userToRestore"
    @cancel="userToRestore = null"
    @save="restoreConfirmUser"></RestoreUserDialog>
  <v-data-iterator
    :items="users"
    :page="indexPage"
    :items-per-page="itemsPerPage">
    <template v-slot:header="">
      <div
        class="text-h4 font-weight-bold d-flex justify-space-between mb-4 align-center">
        <div class="text-h3">{{ this.$t('admin.ListUsers') }}</div>
        <v-spacer></v-spacer>
        <v-switch
          color="primary"
          @update:model-value="updateIsDeletedUsers"
          :label="isDeletedUsers ? 'Deleted Users' : 'Users'"></v-switch>
        <div>
          <v-btn
            @click="$emit('add-user')"
            class="ml-2"
            icon="person_add"></v-btn>
          <v-btn
            @click="$emit('add-multiple-user')"
            class="ml-2"
            icon="group_add"></v-btn>
        </div>
      </div>
    </template>
    <template v-slot:default="{ items }">
      <v-fade-transition>
        <v-sheet elevation="2" rounded="lg">
          <v-table class="mb-0 h-75" :hover="true">
            <admin-table-header-block
              @update-sorting="updateSorting"
              :isDeletedUsers="isDeletedUsers" />
            <tbody v-if="!loading">
              <template v-for="item in items">
                <admin-list-item
                  :isDeletedUsers="isDeletedUsers"
                  :user="item.raw"
                  @validate-user="validateUser"
                  @remove-user="deleteUser"
                  @soft-delete-user="softDeleteUser"
                  @restore-user="restoreUser"
                  @reject-request="rejectRequest" />
              </template>
            </tbody>
          </v-table>
        </v-sheet>
      </v-fade-transition>
      <v-progress-linear
        :indeterminate="true"
        v-if="loading"></v-progress-linear>
    </template>
    <template v-slot:footer="">
      <div class="d-flex align-sm-center justify-end pa-4">
        <div>{{ this.$t('admin.ItemsPerPage') }}:</div>
        <v-select
          class="mt-6 mx-2 flex-0-1"
          id="lineSelector"
          v-model="itemsPerPage"
          @update:modelValue="loadUser"
          density="compact"
          :items="nbItemsOptions"
          variant="outlined"></v-select>
        <div class="d-inline-flex">
          <div class="mx-2 my-auto">{{ this.$t('admin.Page') }} {{ indexPage }} {{ this.$t('admin.of') }} {{ nbPage }}</div>
          <v-btn
            :disabled="indexPage.valueOf() === 1"
            icon="arrow_back"
            variant="tonal"
            density="comfortable"
            @click="prevPage"></v-btn>
          <v-btn
            :disabled="indexPage >= nbPage"
            icon="arrow_forward"
            variant="tonal"
            density="comfortable"
            @click="nextPage"></v-btn>
        </div>
      </div>
    </template>
  </v-data-iterator>
</template>

<script>
  import AdminTableHeaderBlock from '@/components/admin/AdminTableHeaderBlock.vue';
  import AdminListItem from '@/components/admin/AdminListItem.vue';
  import { ref } from 'vue';
  import { useUserStore } from '@/stores/userStore';
  import ConfirmationDialog from '@/components/commun/ConfirmationDialog.vue';
  import RestoreUserDialog from '@/components/admin/RestoreUserDialog.vue';

  export default {
    name: 'AdminTableBlock',
    components: {
      RestoreUserDialog,
      ConfirmationDialog,
      AdminListItem,
      AdminTableHeaderBlock,
    },

    data() {
      return {
        confirmationDialogContent:
        this.$t('admin.SureDeleteUser'),
        confirmationDialogTextCaption:
          this.$t('admin.ActionIrreversible'),
        loading: ref(false),
        sorting: {
          id: null,
          username: null,
          name: null,
          surname: null,
          type: null,
          validate: null,
        },
        nbItemsOptions: [10, 20, 50, 100],
        indexPage: 1,
        itemsPerPage: 10,
        isDeletedUsers: false,
        echoUserToRemove: null,
        userToRestore: null,
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
    methods: {
      async loadUser() {
        this.loading = true;
        const data = await this.userStore.getUsers(
          this.indexPage,
          this.itemsPerPage,
          this.isDeletedUsers,
          this.getActiveSort(),
        );
        this.users = data.userList;
        this.nbPage = data.nbPage;
        setTimeout(() => {
          this.loading = false;
        }, 100);
      },
      async nextPage() {
        this.indexPage++;
        await this.loadUser();
      },
      async prevPage() {
        this.indexPage--;
        await this.loadUser();
      },
      async updateSorting(newSorting) {
        this.sorting = newSorting;
        await this.loadUser();
      },
      getOrder(value) {
        return value ? 'ASC' : 'DESC';
      },
      getActiveSort() {
        let activeSort = null;
        for (const key in this.sorting) {
          if (this.sorting[key] !== null) {
            activeSort = {
              field: key,
              order: this.getOrder(this.sorting[key]),
            };
          }
        }
        return activeSort;
      },
      async validateUser(id) {
        await this.userStore.validateUser(id);
        await this.loadUser();
      },
      async deleteUser(id) {
        this.echoUserToRemove = id;
        this.confirmationDialogTextCaption =
          this.$t('admin.ActionIrreversible'),
        this.confirmationDialogContent =
          this.$t('admin.SureDeleteUser');
        this.$refs.confirmationDialog.dialog = true;
      },
      async softDeleteUser(id) {
        this.echoUserToRemove = id;
        this.confirmationDialogTextCaption =
          this.$t('admin.AnonymizeAction');
        this.confirmationDialogContent =
          this.$t('admin.SureDeleteUser');
        this.$refs.confirmationDialog.dialog = true;
      },
      async deleteConfirmation() {
        try {
          await this.userStore.deleteUser(this.echoUserToRemove);
        } catch (error) {
          this.$emit('error-delete', this.echoUserToRemove);
        }
        this.echoUserToRemove = null;
        await this.loadUser();
      },
      async updateIsDeletedUsers(value) {
        this.isDeletedUsers = value;
        await this.loadUser();
      },
      async restoreUser(id) {
        this.userToRestore = this.users.find((user) => user.id === id);
        this.$refs.restoreUserDialog.dialog = true;
      },
      async restoreConfirmUser(user) {
        const body = {
          name: user.name,
          surname: user.surname,
        };
        try {
          await this.userStore.restoreUser(this.userToRestore.id, body);
        } catch (error) {
          this.$emit('error-restore', this.userToRestore.id);
        }
        await this.loadUser();
      },
      async rejectRequest(id) {
        try {
          await this.userStore.rejectRequest(id);
        } catch (error) {
          this.$emit('error-reject', id);
        }
        await this.loadUser();
      },
    },
    emits: [
      'add-user',
      'add-multiple-user',
      'error-restore',
      'error-delete',
      'error-reject',
    ],
  };
</script>

<style scoped></style>
