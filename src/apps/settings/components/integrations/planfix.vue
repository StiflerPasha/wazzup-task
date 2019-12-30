<template>
    <b-modal id="integrations_planfix" hide-footer ref="modal"
             @hidden="hidden" title="Planfix">
      <template v-if="Object.keys(channels).length > 0 && !totalPending">

        <label for="apikey">{{ $t(`integrations.planfix.api_message`) }}
        </label>
        <b-input-group>
          <b-form-input id="apikey"
                        readonly
                        ref="copy"
                        :value="account.apiKey"
                        focused
                        type="text">
          </b-form-input>
          <b-input-group-append id="promocode" @click="copyToBuffer()">
            <b-btn variant="light">
              <i class="icon mdi" :class="GET_ICON('mdi-content-copy')"
                 style="font-size: 1.5rem; cursor: pointer"></i>
            </b-btn>
          </b-input-group-append>
        </b-input-group>
        <label for="domaoin"
               class="mt-4">{{ $t(`integrations.planfix.full_domen`) }}</label>
        <b-form-input id="domaoin"
                      ref="modal_input"
                      v-model.trim="domain"
                      focused
                      :placeholder="$t(`integrations.planfix.example`)"
                      type="text"></b-form-input>
        <b-form-radio-group class="mt-4 mb-4"
                            v-model="selected"
                            :options="channelsRadio"
                            stacked
                            name="radiosStacked">
        </b-form-radio-group>
        <b-alert show class="mt-4 mb-4" variant="danger" v-if="error">
          <template v-if="!errorText">
            {{ $t(`errors.common.something_wrong`) }}
          </template>
          <template v-else>
            {{ errorText }}
          </template>
        </b-alert>
        <b-btn class="mt-4 mb-3" variant="success" :disabled="canConnect" block @click="connect">{{ $t(`common.connect`) }}</b-btn>
      </template>
      <div class="planfix" v-else-if="!totalPending">
        {{ $t(`integrations.planfix.channels_error`) }}
      </div>
      <preloader v-else></preloader>
    </b-modal>
</template>

<script>
  export default {
    data: () => ({
      selected: '',
      domain: '',
      totalPending: false,
      error: false,
      errorText: ''
    }),
    props: ['isOpen'],
    watch: {
      isOpen (n) {
        this.autoOpen(n)
      }
    },
    computed: {
      canConnect () {
        return !this.domain
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
      channels () {
        return this.$store.getters['backend/active_channels']
      },
      account () {
        return this.$store.getters['backend/account']
      }
    },
    methods: {
      copyToBuffer () {
        this.$refs.copy.$el.select()
        document.execCommand('copy')
        this.$a.push({
          type: 'success',
          text: this.$t(`common.to_clippboard`)
        })
      },
      connect () {
        this.totalPending = true
        this.error = false
        this.errorText = ''
        this.$store.dispatch('backend/add_integration', { crm: 'planfix', channel: this.selected, domain: this.domain })
          .then(() => {
            this.totalPending = false
            this.$a.push({
              type: 'success',
              text: this.$t(`integrations.common.added`)
            })
            this.$refs.modal.hide()
          })
          .catch(e => {
            this.totalPending = false
            this.error = true
            this.errorText = e.error.data.backend[1] || false
          })
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
