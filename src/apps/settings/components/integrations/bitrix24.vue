<template>
  <b-modal id="integrations_planfix" hide-footer ref="modal"
           @hidden="hidden" title="Bitrix24">
    <template v-if="!totalPending">
      <template v-if="!done">
        <div v-html="$t(`integrations.bitrix.description`)" class="mb-4"></div>
        <label for="domaoin">{{ $t(`integrations.bitrix.full_domen`) }}</label>
          <b-form-input id="domaoin"
                        ref="modal_input"
                        v-model.trim="domain"
                        focused
                        class="mb-3"
                        :placeholder="$t(`integrations.bitrix.example`)"
                        type="text"></b-form-input>
        <tempalte v-if="variant === 2">
          <label for="clientId">clientId</label>
          <b-form-input id="clientId"
                        ref="modal_input"
                        v-model.trim="clientId"
                        focused
                        class="mb-3"
                        :placeholder="$t(`integrations.bitrix.example_client_id`)"
                        type="text"></b-form-input>
          <label for="clientSecret">clientSecret</label>
          <b-form-input id="clientSecret"
                        ref="modal_input"
                        v-model.trim="clientSecret"
                        focused
                        :placeholder="$t(`integrations.bitrix.example_client_secret`)"
                        type="text"></b-form-input>
          <div v-html="$t(`integrations.bitrix.description_manual`)" class="mb-4 mt-4"></div>
        </tempalte>
        <b-alert show class="mt-4 mb-4" variant="danger" v-if="error">
          <template v-if="!errorText">
            {{ $t(`errors.common.something_wrong`) }}
          </template>
          <template v-else>
            {{ errorText }}
          </template>
        </b-alert>
      </template>
      <b-alert show class="mt-4 mb-4" variant="success" v-if="done">
        {{ $t(`integrations.bitrix.everything_done`) }} <br>
        <a :href="done" @click="$refs.modal.hide()">{{ done }}</a>
      </b-alert>
      <template v-if="!done">
        <b-btn class="mt-4 mb-1" variant="success" block :disabled="canConnect" @click="connect">{{ $t(`common.connect`) }}</b-btn>
        <b-btn class="mb-3" variant="info" block @click="variant = variant === 1 ? 2 : 1">
          {{ variant === 1 ? $t(`integrations.bitrix.install_by_hands`) : $t(`integrations.bitrix.marketplace_installed`) }}
        </b-btn>
      </template>
    </template>
    <preloader v-else></preloader>
  </b-modal>
</template>

<script>
  export default {
    data: () => ({
      variant: 1,
      selected: '',
      domain: '',
      clientId: '',
      totalPending: false,
      clientSecret: '',
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
        if (this.variant === 1) {
          return !this.domain
        } else {
          return !(this.domain && this.clientId && this.clientSecret)
        }
      }
    },
    methods: {
      connect () {
        this.totalPending = true
        this.error = false
        this.errorText = ''
        this.$store.dispatch('backend/add_integration', {
          crm: 'bitrix',
          domain: this.domain,
          marketplace: this.variant === 1,
          clientId: this.clientId,
          clientSecret: this.clientSecret
        })
          .then(res => {
            this.done = res.data
            this.totalPending = false
            setTimeout(() => {
              this.$store.dispatch('backend/add_integration')
            }, 10000)
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
