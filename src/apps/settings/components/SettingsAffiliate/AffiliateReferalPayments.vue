<template>
  <div class="affiliate-referrals-payments">
    <b-row class="mt-4" align-v="end">

      <b-col>
        <svg @click="prevMonth" class="pointer" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24">
          <path d="M16.67 0l2.83 2.829-9.339 9.175 9.339 9.167-2.83 2.829-12.17-11.996z"/>
        </svg>
        <span class="px-4">{{ currentMonth }}</span>
        <svg @click="nextMonth" class="pointer" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24">
          <path d="M7.33 24l-2.83-2.829 9.339-9.175-9.339-9.167 2.83-2.829 12.17 11.996z"/>
        </svg>
      </b-col>

      <b-col class="text-right">
        {{ $t('affiliate.referalPayments.period_over')}}: {{ periodTotal }} {{ $t(currentCurrency) }}
      </b-col>
    </b-row>

    <b-table
      v-if="paymentsList.length"
      :items="paymentsList"
      :fields="tableFields"
      class="mt-4"
      striped
      hover
    />
  </div>
</template>
<script>
  import { mapActions, mapState } from 'vuex'
  import { CURRENCIES } from '@/enums'

  export default {
    name: 'AffiliateReferralsPayments',
    data: () => {
      let now = new Date()
      return {
        filter: {
          from: new Date(now.getFullYear(), now.getMonth()),
          to: new Date(new Date(now.getFullYear(), now.getMonth() + 1).getTime() - 1)
        }
      }
    },
    computed: {
      ...mapState('backend', {
        currentCurrency: state => state.account.currency,
        refPayments: 'refPayments'
      }),
      extraColumns () {
        return !!this.refPayments.filter(_ => _.paymentCurrency !== this.currentCurrency).length
      },
      exchangeColumnTitle () {
        return this.currentCurrency === CURRENCIES.RUR ? this.$t('affiliate.referalPayments.exchangeRateEUR') : this.$t('affiliate.referalPayments.exchangeRateRUR')
      },
      periodTotal () {
        return this.refPayments.reduce((sum, p) => {
          return sum + parseFloat(p.creditedSum)
        }, 0)
      },
      currentMonth () {
        return this.$f.dt(this.filter.to, 'MMMM YYYY')
      },
      tableFields () {
        const fields = [
          {
            key: 'dateTime',
            label: this.$t('affiliate.billing.payment_date')
          },
          {
            key: 'paymentSum',
            label: this.$t('affiliate.billing.sum')
          },
          {
            key: 'accountId',
            label: this.$t('affiliate.billing.referral')
          },
          {
            key: 'registerAt',
            label: this.$t('affiliate.billing.registeration')
          },
          {
            key: 'promo',
            label: this.$t('affiliate.billing.promo_code')
          }
        ]

        if (this.extraColumns) {
          fields.push({
            key: 'exchangeRate',
            label: this.exchangeColumnTitle
          })

          fields.push({
            key: 'creditedSum',
            label: this.$t('affiliate.referalPayments.creditedSum')
          })
        }

        return fields
      },
      paymentsList () {
        return this.refPayments.map(ref => ({
          accountId: this.$options.filters.accountIdFormat(ref.accountId),
          creditedSum: `${parseFloat(ref.creditedSum).toFixed(0)} ${this.currentCurrency}`,
          dateTime: this.$f.dt(ref.dateTime, 'DD.MM.YYYY'),
          exchangeRate: parseFloat(ref.exchangeRate).toFixed(2),
          paymentCurrency: ref.paymentCurrency,
          paymentSum: `${parseFloat(ref.paymentSum).toFixed(0)} ${ref.paymentCurrency}`,
          promo: ref.promo,
          registerAt: this.$f.dt(ref.registerAt, 'DD.MM.YYYY')
        }))
      }
    },
    created () {
      this.onSubmit()
    },
    methods: {
      ...mapActions('backend', ['getPayments']),
      prevMonth () {
        this.filter.from = new Date(this.filter.from.getFullYear(), this.filter.from.getMonth() - 1)
        this.filter.to = new Date(new Date(this.filter.to.getFullYear(), this.filter.to.getMonth()).getTime() - 1)

        this.onSubmit()
      },
      nextMonth () {
        this.filter.from = new Date(this.filter.from.getFullYear(), this.filter.from.getMonth() + 1)
        this.filter.to = new Date(new Date(this.filter.to.getFullYear(), this.filter.to.getMonth() + 2).getTime() - 1)

        this.onSubmit()
      },
      onSubmit () {
        const { from, to } = this.filter
        const params = {
          from: from.getTime(),
          to: to.getTime()
        }

        this.getPayments(params)
      }
    }
  }
</script>
