<template>
  <div class="affiliate-referrals-payments">
    <b-row>
      <b-col :cols="4" style="min-width: 330px; max-width: 330px;">
        <referrals-pie-chart
          :data="referralsPieData"
        />
      </b-col>
      <b-col>
        <referrals-bars-chart
          :data="referralsBarsData"
        />
      </b-col>
    </b-row>
    <template v-if="totalReferrals">
      {{ $t('affiliate.registrations.total')}}: {{ totalReferrals }}
    </template>
    <!--
    <b-table
      :items="referralsList"
      :fields="tableFields"
      class="mt-4"
      striped
      hover
    />
    -->

  </div>
</template>

<script>
  import groupBy from 'lodash/groupBy'
  import palette from 'google-palette'
  import { mapActions, mapState } from 'vuex'

  import ReferralsPieChart from './components/ReferralsPieChart'
  import ReferralsBarsChart from './components/ReferralsBarsChart'

  export default {
    name: 'AffiliateReferralsPayments',
    components: {
      ReferralsPieChart,
      ReferralsBarsChart
    },
    computed: {
      ...mapState('backend', ['referrals']),
      tableFields () {
        return [
          {
            key: 'accountId',
            label: this.$t('__old__.account_id')
          },
          {
            key: 'promo',
            label: this.$t('affiliate.registrations.promoCode')
          },
          {
            key: 'registerAt',
            label: this.$t('affiliate.registrations.registerAt')
          }
        ]
      },
      referralsList () {
        return this.referrals.map(ref => ({
          accountId: ref.accountId,
          promo: (ref.promo === '!') ? this.$t('affiliate.registrations.regFromAcc') : ref.promo || this.$t('affiliate.registrations.refLink'),
          registerAt: this.$f.dt(ref.registerAt, 'DD.MM')
        }))
      },
      chartsColors () {
        const colors = palette('tol', Object.keys(this.groupByPromo).length).map(hex => `#${hex}`)
        return Object.keys(this.groupByPromo).reduce((result, promoCode, index) => {
          result[promoCode] = colors[index]
          return result
        }, {})
      },
      groupByPromo () {
        return groupBy(this.referralsList, 'promo')
      },
      totalReferrals () {
        return this.referralsList.length
      },
      referralsPieData () {
        return {
          labels: this.referralsPieLabels,
          datasets: [{
            data: this.referralsPieDataset,
            backgroundColor: Object.keys(this.chartsColors).map(color => this.chartsColors[color]),
            borderWidth: 0
          }]
        }
      },
      referralsPieLabels () {
        return Object.keys(this.groupByPromo).map(key => key)
      },
      referralsPieDataset () {
        return Object.keys(this.groupByPromo).map(key => this.groupByPromo[key].length)
      },
      groupByDate () {
        return groupBy(this.referralsList, 'registerAt')
      },
      referralsBarsData () {
        return {
          labels: this.referralsBarsLabels,
          datasets: this.referralsBarsDataset
        }
      },
      referralsBarsLabels () {
        return Object.keys(this.groupByDate).map(key => key)
      },
      referralsBarsDataset () {
        const dataset = []

        Object.keys(this.groupByPromo).forEach(code => {
          const promoByDates = groupBy(this.groupByPromo[code], 'registerAt')
          const data = []
          Object.keys(this.groupByDate).forEach(date => {
            data.push(promoByDates[date] ? promoByDates[date].length : 0)
          })

          dataset.push({
            label: code,
            data,
            backgroundColor: this.chartsColors[code]
          })
        })
        return dataset
      }
    },
    created () {
      this.getReferrals()
    },
    methods: {
      ...mapActions('backend', ['getReferrals'])
    }
  }
</script>
