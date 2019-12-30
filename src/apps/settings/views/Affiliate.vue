<template>
  <div class="settings-affiliate">
    <b-row>
      <b-col>
        <b-card :title="title" :sub-title="subtitle">
          <br>
          <b-tabs v-if="account.currency" lazy>
            <b-tab :title="$t('affiliate.titles.promocodes')" active>
              <affiliate-promo-codes />
            </b-tab>
            <b-tab v-if="affiliateEnabled" :title="$t('affiliate.titles.registrations')">
              <affiliate-registrations />
            </b-tab>
            <b-tab v-if="affiliateEnabled" :title="$t('affiliate.titles.referal_payments')">
              <affiliate-referal-payments />
            </b-tab>
            <b-tab v-if="affiliateEnabled" :title="$t('affiliate.titles.partner_account')">
              <affiliate-partner-account />
            </b-tab>
            <b-tab v-if="affiliateEnabled" :title="$t('affiliate.titles.rules')">
              <affiliate-rules />
            </b-tab>
            <b-tab v-if="isIntegratorAccount && affiliateEnabled" :title="$t('affiliate.titles.clients')">
              <affiliate-clients />
            </b-tab>
          </b-tabs>
          <template v-else>
            <div class="currency_buttons">
              <b-button size="lg" @click="update_account_currency('RUR')" variant="primary">
                {{ $t(`__old__.currency_button_rub`) }}
              </b-button>
              <b-button size="lg" @click="update_account_currency('EUR')" variant="primary">
                {{ $t(`__old__.currency_button_eur`) }}
              </b-button>
            </div>
          </template>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
  import AffiliatePromoCodes from '../components/SettingsAffiliate/AffiliatePromoCodes.vue'
  import AffiliateRegistrations from '../components/SettingsAffiliate/AffiliateRegistrations.vue'
  import AffiliateReferalPayments from '../components/SettingsAffiliate/AffiliateReferalPayments.vue'
  import AffiliatePartnerAccount from '../components/SettingsAffiliate/AffiliatePartnerAccount.vue'
  import AffiliateRules from '../components/SettingsAffiliate/AffiliateRules.vue'
  import AffiliateClients from '../components/SettingsAffiliate/AffiliateClients.vue'

  export default {
    name: 'SettingsAffiliate',
    components: {
      AffiliatePromoCodes,
      AffiliateRegistrations,
      AffiliateReferalPayments,
      AffiliatePartnerAccount,
      AffiliateRules,
      AffiliateClients
    },
    data: () => ({}),
    methods: {
      update_account_currency (currency) {
        this.$store.dispatch('backend/update_account_info', { currency })
      }
    },
    computed: {
      account () {
        return this.$store.getters['backend/account']
      },
      title () {
        return Object.keys(this.account).length ? this.account.currency ? this.$t('menu.affiliate') : this.$t(`__old__.choose_currency_affiliate`) : ''
      },
      subtitle () {
        return Object.keys(this.account).length ? this.account.currency ? null : this.$t(`__old__.choose_currency_warning`) : ''
      },
      affiliateEnabled () {
        return true
        // return this.$store.getters['backend/available_modules'].includes('affiliate')
      },
      isIntegratorAccount () {
        return this.$store.getters['backend/account'].type === 'integrator'
      }
    }
  }
</script>
