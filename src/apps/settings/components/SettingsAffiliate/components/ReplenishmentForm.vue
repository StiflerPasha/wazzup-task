<template>
  <b-modal
    :title="$t('affiliate.billing.replenishmentForm.title')"
    :ref="name"
    :name="name"
    :id="name"
    hide-footer
    size="lg"
    @show="setDefaults"
  >
  <b-alert v-if="errorMessage" show variant="danger">
    {{ errorMessage }}
  </b-alert>

  <b-row>
    <b-col>
      <span> {{ $t('affiliate.billing.replenishmentForm.description', example_data) }} <br/> &nbsp; </span>
    </b-col>
  </b-row>
  <b-row>
    <b-col>
      <b-input-group :prepend="$t('affiliate.billing.replenishmentForm.sum')">
        <input v-model="sum" placeholder="0" name="sum" class="form-control"/>
        <b-input-group-append>
          <b-btn :disabled="!(sum > 0)" variant="outline-success" @click="makePayment"> {{ $t('affiliate.billing.replenishmentForm.replenish') }} </b-btn>
        </b-input-group-append>
      </b-input-group>
    </b-col>
  </b-row>
  <form action="https://money.yandex.ru/eshop.xml" ref="form" method="post" style="display: none">
    <input :key="name" v-for="(value, name) in formData" :value="value" :name="name">
  </form>
  </b-modal>
</template>

<script>

  export default {
    name: 'ReplenishmentForm',
    props: {
      name: {
        type: String,
        default: null
      }
    },
    data: () => ({
      errorMessage: null,
      sum: null,
      guid: ''
    }),
    computed: {
      account () {
        return this.$store.getters['backend/account']
      },
      example_data () {
        let sum = 10000
        let discount = this.account.details.discount
        let creditAmount = Math.floor(sum * (1 - discount))
        let discountSum = sum - creditAmount

        return { discount: discount * 100, sum, creditAmount, discountSum }
      },
      merchant_data () {
        return {
          customerContact: this.account.regEmail,
          taxSystem: 2,
          items: [{
            quantity: 1,
            price: {
              amount: this.sum
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
          'sum': this.sum,
          'customerNumber': this.guid,
          'cps_phone': '',
          'cps_email': this.account.regEmail,
          'ym_merchant_receipt': JSON.stringify(this.merchant_data)
        }
      }
    },
    methods: {
      setDefaults () {
        this.sum = null
      },
      makePayment () {
        this.guid = ''
        this.$store.dispatch('backend/add_payment', { provider: 'yandexkassa', sum: this.sum, currency: 'RUR' }).then(paymentGuid => {
          this.guid = paymentGuid.data.guid
          this.$nextTick(function () {
            this.$refs.form.submit()
          })
        }).catch(e => {
          this.$a.push({
            type: 'danger',
            text: this.$t(`errors.common.something_wrong`)
          })
        })
      }
    }
  }
</script>
