<template>
  <b-modal
    :id="id"
    :title="isEdit ? $t(`bookmarks_locale.edit_bookmark`) : $t(`bookmarks_locale.add_bookmark`)"
    centered
    @show="onShow"
    @hidden="onHidden"
  >
    <b-form @submit.stop.prevent="onSubmit">
      <b-form-group
        :label="$t(`bookmarks_locale.link`)"
        label-for="link-input"
      >
        <b-form-input
          id="link-input"
          name="link"
          v-model="$v.form.link.$model"
          :state="$v.form.link.$dirty ? !$v.form.link.$error : null"
          aria-describedby="input-link-feedback"
        />

        <b-form-invalid-feedback id="input-link-feedback">
          {{$t(`bookmarks_locale.input_link_error`)}}
        </b-form-invalid-feedback>
      </b-form-group>

      <b-form-group
        :label="$t(`bookmarks_locale.description`)"
        label-for="description"
      >
        <b-form-textarea
          id="description"
          v-model="form.description"
          rows="3"
          max-rows="6"
        />
      </b-form-group>

      <b-form-checkbox v-model="form.favorites">
        - {{$t(`bookmarks_locale.add_favorites`)}}
      </b-form-checkbox>
    </b-form>

    <template v-slot:modal-footer>
      <b-button
        variant="secondary"
        class="float-right"
        @click="onHidden"
      >
        {{$t(`bookmarks_locale.cancel`)}}
      </b-button>
      <b-button
        variant="success"
        class="float-right"
        :disabled="$v.form.$invalid"
        @click="onSubmit"
      >
        {{isEdit ? $t(`bookmarks_locale.edit`) : $t(`bookmarks_locale.add`)}}
      </b-button>
    </template>
  </b-modal>
</template>

<script>
  import { validationMixin } from 'vuelidate'
  import { required, url } from 'vuelidate/lib/validators'

  const createDefaultForm = () => ({
    link: '',
    description: '',
    favorites: false
  })

  export default {
    props: ['id', 'modalData', 'isEdit'],
    mixins: [validationMixin],
    data () {
      return {
        form: createDefaultForm()
      }
    },
    validations: {
      form: {
        link: {
          required,
          url
        }
      }
    },
    methods: {
      onHidden () {
        this.form = createDefaultForm()
        this.$v.$reset()
        this.$emit('reset')
        this.$bvModal.hide(`${this.id}`)
      },
      onShow () {
        this.form = this.isEdit ? {...this.modalData} : {...createDefaultForm()}
      },
      onSubmit () {
        this.$v.form.$touch()
        if (this.$v.form.$anyError) return
        if (this.isEdit) {
          this.$emit('edit', {...this.form})
        } else {
          this.$emit('add', {...this.form})
        }
        this.$bvModal.hide(`${this.id}`)
      }
    }
  }
</script>
