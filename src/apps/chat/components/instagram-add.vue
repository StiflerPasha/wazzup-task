<template>
  <b-modal ref="instagram_modal" id="instagram_add" @shown="focus()" hide-footer @hidden="hidden" :title="$t(`contact.instagram_contact`)">
    <label for="instagram_name">{{ $t(`contacts.name`) }}</label>
    <b-form-input id="instagram_name"
                  ref="instagram_name"
                  v-model.trim="accountName"
                  focused
                  type="text">
    </b-form-input>
    <b-btn class="mt-4 mb-3" variant="success" :disabled="!can" @click="add" block style="margin-top: 30px !important;">
      {{ $t(`common.add`) }}
    </b-btn>
  </b-modal>
</template>

<script>
  // import inputPhone from 'main_components/ui/input-phone.vue'
  export default {
    data: () => ({
      accountName: ''
    }),
    computed: {
      contactId () {
        return this.$store.getters['backend/currentContact'].id
      },
      can () {
        return this.accountName
      }
    },
    methods: {
      hidden () {
        this.name = ''
      },
      focus () {
        this.$refs.contact_name.focus()
      },
      add () {
        this.name = ''
        this.$store.dispatch('backend/addContactDetail', {
          id: this.contactId,
          data: {
            value: this.accountName,
            type: 'instagram'
          }
        })
          .then(res => {
            this.$refs.instagram_modal.hide()
            this.name = ''
          })
          .catch(e => {
            console.log(e)
          })
      }
    }
  }
</script>

<style>
  .tag {
    margin: 5px;
    cursor: pointer;
  }
</style>
