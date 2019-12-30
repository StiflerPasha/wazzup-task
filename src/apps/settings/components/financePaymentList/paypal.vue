<template>
  <div id="paypal-button" class="mt-5" style="max-width: 250px">
    <preloader v-if="!ready || !mounted"></preloader>
  </div>
</template>

<script>
  export default {
    data: () => ({
      script: null,
      ready: false,
      mounted: false
    }),
    props: ['data'],
    watch: {
      ready () {
        this.init()
      },
      mounted () {
        this.init()
      }
    },
    methods: {
      init () {
        if (this.mounted && this.ready) {
          window.paypal.Button.render({
            env: 'production',
            locale: 'en_US',
            commit: true,
            style: {
              color: 'gold',
              shape: 'pill',
              size: 'medium'
            },
            client: {
              production: 'Ad5xyA8CQTsb77Yg2hli47u-_CEIT-6myeT1RWezwRyvxx9CetH8ixm1GAUon_IjRsVFIBrB-faJmZQE'
            },
            payment: (data, actions) => {
              return actions.payment.create({
                payment: {
                  transactions: [
                    {
                      amount: { total: this.data.amount, currency: 'EUR' }
                    }
                  ]
                }
              })
            },
            onAuthorize: (data, actions) => {
              this.$store.dispatch('backend/add_payment', {provider: 'paypal', currency: this.data.account.currency, paymentId: data.paymentID})
                .then(res => {
                  return actions.payment.execute().then(payment => {
                    if (payment && (payment.state === 'approved') && payment.transactions && payment.transactions.length) {
                      let amount = payment.transactions[0].amount
                      this.$store.dispatch('backend/approve_payment', { paymentId: payment.id, provider: 'paypal', currency: amount.currency, sum: parseFloat(amount.total) })
                    }
                  })
                })
                .then(() => {
                  this.$a.push({
                    type: 'success',
                    text: this.$t(`billing.payment_was_added`)
                  })
                })
                .catch(error => {
                  this.$a.push({
                    type: 'danger',
                    text: this.$t(`errors.common.something_wrong`)
                  })
                  this.$log.e(error, {extra: {message: 'Payment error (onAuthorize)'}})
                })
            },
            onCancel: (data, actions) => {
              this.$a.push({
                type: 'warning',
                text: this.$t(`billing.payment_was_canceled`)
              })
            },
            onError: function (err) { // eslint-disable-line
              this.$a.push({
                type: 'danger',
                text: this.$t(`errors.common.something_wrong`)
              })
              this.$log.e(err, {extra: {message: 'Payment error (onError)'}})
            }
          }, '#paypal-button')
        }
      }
    },
    mounted () {
      this.mounted = true
    },
    beforeMount () {
      const self = this
      const script = document.createElement('script')
      script.setAttribute('src', 'https://www.paypalobjects.com/api/checkout.js')
      document.head.appendChild(script)
      script.onload = () => {
        this.script = script
        self.ready = true
      }
    },
    destroyed () {
      this.script.remove()
      this.ready = false
      this.mounted = false
    }
  }
</script>

<style>

</style>
