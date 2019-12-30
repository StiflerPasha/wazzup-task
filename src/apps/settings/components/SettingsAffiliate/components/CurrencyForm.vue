<template>
  <b-modal
    :title="title"
    :ref="name"
    :id="name"
    :name="name"
    hide-footer
    size="lg"
    @hidden="onHidden"
  >
  <b-alert v-if="validationError" show variant="danger">
    {{ validationError }}
  </b-alert>
  <b-alert v-if="formErrors.length" show variant="danger">
    <ul>
      <li v-for="(error, index) in formErrors" :key="index" v-text="error" />
    </ul>
  </b-alert>
  <b-row>
    <b-col>
      <b-form-group
        id="currency"
        :description="$t(`common.account_currency`)"
        :label="$t(`affiliate.billing.currency`)"
        label-for="currency"
      >
        <select
          class="form-control"
          v-model="form.currency"
          :disabled="editMode"
        >
          <option
            v-for="(currency, index) in currenciesOptions"
            v-text="currency.label"
            :key="index"
            :value="currency.id"
            name="currency"
            id="currency"
          />
        </select>
        <div v-if="errors.has('currency')" class="text-red mt-2 mb-2 text-small">
          {{ errors.first('currency') }}
        </div>
      </b-form-group>

      <div class="text-right">
        <b-button
          @click="onSubmit"
          variant="success"
          class="pull-right"

        >
          {{ $t(`common.save`) }}
        </b-button>
      </div>
    </b-col>
  </b-row>
  </b-modal>
</template>

<script>
  import { CURRENCIES } from '@/enums'

  console.log('CURRENCIES', CURRENCIES)

  const createDefaultForm = () => ({
    currency: null
  })

  export default {
    name: 'CurrencyForm',
    $_veeValidate: {
      validator: 'new'
    },
    props: {
      data: {
        type: Object,
        default: null
      },
      title: {
        type: String,
        required: true
      },
      name: {
        type: String,
        default: null
      },
      formErrors: {
        type: Array,
        default: () => ([])
      },
      editMode: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      currenciesOptions () {
        return Object.keys(CURRENCIES).map(key => {
          return { id: CURRENCIES[key], label: this.$t(CURRENCIES[key]) }
        })
      }
    },
    data: () => ({
      form: createDefaultForm(),
      validationError: null,
      validityDate: null
    }),
    watch: {
      data: {
        immediate: true,
        handler (value) {
          if (value) {
            this.form = value
            // где вообще эта форма используется???
            // this.validityDate = moment(value.validity).format('YYYY-MM-DD')
          }
        }
      }
    },
    methods: {
      onChange (e) {
        // где вообще эта форма используется???
        // this.form.validity = moment(e.target.value).unix() * 1000
      },
      onHidden () {
        this.validationError = null
        this.form = createDefaultForm()
        this.errors.clear()
      },
      async onSubmit () {
        this.validationError = null
        const result = await this.$validator.validate()
        if (!result) {
          this.validationError = this.$t(`__old__._validation_error`)
        } else {
          this.$emit('submit', this.form)
        }
      }
    }
  }
</script>
