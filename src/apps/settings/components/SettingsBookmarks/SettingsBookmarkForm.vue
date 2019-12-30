<template>
  <b-modal
    :id="name"
    :ref="name"
    :title="title"
    @show="resetModal"
    @hidden="resetModal"
    @ok="handleOk"
    centered
  >
    <form @submit.stop.prevent="handleSubmit">
      <b-form-group
        label="Link"
        label-for="link-input"
        invalid-feedback="Link is required"
      >
        <b-form-input
          id="link-input"
          v-model="form.link"
          required
        />
      </b-form-group>
      <b-form-group
        label="Description"
        label-for="description-input"
        invalid-feedback="Description is required"
      >
        <b-form-input
          id="description-input"
          v-model="form.description"
          required
        />
      </b-form-group>
    </form>
  </b-modal>
</template>

<script>
  const createDefaultForm = () => ({
    link: '',
    description: ''
  })
  export default {
    props: ['title', 'name', 'submit'],
    data () {
      return {
        form: createDefaultForm()
      }
    },
    methods: {
      resetModal () {
        this.form = createDefaultForm()
      },
      handleOk (bvModalEvt) {
        bvModalEvt.preventDefault()
        this.handleSubmit()
      },
      handleSubmit () {
        this.$emit('submit', this.form)
        this.$nextTick(() => {
          this.$refs[this.name].hide()
        })
      }
    }
  }
</script>
