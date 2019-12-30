<template>
    <b-card>
      <template v-if="payments.length > 0">
        <b-table class="mt-4 mb-4" :items="fields_views" :fields="fields">
        </b-table>
      </template>
      <preloader v-else=""></preloader>
    </b-card>
</template>

<script>
  export default {
    data: () => ({

    }),
    methods: {
      get_description (object, details, sum) {
        if (object === 'promoBonus') {
          return this.$t(`billing.payments_bonus_promo`)
        }
        if (details.provider === 'yandexkassa' && details.method === 'card') {
          return this.$t(`billing.payments_payed_by_yandex_card`)
        }
        if (object === 'paymentBonus') {
          return this.$t(`billing.payments_bonus`)
        }
        if (object === 'supportBonus') {
          return this.$t(`billing.payments_support_bonus`)
        }
        if (object === 'refund') {
          return this.$t(`billing.payments_refund`)
        }
        if (object === 'cancellationBonus') {
          return this.$t(`billing.payments_cancellation_bonus`)
        }
        if (sum > 0 && object === 'promisePayment') {
          return this.$t(`billing.payments_promise`)
        }
        if (sum < 0 && object === 'promisePayment') {
          return this.$t(`billing.payments_promise_refund`)
        }
      }
    },
    computed: {
      account () {
        return this.$store.getters['backend/account']
      },
      payments () {
        return this.$store.getters['backend/payments']
      },
      fields () {
        const startArray = [{
          key: 'date',
          label: this.$t(`__old__.date`)
        }]
        if (this.account.currency === 'RUR') {
          startArray.push({
            key: 'payed_rur',
            label: this.$t(`billing.payment_payed`)
          })
        }
        startArray.push({
          key: 'payed_gived',
          label: this.$t(`billing.payment_gived`)
        })
        startArray.push({
          key: 'description',
          label: this.$t(`billing.description`)
        })
        return startArray
      },
      fields_views () {
        let array = []
        const payments = this.payments
        payments.forEach(payment => {
          const object = {
            date: this.GET_TIME_FORMATED(payment.dateTime, true),
            payed_gived: payment.sum,
            description: this.get_description(payment.object, payment.details, payment.sum)
          }
          if (this.account.currency === 'RUR') {
            object.payed_rur = payment.details.sum
          }
          array.push(object)
        })
        return array
      }
    },
    beforeMount () {
      this.$store.dispatch('backend/get_history_payments')
    }
  }
</script>

<style>

</style>
