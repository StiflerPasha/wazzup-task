<template>
  <b-modal
    :title="$t('affiliate.billing.withdraw_request')"
    ref="WithdrawPaymentForm"
    id="WithdrawPaymentForm"
    name="WithdrawPaymentForm"
    hide-footer
    size="lg"
    @shown="onShow"
  >
  <template v-if="variant">
    <b-row> <b-col> <p v-html="text"/> </b-col> </b-row>
    <b-row> <b-col> <b-button @click="onClose" variant="success"> {{ $t('common.itsClear') }} </b-button> </b-col> </b-row>
  </template>
  <template v-else>
    <b-row> <b-col> <preloader/> </b-col> </b-row>
  </template>
  </b-modal>
</template>

<script>

  export default {
    name: 'WithdrawPaymentForm',
    data: () => ({
      variant: null
    }),
    computed: {
      text () {
        return !this.variant ? '' : this.$t(`affiliate.withdraw.variants.${this.variant}`)
      }
    },
    methods: {
      onShow () {
        this.$store.dispatch('backend/getAffiliateAccountState').then(res => { this.variant = res.variant }).catch(e => e)
      },
      onClose () {
        this.$refs.WithdrawPaymentForm.hide()
      }
    }
  }
</script>
