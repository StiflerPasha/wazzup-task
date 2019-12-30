<template>
    <div>
      <b-row>
        <b-col>
          <b-card :title="title" :sub-title="subtitle" class="finance">
            <div class="balance">{{$t(`__old__.your_balance`)}}:
              <template v-if="balance || balance === 0">
                {{ balance }}
              </template>
              <preloader style="display: inline; width: inherit; margin: 0 10px;" size="mini" v-else></preloader>
              EUR</div>
            <template v-if="Object.keys(account).length">
              <b-tabs v-if="account.currency">
                <b-tab :title="$t(`__old__.to_pay`)" active>
                  <finance-payment-list></finance-payment-list>
                </b-tab>
                <b-tab :title="$t(`__old__.payments_give`)">
                  <finance-payments></finance-payments>
                </b-tab>
                <b-tab :title="$t(`__old__.payments_offs`)">
                  <finance-offs></finance-offs>
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
            </template>
            <preloader v-else></preloader>
          </b-card>
        </b-col>
      </b-row>
    </div>
</template>

<script>
  import financePaymentList from '../components/financePaymentList'
  import financePayments from '../components/financePayments'
  import financeOffs from '../components/financeOffs'
  export default {
    data: () => ({}),
    components: {
      financePaymentList,
      financePayments,
      financeOffs
    },
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
        return Object.keys(this.account).length ? this.account.currency ? null : this.$t(`__old__.choose_currency`) : ''
      },
      subtitle () {
        return Object.keys(this.account).length ? this.account.currency ? null : this.$t(`__old__.choose_currency_warning`) : ''
      },
      balance () {
        return this.$store.getters['backend/balance']
      }
    },
    beforeMount () {
      this.$store.commit('settings/SET_PAGE_NAME', {
        name: this.$t(`__old__.finance`),
        back: true
      })
      this.$store.dispatch('backend/get_account_balance')
    }
  }
</script>

<style scoped>
  .currency_buttons {
    display: flex;
    margin: 40px 0 20px;
    justify-content: space-around;
  }

  .finance {
    font-size: 1.2rem;
  }

  .card-subtitle {
    color: #dc3545 !important;
  }

  .balance {
    font-size: 2rem;
    justify-content: flex-end;
    margin-bottom: 20px;
    display: flex;
  }

  .card {
    border-radius: 0 0.25rem 0.25rem 0.25rem;
    border-top: none;
  }
</style>
