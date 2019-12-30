<template>
  <b-button size="lg" class="mt-4" @click="makePayment" variant="success">
    <form action="https://money.yandex.ru/eshop.xml" ref="form" method="post" style="display: none">
      <input :key="name" v-for="(value, name) in formData" :value="value" :name="name">
    </form>
    <template v-if="!pending">
      {{ $t(`billing.pay_yandex`) }}
    </template>
    <preloader v-else="" size="mini" color="white"></preloader>
  </b-button>
</template>

<script>
  export default {
    data: () => ({
      pending: false,
      guid: ''
    }),
    props: ['data'],
    computed: {
      merchant_data () {
        return {
          customerContact: this.data.account.regEmail,
          taxSystem: 2,
          items: [{
            quantity: 1,
            price: {
              amount: this.data.amount
            },
            tax: 1,
            text: 'Оплата сервиса WAZZUP'
          }]
        }
      },
      formData () {
        return {
          'paymentType': 'AC',
          'shopId': 174548,
          'scid': 707671,
          'sum': this.data.amount,
          'customerNumber': this.guid,
          'cps_phone': '',
          'cps_email': this.data.account.regEmail,
          'ym_merchant_receipt': JSON.stringify(this.merchant_data)
        }
      }
    },
    methods: {
      makePayment () {
        this.guid = ''
        this.$store.dispatch('backend/add_payment', { provider: 'yandexkassa', sum: this.data.amount, currency: 'RUR' }).then(paymentGuid => {
          //            const formData = new FormData()
          //            formData.append('paymentType', 'AC')
          //            formData.append('shopId', 174548)
          //            formData.append('scid', 707671)
          //            formData.append('sum', this.data.amount)
          //            formData.append('customerNumber', paymentGuid.data.guid)
          //            formData.append('cps_phone', '')
          //            formData.append('cps_email', this.data.account.regEmail)
          //            formData.append('ym_merchant_receipt', JSON.stringify(this.merchant_data))
          //            return this.$store.dispatch('backend/pay_yandex', { formData })
          this.guid = paymentGuid.data.guid
          this.$nextTick(function () {
            this.$refs.form.submit()
          })
        }).then(res => {
          this.pending = false
        }).catch(e => {
          this.pending = false
          this.$a.push({
            type: 'danger',
            text: this.$t(`errors.common.something_wrong`)
          })
        })
      }
    }
  }
</script>

<style>

</style>
