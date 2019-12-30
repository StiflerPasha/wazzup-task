<template>
  <b-card
    :title="$t(`integrations.common.integrations`)"
  >
    <template v-if="integrations.length > 0 && !pending">
      <b-table class="mt-4 mb-4" :items="integration_views" :fields="fields">
        <template slot="delete" slot-scope="row">
          <b-button @click="delete_integration(row.value)" variant="danger">
            {{ $t(`__old__.integrations_delete`) }}
          </b-button>
        </template>
        <template v-for="channel in channels" :slot="channel.guid" slot-scope="row">
          <div :key="channel.guid" style="justify-content: center">
            <b-form-checkbox disabled
                             v-if="row.value.type === 'multi'"
                             :checked="row.value.value">
            </b-form-checkbox>
            <b-form-radio disabled
                          v-if="row.value.type === 'one'"
                          :value="true"
                          :checked="true">
            </b-form-radio>
          </div>
        </template>
      </b-table>
      <b-button v-b-modal.integration_add_new style="float: right" size="lg" variant="success">{{ $t(`common.add`) }}</b-button>
    </template>
    <div v-else-if="!pending" class="integrations">
        {{ $t(`integrations.common.missing`) }}<br>
      <b-button v-b-modal.integration_add_new style="margin-top: 20px" size="lg" variant="success">{{ $t(`common.add`) }}</b-button>
    </div>
    <preloader v-else></preloader>
    <b-modal id="integration_add_new" hide-footer ref="integration_ref" :title="$t(`integrations.common.create_new`)">
      <b-btn class="mt-4 mb-3" variant="outline-success" size="lg" block @click="openIntegrationSteps('amocrm')">amoCRM</b-btn>
      <b-btn class="mt-4 mb-3" variant="outline-success" size="lg" block @click="openIntegrationSteps('bitrix24')">Bitrix24</b-btn>
      <b-btn class="mt-4 mb-3" variant="outline-success" size="lg" block @click="openIntegrationSteps('planfix')">planfix</b-btn>
    </b-modal>
    <div :is="chosed" :isOpen="chosed" @hide="chosed = ''" v-if="chosed">
    </div>
    <b-modal hide-footer hide-header ref="delete_integration">
      <span class="mt-4 mb-4">
        {{ $t(`integrations.common.delete_sure`) }}
      </span>
      <div style="padding: 30px 0 0; float: right">
        <b-btn @click="delete_integration_accept()" variant="danger">{{ $t(`common.delete`) }}</b-btn>
        <b-btn @click="$refs.delete_integration.hide()" variant="info">{{ $t(`common.cancel`) }}</b-btn>
      </div>
    </b-modal>
  </b-card>
</template>

<script>
  import amocrm from './amocrm.vue'
  import bitrix24 from './bitrix24.vue'
  import planfix from './planfix.vue'
  export default {
    data: () => ({
      chosed: '',
      deleteGuid: ''
    }),
    components: {
      amocrm,
      bitrix24,
      planfix
    },
    props: ['pending'],
    computed: {
      integrations () {
        return this.$store.getters['backend/integrations']
      },
      fields () {
        const arr = [
          {
            key: 'login',
            label: this.$t(`__old__.table_integrations_login`)
          },
          {
            key: 'state',
            label: this.$t(`__old__.table_integrations_state`)
          }
        ]
        for (const guid in this.channels) {
          arr.push({
            key: guid,
            label: this.channels[guid].name
          })
        }
        arr.push({
          key: 'delete',
          label: ''
        })
        return arr
      },
      integration_views () {
        let array = []
        for (const key in this.integrations) {
          const integratgion = this.integrations[key]
          const knownStates = {
            'active': true,
            'init': true,
            'paused': true,
            'error': true,
            'initError': true
          }
          const object = {
            login: integratgion.domain,
            state: knownStates[integratgion.state] ? this.$t(`__old__.integrations_${integratgion.state}`) : this.$t(`__old__.integrations_unknown`),
            channels: integratgion.channel ? [integratgion.channel] : Object.keys(this.channels),
            delete: integratgion.guid
          }
          if ((integratgion.type === 'amocrm_v2') || (integratgion.type === 'amocrm')) {
            object.login += `  (${this.$t(`integrations.amocrm.widgets.${integratgion.type === 'amocrm_v2' ? 'ext' : 'standart'}`)})`
          }
          for (const guid in this.channels) {
            object[guid] = {
              type: integratgion.channel ? 'one' : 'multi',
              value: true
            }
          }
          array.push(object)
        }
        array = array.reduce((arr, item) => {
          arr.push(item)
          return arr
        }, [])
        return array
      },
      channels () {
        return this.$store.getters['backend/channels']
      }
    },
    methods: {
      delete_integration (guid) {
        this.deleteGuid = guid
        this.$refs.delete_integration.show()
      },
      delete_integration_accept () {
        this.$refs.delete_integration.hide()
        this.$store.dispatch('backend/delete_integration', this.deleteGuid)
          .then(() => {
            this.$a.push({
              type: 'success',
              text: this.$t(`integrations.common.delete`)
            })
            this.deleteGuid = ''
          })
          .catch(e => {
            this.deleteGuid = ''
            this.$a.push({
              type: 'danger',
              text: this.$t(`errors.common.something_wrong`)
            })
          })
      },
      openIntegrationSteps (chosed) {
        this.chosed = chosed
        this.$refs.integration_ref.hide()
      }
    }
  }
</script>

<style>
  .integrations {
    text-align: center;
    font-size: 2rem;
    padding: 30px 0;
  }
</style>
