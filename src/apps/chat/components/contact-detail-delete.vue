<template>
  <b-modal ref="delete_contact_detail_modal" id="contact_delete" @shown="focus()" hide-footer @hidden="hidden" :title="$t(`contact.delete_contact`)">
    <span>
      {{ $t('contact.delete_contact_detail') }}
    </span>
    <b-btn class="mt-4 mb-3" variant="danger" @click="deleteContactDetail" block style="margin-top: 30px !important;">
      {{ $t(`common.delete`) }}
    </b-btn>
  </b-modal>
</template>

<script>
  export default {
    data: () => ({
      contactDetailsId: '',
      contactId: ''
    }),
    methods: {
      hidden () {
      },
      focus () {
      },
      deleteContactDetail () {
        this.$store.dispatch('backend/deleteContactDetail', {
          contactId: this.contactId,
          contactDetailsId: this.contactDetailsId
        }).then(res => {
          this.$refs.delete_contact_detail_modal.hide()
        }).catch(() => {
          this.$refs.delete_contact_detail_modal.hide()
        })
      }
    }
  }
</script>

<style>
</style>
