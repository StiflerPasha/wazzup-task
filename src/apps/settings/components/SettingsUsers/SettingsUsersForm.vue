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
          id="email"
          :description="$t(`users.user_email`)"
          :label="$t(`users.email`)"
          label-for="email"
      >
        <input
          v-model="form.email"
          v-validate="'required|email'"
          :placeholder="$t(`users.enter_email`)"
          :disabled="editMode"
          name="email"
          class="form-control"
        />
        <div v-if="errors.has('email')" class="text-red mt-2 mb-2 text-small">
          {{ errors.first('email') }}
        </div>
      </b-form-group>
    </b-col>
    <b-col>
      <b-form-group
          id="name"
          :description="$t(`users.user_full_name`)"
          :label="$t(`users.full_name`)"
          :invalid-feedback="errors.first('name')"
          label-for="name"
      >
        <input
          v-model="form.name"
          :placeholder="$t(`users.enter_full_name`)"
          name="name"
          id="name"
          class="form-control"
        />

      </b-form-group>
    </b-col>
    <b-col>
      <b-form-group
          id="aliasName"
          :description="$t(`users.user_alias_name`)"
          :label="$t(`users.alias_name`)"
          label-for="aliasName"
          :invalid-feedback="errors.first('aliasName')"
      >
        <input
          v-model="form.aliasName"
          :placeholder="$t(`users.enter_alias_name`)"
          name="aliasName"
          id="aliasName"
          class="form-control"
        />

      </b-form-group>
    </b-col>
  </b-row>
    <b-row>
      <b-col cols="3">
        <b-form-group
            id="id"
            :description="$t(`users.user_id`)"
            :label="$t(`users.id`)"
            label-for="id"
            :invalid-feedback="errors.first('id')"
        >
          <b-form-input
            v-model="form.id"
            v-validate="'required'"
            v-mask="'####-####'"
            placeholder="0000-0000"
            :state="!errors.has('id')"
            name="id"
            id="id"
          />
        </b-form-group>
      </b-col>
      <b-col>
        <b-form-group
          id="role"
          :description="$t(`users.user_role`)"
          :label="$t(`users.role`)"
          label-for="role"
        >
          <select class="form-control" v-model="form.role" :disabled="roleSelectDisabled">
            <option
              v-for="(role, index) in rolesOptions"
              v-text="role.label"
              :key="index"
              :value="role.id"
              name="role"
              id="role"
            />
          </select>
          <div v-if="errors.has('role')" class="text-red mt-2 mb-2 text-small">
            {{ errors.first('role') }}
          </div>
        </b-form-group>

        <div class="text-right">
          <b-button
            @click="onSubmit"
            variant="success"
            class="pull-right"

          >
            {{ $t(`users.save_user`) }}
          </b-button>
        </div>
      </b-col>
    </b-row>
  </b-modal>
</template>

<script>
  import { mask } from 'vue-the-mask'
  import { USER_ROLES } from '@/enums'

  const ROLES = [
    USER_ROLES.ADMIN,
    USER_ROLES.MANAGER
  ]

  const DISABLED_ROLES = [
    USER_ROLES.OWNER,
    USER_ROLES.INTEGRATOR
  ]

  const createDefaultForm = () => ({
    id: null,
    role: USER_ROLES.MANAGER,
    name: null,
    aliasName: null,
    email: null
  })

  export default {
    name: 'SettingsUsersTable',
    directives: { mask },
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
      editMode: {
        type: Boolean,
        default: false
      },
      formErrors: {
        type: Array,
        default: () => ([])
      }
    },
    data: () => ({
      form: createDefaultForm(),
      validationError: null
    }),
    computed: {
      idInvalidFeedback () {
        return this.form.id ? this.$t(`users.id_is_required`) : this.$t(`users.id_length_3`)
      },
      roleSelectDisabled () {
        return (DISABLED_ROLES.indexOf(this.form.role) >= 0)
      },
      rolesOptions () {
        if (DISABLED_ROLES.indexOf(this.form.role) >= 0) {
          return [{
            id: this.form.role,
            label: this.$t(`users.roles.${this.form.role}`)
          }]
        } else {
          return ROLES.map(role => {
            return { id: role, label: this.$t(`users.roles.${role}`) }
          })
        }
      }
    },
    watch: {
      data: {
        immediate: true,
        handler (value) {
          if (value) {
            this.form = value
          }
        }
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
