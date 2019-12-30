<template>
  <div>
    <b-table
      :items="users"
      :fields="tableFields"
      striped
      hover
    >
      <template slot="edit" slot-scope="row">
        <b-button
          @click="onEditUser(row.item)"
          variant="outline-success">
          {{ $t(`common.edit`) }}
        </b-button>
        <b-button
          @click="showConfirm(row.item.userId)"
          variant="outline-danger ml-2"
        >
          {{ $t(`common.remove`) }}
        </b-button>
      </template>
      <template slot="role" slot-scope="row">
        {{ $t(`users.roles.${row.value}`) }}
      </template>
      <template slot="state" slot-scope="row">
        {{ row.value ? $t(`users.states.${row.value}`) : '' }}
      </template>
      <!-- <template slot="groups" slot-scope="row">
        {{ row.value.join(', ') }}
      </template> -->
      <template slot="accessState" slot-scope="row"> <!-- TODO: понять что это такое, не понимаю -->
        {{ $t(`users.accessStates.${row.value}`) }}
      </template>
    </b-table>
    <div class="text-right">
      <b-button
        @click="onAddUser"
        v-b-modal.addUser
        class="pull-right"
        size="lg"
        variant="success"
      >
        {{ $t(`users.add`) }}
      </b-button>
    </div>
    <settings-users-form
      :title="$t(`users.add`)"
      name="addUser"
      @submit="onCreate"
    />
    <settings-users-form
      :title="$t(`users.edit`)"
      :form-errors="formErrors"
      :data="form"
      name="editUser"
      @submit="onUpdate"
      edit-mode
    />

    <confirm-modal
      :title="$t(`users.remove`)"
      :message="$t(`users.remove_message`)"
      @confirm="onConfirmRemove"
    />

  </div>
</template>

<script>
  import { mapActions } from 'vuex'
  import SettingsUsersForm from './SettingsUsersForm'
  import ConfirmModal from 'main_components/ui/ConfirmModal'

  export default {
    name: 'SettingsUsersTable',
    components: {
      SettingsUsersForm,
      ConfirmModal
    },
    props: {
      users: {
        type: Array,
        default: () => ([])
      }
    },
    data: () => ({
      form: null,
      isCreate: false,
      removeUserId: null,
      formErrors: []
    }),
    computed: {
      tableFields () {
        return [
          {
            key: 'id',
            label: this.$t(`users.id`)
          },
          {
            key: 'name',
            label: this.$t(`users.full_name`)
          },
          {
            key: 'email',
            label: this.$t(`users.email`)
          },
          {
            key: 'role',
            label: this.$t(`users.role`)
          },
          {
            key: 'aliasName',
            label: this.$t(`users.alias_name`)
          },
          // {
          //   key: 'groups',
          //   label: this.$t(`users.groups`)
          // },
          {
            key: 'state',
            label: this.$t(`__old__.access_state`)
          },
          {
            key: 'edit',
            label: ''
          }
        ]
      }
    },
    methods: {
      ...mapActions('backend', ['addUser', 'updateUser', 'deleteUser']),
      showConfirm (userId) {
        this.removeUserId = userId
        this.$root.$emit('bv::show::modal', 'confirmModal')
      },
      onConfirmRemove () {
        if (this.removeUserId) {
          this.deleteUser(this.removeUserId)
        }
        this.removeUserId = null
      },
      async onCreate (data) {
        try {
          this.formErrors = []
          this.addUser(data).then(res => {
            this.$emit('update')
            this.$root.$emit('bv::hide::modal', 'addUser')
          }).catch(({ error }) => {
            Object.keys(error.data).forEach(key => {
              error.data[key].forEach(message => {
                this.formErrors.push(message)
              })
            })
          })
        } catch (e) {
          console.log('Error:', e)
        }
      },
      onUpdate (data) {
        this.formErrors = []
        this.updateUser(data).then(res => {
          this.$root.$emit('bv::hide::modal', 'editUser')
        }).catch(({ error }) => {
          Object.keys(error.data).forEach(key => {
            error.data[key].forEach(message => {
              this.formErrors.push(message)
            })
          })
        })
      },
      onEditUser (user) {
        this.formErrors = []
        this.form = JSON.parse(JSON.stringify(user))
        this.$root.$emit('bv::show::modal', 'editUser')
      },
      onAddUser () {
        this.formErrors = []
        this.$root.$emit('bv::show::modal', 'addUser')
      }
    }
  }
</script>
