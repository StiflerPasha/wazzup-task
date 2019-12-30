<template>
  <div>
    <client-form ref="addClientForm">
    </client-form>
    <client-success-add-form ref="clientSuccessAddForm">
    </client-success-add-form>
    <div class="text-right">
      <b-button
        @click="onAddClient"
        v-b-modal.addClient
        class="pull-right"
        size="lg"
        variant="success"
        style="margin-top: 20px; margin-bottom: 20px;"
      >
        {{ $t(`clients.add`) }}
      </b-button>
    </div>
    <b-table :items="clients" :fields="tableFields" striped hover>
      <template slot="createdAt" slot-scope="row">
        {{ $f.dt(row.item.createdAt, 'DD.MM.YYYY') }}
      </template>
      <template slot="accountId" slot-scope="row">
        <!-- TODO: временно, надо аккаунт тянуть из апи -->
        <a :href="`https://new${row.item.accountId}.wazzup24.com`" target="_blank">{{ $f.accId(row.item.accountId) }}</a>
      </template>
    </b-table>
  </div>
</template>

<script>
  import { mapActions } from 'vuex'
  import ClientForm from './components/ClientForm.vue'
  import ClientSuccessAddForm from './components/ClientSuccessAddForm.vue'

  export default {
    name: 'AffiliateClientsTable',
    components: {
      ClientForm,
      ClientSuccessAddForm
    },
    data: () => ({
    }),
    created () {
      this.getClients()
    },
    computed: {
      clients () {
        return this.$store.getters['backend/clients']
      },
      tableFields () {
        return [
          {
            key: 'createdAt',
            label: this.$t(`clients.date`)
          },
          {
            key: 'accountId',
            label: this.$t(`clients.id`)
          },
          {
            key: 'name',
            label: this.$t(`clients.name`)
          },
          {
            key: 'balance',
            label: this.$t(`clients.balance`)
          },
          {
            key: 'task',
            label: this.$t(`clients.task`)
          }
        ]
      }
    },
    methods: {
      ...mapActions('backend', ['getClients']),
      onAddClient () {
        this.$refs.addClientForm.$refs.client_add_modal.show()
      }
    }
  }
</script>
