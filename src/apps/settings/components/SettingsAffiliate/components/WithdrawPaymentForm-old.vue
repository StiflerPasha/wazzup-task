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
    <!-- <b-col>
      <b-form-group
        id="type"
        :label="$t(`affiliate.promo.type`)"
        label-for="type"
      >
        <select
          class="form-control"
          v-model="form.method"
        >
          <option
            v-for="(type, index) in withdrawOptions"
            v-text="type.label"
            :key="index"
            :value="type.value"
            name="type"
            id="type"
          />
        </select>
        <div v-if="errors.has('type')" class="text-red mt-2 mb-2 text-small">
          {{ errors.first('type') }}
        </div>
      </b-form-group>
    </b-col> -->
    <b-col>
      <b-form-group
          id="code"
          :label="$t(`affiliate.withdraw.requisites`)"
          label-for="number"
      >
        <input
          v-model="form.number"
          v-validate="'required'"
          :placeholder="$t('affiliate.withdraw.enter_requisites')"
          name="number"
          class="form-control"
        />
        <div v-if="errors.has('number')" class="text-red mt-2 mb-2 text-small">
          {{ errors.first('number') }}
        </div>
      </b-form-group>
    </b-col>
    <b-col>
      <b-form-group
          id="code"
          :label="$t(`affiliate.billing.sum`)"
          label-for="sum"
      >
        <input
          v-model="form.sum"
          v-validate="'required'"
          :placeholder="$t('__old__.enter_account_id')"
          name="sum"
          class="form-control"
        />
        <div v-if="errors.has('sum')" class="text-red mt-2 mb-2 text-small">
          {{ errors.first('sum') }}
        </div>
      </b-form-group>
    </b-col>
  </b-row>
  <b-row>
    <b-col>
      <b-form-group
          id="code"
          :label="$t(`affiliate.withdraw.comment`)"
          label-for="comment"
      >
        <input
          v-model="form.comment"
          v-validate="'required'"
          :placeholder="$t('affiliate.withdraw.enter_comment')"
          name="comment"
          class="form-control"
        />
        <div v-if="errors.has('comment')" class="text-red mt-2 mb-2 text-small">
          {{ errors.first('comment') }}
        </div>
      </b-form-group>
    </b-col>
    <b-col>
      <b-form-group
          id="code"
          :label="$t(`affiliate.withdraw.contacts`)"
          label-for="contacts"
      >
        <input
          v-model="form.contactInformation"
          v-validate="'required'"
          :placeholder="$t('affiliate.withdraw.enter_phone_email')"
          name="contacts"
          class="form-control"
        />
        <div v-if="errors.has('contacts')" class="text-red mt-2 mb-2 text-small">
          {{ errors.first('contacts') }}
        </div>
      </b-form-group>
    </b-col>
  </b-row>
  <div class="text-right">
    <b-button
      @click="onSubmit"
      variant="success"
      class="pull-right"
    >
      {{ $t(`common.save`) }}
    </b-button>
  </div>
  </b-modal>
</template>

<script>

  const WITHDRAW_TYPES = ['bank', 'card']

  const createDefaultForm = () => ({
    // method: 'card',
    comment: null,
    requisites: null,
    contactInformation: null,
    sum: 1
  })

  export default {
    name: 'WithdrawPaymentForm',
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
    data: () => ({
      form: createDefaultForm(),
      validationError: null
    }),
    computed: {
      withdrawOptions () {
        return WITHDRAW_TYPES.map(_ => ({ value: _, label: this.$t('affiliate.withdraw.types.' + _) }))
      }
    },
    methods: {
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
