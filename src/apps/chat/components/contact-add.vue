<template>
  <b-modal ref="contact_modal" id="contact_add_new" @shown="focus()" hide-footer @hidden="hidden" :title="$t(`contacts.add`)">
    <label for="contact_name">{{ $t(`contacts.name`) }}</label>
    <b-form-input id="contact_name"
                  ref="contact_name"
                  v-model.trim="name"
                  focused
                  type="text"
                  aria-describedby="contact_name_feedback"
                  :state="nameState">
    </b-form-input>
    <b-form-invalid-feedback id="contact_name_feedback">
      {{ nameErrorText }}
    </b-form-invalid-feedback>
    <label class="mt-4" for="contact_name">{{ $t(`contacts.phone`) }}</label>
    <input-phone @phone="setPhone" v-model="phone" :error="phoneErrorText"></input-phone>
    <b-btn
      v-if="!duplicateId"
      class="mt-4 mb-3"
      variant="success"
      :disabled="!can || pending"
      @click="add"
      block
      style="margin-top: 30px !important;"
    >
      {{ $t(`common.add`) }}
    </b-btn>
    <b-btn class="mt-4 mb-3" v-else variant="success" @click="goToContact" block style="margin-top: 30px !important;">
      {{ $t(`contacts.go_to_contact`) }}
    </b-btn>
  </b-modal>
</template>

<script>
  import inputPhone from 'main_components/ui/input-phone.vue'
  export default {
    data: () => ({
      name: '',
      nameState: null,
      phone: '',
      phoneState: null,
      nameErrorText: '',
      phoneErrorText: '',
      pending: false,
      duplicateId: ''
    }),
    components: {
      inputPhone
    },
    computed: {
      can () {
        return this.name && this.phone && !this.phoneErrorText
      }
    },
    watch: {
      phone () {
        this.phoneErrorText = ''
        this.phoneState = null
        this.duplicateId = ''
      }
    },
    methods: {
      goToContact () {
        // TODO: при этом контакта в стейте может не быть (не докрутили), надо дозапросить его данные
        this.$router.push({
          name: 'chat-view',
          params: {
            id: this.duplicateId,
            app: 'chat'
          }
        })
        this.$refs.contact_modal.hide()
      },
      hidden () {
        this.phone = ''
        this.phoneState = null
        this.duplicateId = ''
        this.name = ''
      },
      setPhone (event) {
        this.phone = event.formated
      },
      focus () {
        this.$refs.contact_name.focus()
      },
      add () {
        this.phoneErrorText = ''
        this.duplicateId = ''
        this.phoneState = null
        this.pending = true
        this.$store.dispatch('backend/add_contact', { name: this.name, phone: this.phone })
          .then(res => {
            this.$refs.contact_modal.hide()
            this.name = ''
            this.nameState = null
            this.phone = ''
            this.phoneState = null
            this.nameErrorText = ''
            this.phoneErrorText = ''
            this.pending = false
            this.$router.push({
              app: 'chat',
              params: {
                id: res.data.guid
              }
            })
            this.$a.push({
              type: 'success',
              text: this.$t(`contacts.added`)
            })
          })
          .catch(e => {
            this.pending = false
            this.phoneState = false
            this.phoneErrorText = this.$t(`contacts.phone_exist`)
            this.duplicateId = e.error.data.backend ? e.error.data.backend[1] : ''
          })
      }
    }
  }
</script>

<style>

</style>
