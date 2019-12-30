<template>
  <b-modal id="integrations_planfix" hide-footer ref="modal"
           @hidden="hidden" title="AmoCRM">
    <template v-if="!totalPending && !error">
      <template v-if="stage === 1">
        <label for="domaoin">{{ $t(`integrations.amocrm.full_domen`) }}</label>
        <b-form-input id="domaoin"
                      ref="modal_input"
                      v-model.trim="domain"
                      focused
                      class="mb-3"
                      :placeholder="$t(`integrations.bitrix.example`)"
                      type="text"></b-form-input>
        <label for="clientId">{{ $t(`integrations.amocrm.login`) }}</label>
        <b-form-input id="clientId"
                      ref="modal_input"
                      v-model.trim="login"
                      focused
                      class="mb-3"
                      :placeholder="$t(`integrations.amocrm.login_example`)"
                      type="text"></b-form-input>
        <label for="clientSecret">{{ $t(`integrations.amocrm.api`) }}</label>
        <b-form-input id="clientSecret"
                      ref="modal_input"
                      v-model.trim="apikey"
                      focused
                      :placeholder="$t(`integrations.amocrm.api_example`)"
                      type="text"></b-form-input>
      </template>
      <template v-if="stage === 2">
        <span class="mb-3">
          {{ $t(`integrations.amocrm.kstati`) }}
        </span>
        <br>
        <br>
        <span class="mb-3">
          {{ $t(`integrations.amocrm.please`) }}
        </span>
        <b-form-radio-group class="mt-4 mb-4"
                            v-model="selectedChoise"
                            :options="choiseOptions"
                            stacked
                            name="radiosStacked">
        </b-form-radio-group>
      </template>
      <template v-if="stage === 4">
        <span class="mb-4">
          {{ $t(`integrations.amocrm.stages.4.question`) }}
        </span>
        <b-form-radio-group class="mt-4 mb-4"
                            v-model="selectedTariff"
                            :options="tariffOptions"
                            stacked
                            name="radiosStacked">
        </b-form-radio-group>
        <span>
          {{ $t(`integrations.amocrm.stages.4.warning`) }}
        </span>
      </template>
      <template v-if="stage === 5">
        <template v-if="Object.keys(channels).length === 0">
          <span class="mb-4">
            {{ $t(`integrations.amocrm.stages.5.channels_missing_text`) }}
            <b-btn v-if="!error" class="mt-4 mb-1" variant="success" size="lg" block
                   @click="$router.push({
                    name: 'settings-channels',
                    params: {
                      app: 'settings',
                      type: 'channels'
                    }
                   })">{{ $t(`integrations.amocrm.stages.5.channels_missing_button`) }}
            </b-btn>
          </span>
        </template>
      </template>
      <template v-if="stage === 6">
        <span class="mb-4">
          {{ $t(`integrations.amocrm.stages.6.text`) }}
        </span>
        <b-form-radio-group class="mt-4 mb-4"
                            v-model="selectedChannel"
                            :options="channelsRadio"
                            stacked
                            name="radiosStacked">
        </b-form-radio-group>
      </template>
      <template v-if="stage === 7">
        <span class="mb-4">
          {{ $t(`integrations.amocrm.stages.7.channels_text`) }}
        </span>
        <b-btn class="mt-4 mb-1" variant="success" block @click="go_to_next_stage">
          {{ $t(`integrations.amocrm.stages.7.channels_button_first`) }}
        </b-btn>
        <b-btn class="mb-1" variant="outline-info" block @click="stage = 5">
          {{ $t(`integrations.amocrm.stages.7.channels_button_second`) }}
        </b-btn>
      </template>
    </template>
    <preloader v-else-if="!error"></preloader>
    <template v-else-if="error">
      <b-alert show class="mb-4" variant="danger">
        <template v-if="!errorText">
        {{ $t(`errors.common.something_wrong`) }}
        </template>
        <template v-else>
          {{ errorText }}
        </template>
      </b-alert>
      <b-btn class="mt-4 mb-1" variant="success" block @click="try_again()">{{ $t(`common.buttons.try_again`) }}</b-btn>
    </template>
    <template v-if="!totalPending">
      <b-btn
        v-if="!error && stage !== 5 && stage !== 7"
        class="mt-4 mb-1"
        variant="success"
        :disabled="canNext"
        block
        @click="go_to_next_stage"
      >
        {{ $t(`common.next`) }}
      </b-btn>
      <b-btn class="mb-1" v-if="prevStage.length > 0" variant="info" block @click="moveBack">{{ $t(`common.back`) }}</b-btn>
    </template>
  </b-modal>
</template>

