<template>
  <b-modal
    :title="$t('clients.addClientTitle')"
    ref="client_add_modal"
    hide-footer
    size="lg"
    @shown="setDefaults()"
  >
    <b-alert v-if="validationError" show variant="danger">
      {{ validationError }}
    </b-alert>
    <b-row>
      <b-col>
        <b-form-group id="email" :label="`${$t(`clients.email`)} *`" label-for="email">
          <input
            v-model="form.email"
            :placeholder="$t(`clients.enter_email`)"
            name="email"
            class="form-control"
          />
          <div v-if="validator.errors.email" class="text-red mt-2 mb-2 text-small">
            {{ validator.errors.email }}
          </div>
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-form-group id="name" :label="$t(`clients.companyName`)" label-for="name">
          <input
            v-model="form.name"
            :placeholder="$t(`clients.enter_name`)"
            name="name"
            class="form-control"
          />
          <div v-if="validator.errors.name" class="text-red mt-2 mb-2 text-small">
            {{ validator.errors.name }}
          </div>
        </b-form-group>
      </b-col>
    </b-row>
    <!--
    <b-row>
      <b-col>
        <b-form-group
          id="domain"
          :label="$t(`clients.domain`)"
          label-for="domain"
        >
          <input
            v-model="form.subdomain"
            :placeholder="$t(`clients.enter_domain`)"
            name="subdomain"
            class="form-control"
          />
          <div v-if="validator.errors.subdomain" class="text-red mt-2 mb-2 text-small">
            {{ validator.errors.subdomain }}
          </div>
        </b-form-group>
      </b-col>
    </b-row>
    -->
    <b-row>
      <b-col sm='4'>
        <b-form-group id="currency" :label="$t(`clients.currency`)" label-for="currency">
          <select class="form-control" v-model="form.currency">
            <option value="RUR">{{ $t('clients.RUR') }}</option>
            <option value="EUR">{{ $t('clients.EUR') }}</option>
          </select>
        </b-form-group>
      </b-col>
      <!--
      <b-col>
        <b-form-group
          id="timeZone"
          :label="$t(`clients.timeZone`)"
          label-for="timeZone"
        >
          <select
            class="form-control"
            v-model="form.timeZone"
          >
            <option value="-11">GMT -11</option>
            <option value="-10">GMT -10</option>
            <option value="-9">GMT -9</option>
            <option value="-8">GMT -8</option>
            <option value="-7">GMT -7</option>
            <option value="-6">GMT -6</option>
            <option value="-5">GMT -5</option>
            <option value="-4">GMT -4</option>
            <option value="-3">GMT -3</option>
            <option value="-2">GMT -2</option>
            <option value="-1">GMT -1</option>
            <option value="0">GMT +0</option>
            <option value="1">GMT +1</option>
            <option value="2">GMT +2</option>
            <option value="3">GMT +3</option>
            <option value="4">GMT +4</option>
            <option value="5">GMT +5</option>
            <option value="6">GMT +6</option>
            <option value="7">GMT +7</option>
            <option value="8">GMT +8</option>
            <option value="9">GMT +9</option>
            <option value="10">GMT +10</option>
            <option value="11">GMT +11</option>
          </select>
        </b-form-group>
      </b-col>
      -->
    </b-row>
    <b-row>
      <b-col sm='4'>
        <b-form-group id="lang" :label="$t(`clients.language`)" label-for="lang">
          <select class="form-control" v-model="form.lang">
            <option value="ru">Русский (RU)</option>
            <option value="en">English (EN)</option>
          </select>
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col sm="12">
        <b-button
          @click="onSubmit"
          variant="success"
          style="width: 100%"
        >
          {{ $t(`clients.createAccount`) }}
        </b-button>
      </b-col>
    </b-row>
  </b-modal>
</template>

<script>
  import { mask } from 'vue-the-mask'

  const createDefaultForm = (account = {}, lang = 'en') => ({
    name: null,
    email: null,
    subdomain: '',
    currency: account.currency || 'RUR',
    timeZone: (new Date()).getTimezoneOffset ? (0 - (new Date()).getTimezoneOffset() / 60).toString() : account.timeZone || '0',
    lang: lang || 'en'
  })

  export default {
    name: 'ClientForm',
    directives: { mask },
    data: () => ({
      form: {},
      validationError: null,
      validator: {
        error: false,
        errors: {}
      }
    }),
    computed: {
    },
    watch: {
    },
    methods: {
      validate () {
        this.validator.error = false
        this.validator.errors = {}
        if (!this.form.email) { // TODO: проверять формат email
          this.validator.errors.email = this.$t('validator.required')
          this.validator.error = true
        }
        if (this.form.name && (this.form.name.length > 100)) {
          this.validator.errors.name = this.$t('validator.max', { length: 100 })
          this.validator.error = true
        }
        if (this.form.subdomain) {
          if (this.form.subdomain.match(/[^A-Za-z0-9-]/ig) || (this.form.subdomain[0] === '-') || (this.form.subdomain[this.form.subdomain.length - 1] === '-')) {
            this.validator.errors.subdomain = this.$t('validator.subdomain')
            this.validator.error = true
          } else if (this.form.subdomain.length > 60) {
            this.validator.errors.subdomain = this.$t('validator.max', { length: 60 })
            this.validator.error = true
          }
        }
        return !this.validator.error
      },
      setDefaults () {
        if (window.__wz_debug) console.log('setDefaults', this.data)
        this.validationError = null
        this.form = createDefaultForm(this.$store.getters['backend/account'], this.$store.state.language)
        this.validator.error = false
        this.validator.errors = {}
        if (window.__wz_debug) console.log('createDefaultForm', createDefaultForm(this.$store.getters['backend/account'], this.$store.state.language))
      },
      async onSubmit () {
        this.validationError = null
        const result = this.validate()
        if (!result) {
          this.validationError = this.$t(`__old__._validation_error`)
        } else {
          this.$store.dispatch('backend/addClient', {
            data: {
              name: this.form.name,
              email: this.form.email,
              subdomain: this.form.subdomain.toLowerCase(),
              currency: this.form.currency,
              timeZone: parseInt(this.form.timeZone),
              lang: this.form.lang
            }
          })
            .then(res => {
              this.$refs.client_add_modal.hide()
              if (window.__wz_debug) console.log(res)
              let clientSuccessAddForm = this.$parent.$refs.clientSuccessAddForm
              clientSuccessAddForm.accountId = res.data.accountId
              clientSuccessAddForm.email = res.data.email
              clientSuccessAddForm.subdomain = res.data.subdomain
              clientSuccessAddForm.$refs.client_success_add_modal.show()
            })
            .catch(e => {
              this.validationError = e.errors[0]
            })
        }
      }
    }
  }
</script>
