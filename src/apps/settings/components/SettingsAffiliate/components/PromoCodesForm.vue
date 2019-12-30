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
          id="code"
          :description="$t(`affiliate.promo.code_desc`)"
          :label="$t(`affiliate.promo.code`)"
          label-for="code"
      >
        <input
          v-model="form.code"
          v-validate="'required|max:20|alpha_dash'"
          :placeholder="$t(`affiliate.promo.enter_code`)"
          :disabled="editMode"
          name="code"
          class="form-control"
        />
        <div v-if="errors.has('code')" class="text-red mt-2 mb-2 text-small">
          {{ errors.first('code') }}
        </div>
      </b-form-group>
    </b-col>
    <!-- <b-col>
      <b-form-group
          id="validity"
          :description="$t(`affiliate.promo.validity_desc`)"
          :label="$t(`affiliate.promo.validity`)"
          :invalid-feedback="errors.first('validity')"
          label-for="validity"
      >
        <input
          v-model="validityDate"
          @change="onChange"
          name="validity"
          id="validity"
          class="form-control"
          type="date"
        />
      </b-form-group>
    </b-col> -->

  </b-row>
    <b-row>
      <b-col>
        <b-form-group
          id="type"
          :label="$t('affiliate.promo.type')"
          label-for="type"
        >
          <select
            class="form-control"
            v-model="form.type"
            :disabled="editMode"
          >
            <option
              v-for="(type, index) in typesOptions"
              v-text="type.label"
              :key="index"
              :value="type.id"
              name="type"
              id="type"
            />
          </select>
          <div v-if="errors.has('type')" class="text-red mt-2 mb-2 text-small">
            {{ errors.first('type') }}
          </div>
        </b-form-group>

        <div class="text-right">
          <b-button
            @click="onSubmit"
            variant="success"
            class="pull-right"

          >
            {{ $t('affiliate.promo.save_promo_code') }}
          </b-button>
        </div>
      </b-col>
    </b-row>
  </b-modal>
</template>

<script>
  const CODES_TYPES = [
    {
      id: 4,
      label: '__old__.promocode_add_type_4'
    },
    {
      id: 5,
      label: '__old__.promocode_add_type_5'
    }
  ]

  const createDefaultForm = () => ({
    code: null,
    type: 4,
    validity: null
  })

  export default {
    name: 'PromoCodesForm',
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
      typesOptions () {
        return CODES_TYPES.map(type => {
          return { id: type.id, label: this.$t(type.label) }
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
            // TODO: moment больше не исползуем, доработать this.$f
            // this.validityDate = moment(value.validity).format('YYYY-MM-DD')
          }
        }
      }
    },
    methods: {
      onChange (e) {
        // TODO: moment больше не исползуем, доработать this.$f
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
          this.validationError = this.$t('__old__._validation_error')
        } else {
          this.$emit('submit', this.form)
        }
      }
    }
  }
</script>
