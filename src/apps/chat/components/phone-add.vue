<template>
  <b-modal ref="phone_modal" id="phone_add" @shown="focus()" hide-footer @hidden="hidden" :title="$t(`contact.phone_contact`)">
    <label class="mt-4" for="contact_name">{{ $t(`contacts.phone`) }}</label>
    <input-phone @phone="setPhone" v-model="phone" :error="phoneErrorText"></input-phone>
    <b-btn class="mt-4 mb-3" variant="success" :disabled="!can || pending" @click="add" block style="margin-top: 30px !important;">
          {{ $t(`common.add`) }}
    </b-btn>
  </b-modal>
</template>

<script>
  import inputPhone from 'main_components/ui/input-phone.vue'

  export default {
    data: () => ({
      phone: '',
      phoneState: null,
      phoneErrorText: '',
      pending: false
    }),
    components: {
      inputPhone
    },
    computed: {
      contactId () {
        return this.$store.getters['backend/currentContact'].id
      },
      can () {
        return this.phone && !this.phoneErrorText
      }
    },
    watch: {
      phone () {
        this.phoneErrorText = ''
        this.phoneState = null
      }
    },
    methods: {
      hidden () {
        this.phone = ''
        this.phoneState = null
        this.duplicateId = ''
      },
      setPhone (event) {
        this.phone = event.formated
      },
      focus () {
        this.$refs.contact_name.focus()
      },
      add () {
        this.phoneErrorText = ''
        this.phoneState = null
        this.pending = true
        this.$store.dispatch('backend/addContactDetail', {
          id: this.contactId,
          data: {
            value: this.phone,
            type: 'phone'
          }
        })
          .then(res => {
            this.$refs.phone_modal.hide()
            this.phone = ''
            this.phoneState = null
            this.phoneErrorText = ''
            this.pending = false
          })
          .catch(e => {
            console.log(e)
            this.pending = false
            this.phoneState = false
            this.phoneErrorText = this.$t(`contact.phone_error`)
          })
      }
    }
  }
</script>

<style>
</style>