<script>
  export default {
    data: () => ({
      stage: 1,
      prevStage: [],
      selected: '',
      domain: '',
      login: '',
      apikey: '',
      errorText: '',
      totalPending: false,
      selectedChoise: null,
      selectedChannel: null,
      selectedTariff: null,
      error: false
    }),
    props: ['isOpen'],
    watch: {
      isOpen (n) {
        this.autoOpen(n)
      },
      stage (n, o) {
        // comment for commit
        this.error = false
        this.errorText = ''
        if (o !== 3 && o !== 5) {
          if (this.prevStage[this.prevStage.length - 1] !== n) {
            this.prevStage.push(o)
          } else {
            this.prevStage.pop()
          }
        }
        if (n === 3) {
          this.send_tariff_check()
        }
        if (n === 4) {
          this.totalPending = false
        }
        if (n === 5) {
          this.totalPending = false
          if (Object.keys(this.channels).length === 1) {
            this.connect('amocrm', this.channels[Object.keys(this.channels)[0]].guid)
          } else if (Object.keys(this.channels).length > 1) {
            this.stage = 6
          }
        }
        if (n === 7) {
          this.totalPending = false
        }
      },
      '$route' () {
        this.$refs.modal.hide()
      }
    },
    computed: {
      canNext () {
        if (this.stage === 1) {
          return !(this.domain && this.login && this.apikey)
        } else if (this.stage === 2) {
          return !this.selectedChoise
        } else if (this.stage === 4) {
          return !this.selectedTariff
        } else if (this.stage === 5) {
          return !this.selectedTariff
        } else if (this.stage === 6) {
          return !this.selectedChannel
        }
      },
      channelsRadio () {
        const array = []
        for (const key in this.channels) {
          const channel = this.channels[key]
          if (array.length === 0) {
            this.selected = channel.guid // eslint-disable-line
          }
          array.push({
            text: channel.name || this.$t(`__old__.no_name`),
            value: channel.guid
          })
        }
        return array
      },
      choiseOptions () {
        return [
          {
            text: this.$t(`integrations.amocrm.partner`),
            value: 1
          },
          {
            text: this.$t(`integrations.amocrm.usual_plus`),
            value: 2
          },
          {
            text: this.$t(`integrations.amocrm.usual`),
            value: 3
          }
        ]
      },
      tariffOptions () {
        return [
          {
            text: this.$t(`integrations.amocrm.base_tariff`),
            value: 'start'
          },
          {
            text: this.$t(`integrations.amocrm.advanced_tariff`),
            value: 'pro'
          },
          {
            text: this.$t(`integrations.amocrm.pro_tariff`),
            value: 'proplus'
          }
        ]
      },
      channels () {
        return this.$store.getters['backend/active_channels']
      }
    },
    methods: {
      try_again () {
        this.stage = 1
        this.$nextTick(function () {
          this.prevStage = []
        })
        this.error = false
        this.totalPending = false
      },
      moveBack () {
        this.stage = this.prevStage[this.prevStage.length - 1]
      },
      connect (crm, channelGuid) {
        this.error = false
        this.errorText = ''
        this.totalPending = true
        const object = {
          crm: crm,
          domain: this.domain,
          login: this.login,
          channel: channelGuid,
          apiKey: this.apikey,
          choice: this.selectedChoise,
          clientId: this.clientId,
          clientSecret: this.clientSecret
        }
        if (channelGuid) {
          object.channel = channelGuid
        }
        this.$store.dispatch('backend/add_integration', object)
          .then(() => {
            this.$a.push({
              type: 'success',
              text: this.$t(`integrations.common.added`)
            })
            this.$refs.modal.hide()
            this.totalPending = false
          })
          .catch(e => {
            console.log(e)
            this.error = true
            this.errorText = e.error.data.backend[1] || false
          })
      },
      send_tariff_check () {
        this.totalPending = true
        this.$store.dispatch('backend/get_amo_tariff', {
          domain: this.domain,
          apiKey: this.apikey,
          choice: this.selectedChoise,
          login: this.login
        })
          .then(res => {
            if (res.data === 'trial') {
              this.stage = 4
            } else if (res.data === 'base' || res.data === 'startup') {
              this.stage = 5
            } else {
              this.stage = 7
            }
          })
          .catch(e => {
            this.error = true
            this.errorText = e.error.data.backend[1] || false
          })
      },
      go_to_next_stage () {
        const stage = this.stage
        if (stage === 1) {
          this.stage = 2
        } else if (stage === 2) {
          this.stage = 3
        } else if (stage === 4) {
          if (this.selectedTariff === 'start') {
            this.stage = 5
          } else {
            this.stage = 7
          }
        } else if (stage === 6) {
          this.connect('amocrm', this.selectedChannel)
        } else if (stage === 7) {
          this.connect('amocrm_v2')
        }
      },
      hidden () {
        this.$emit('hide')
      },
      autoOpen (n) {
        if (n) {
          this.$nextTick(function () {
            this.$refs.modal.show()
          })
        } else {
          this.$refs.modal.hide()
        }
      }
    },
    mounted () {
      this.autoOpen(this.isOpen)
    },
    created () {
    }
  }
</script>

<style>
  .planfix{
    font-size: 1.2rem;
    padding: 20px;
    text-align: center;
  }
</style>
