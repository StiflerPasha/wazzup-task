<template>
  <div class="affiliate-partner-account">
    <b-row class="mt-4" align-v="end">
      <b-col>
        <b-button variant="success" @click="showWithdrawPaymentForm">{{ $t('affiliate.billing.withdraw') }}</b-button>
        <b-button variant="success" @click="showTransferPaymentForm">{{ $t('affiliate.billing.transfer_to_account') }}</b-button>
        <b-button v-if="isIntegratorAccount" variant="success" @click="showReplenishmentForm">{{ $t('affiliate.billing.replenish') }}</b-button>
      </b-col>
      <b-col v-if="typeof accountAffiliateBalance === 'number'" class="text-right">
        {{ $t('affiliate.billing.balance') }} {{ accountAffiliateBalance }}
      </b-col>
    </b-row>
    <b-table
      :items="paymentsList"
      :fields="tableFields"
      class="mt-4"
      striped
      hover
    />
    <transfer-payment-form name="transferPayment"/>
    <replenishment-form name="replenishment"/>
    <withdraw-payment-form/>
    <!--
    <currency-form
      :title="$t('Update currency')"
      :form-errors="currencyErrors"
      name="updateCurrency"
      @submit="onUpdateCurrency"
    />
    -->
  </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  import CurrencyForm from './components/CurrencyForm' // TODO: проверить - используется ли вообще она где-то
  import TransferPaymentForm from './components/TransferPaymentForm'
  import WithdrawPaymentForm from './components/WithdrawPaymentForm'
  import ReplenishmentForm from './components/ReplenishmentForm'

  function getDescription ($t, payment) {
    let params = {}
    switch (payment.object) {
    case 'withdrawal':
      params.method = $t(`affiliate.billing.paymentDescription.withdrawalMethod.${payment.details.method}`)
      params.number = payment.details.number
      break
    case 'reward':
      params.month = $t(`common.months.${payment.details.period.month}`)
      params.sum_descr = `${payment.details.base} x ${payment.details.percent}%`
      break
    case 'transfer':
      // TODO: сделать универсальное форматирование
      let id = payment.details.recipient.accountId.toString()
      params.account = `${id.substr(0, 4)}-${id.substr(4, 4)}`
      break
    }
    return $t(`affiliate.billing.paymentDescription.${payment.object}`, params)
  }

  export default {
    name: 'AffiliatePartnerAccount',
    components: {
      CurrencyForm,
      TransferPaymentForm,
      WithdrawPaymentForm,
      ReplenishmentForm
    },
    data: () => ({
      transferErrors: [],
      widrawErrors: [],
      currencyErrors: []
    }),
    computed: {
      ...mapState('backend', {
        currentCurrency: state => state.account.currency,
        affilatePayments: state => state.billing.affiliate,
        accountAffiliateBalance: state => state.billing.affiliate_balance
      }),
      isIntegratorAccount () {
        return this.$store.getters['backend/account'].type === 'integrator'
      },
      tableFields () {
        return [
          {
            key: 'dateTime',
            label: this.$t('affiliate.billing.date')
          },
          {
            key: 'type',
            label: this.$t('affiliate.billing.plus_minus')
          },
          {
            key: 'sum',
            label: this.$t('affiliate.billing.sum')
          },
          {
            key: 'description',
            label: this.$t('affiliate.billing.description')
          },
          {
            key: 'currentBalance',
            label: this.$t('affiliate.billing.current_balance')
          }
        ]
      },
      paymentsList () {
        return this.affilatePayments.map(payment => ({
          type: payment.sum > 0 ? this.$t('affiliate.billing.credit') : this.$t('affiliate.billing.debit'),
          sum: payment.sum,
          dateTime: this.$f.dt(payment.dateTime, 'DD-MM-YYYY'),
          description: getDescription(this.$t, payment),
          currentBalance: payment.currentBalance
        }))
      }
    },
    created () {
      this.getAffiliateHistory()
      this.get_account_affiliate_balance()
    },
    mounted () {
      if (!this.currentCurrency) {
        this.$root.$emit('bv::show::modal', 'updateCurrency')
      }
    },
    methods: {
      ...mapActions('backend', [
        'getAffiliateHistory',
        'get_account_affiliate_balance'
      ]),
      showWithdrawPaymentForm () {
        this.$root.$emit('bv::show::modal', 'WithdrawPaymentForm')
      },
      showTransferPaymentForm () {
        this.$root.$emit('bv::show::modal', 'transferPayment')
      },
      showReplenishmentForm () {
        this.$root.$emit('bv::show::modal', 'replenishment')
      },
      onUpdateCurrency () {

      }
    }
  }
</script>
