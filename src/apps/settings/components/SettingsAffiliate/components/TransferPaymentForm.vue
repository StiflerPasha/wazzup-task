<template>
  <b-modal
    :title="$t('affiliate.billing.transfer_to_account')"
    :ref="name"
    :name="name"
    :id="name"
    hide-footer
    size="lg"
    @show="setDefaults"
  >
  <b-alert v-if="transferError" show variant="danger">
    {{ transferError }}
  </b-alert>

  <b-row>
    <b-col>
      {{ `${$t('affiliate.transfer.recipientAccountId')}:` }}
    </b-col>
    <b-col>
      <b-input-group>
        <b-input-group-prepend>
          <b-btn variant="outline-info" @click="transferMyself"> {{ $t('affiliate.transfer.transferMyself') }} </b-btn>
        </b-input-group-prepend>
        <input v-model="inputAccountId" v-mask="'####-####'" placeholder="0000-0000" name="inputAccountId" class="form-control"/>
      </b-input-group>
      <div v-if="accountIdError" class="text-red mt-2 mb-2 text-small">
        {{ accountIdError }}
      </div>
    </b-col>

    <template v-if="isIntegratorAccount">
      <div class="w-100"></div>&nbsp;<div class="w-100"></div>
      <b-col>
        {{ `${$t('affiliate.transfer.companyName')}:` }}
      </b-col>
      <b-col style="text-align: right;">
        {{ accountName }}
      </b-col>
    </template>

    <div class="w-100"></div>&nbsp;<div class="w-100"></div>
    <b-col>
      {{ `${$t('affiliate.transfer.domain')}:` }}
    </b-col>
    <b-col style="text-align: right;">
      {{ accountSubdomain ? `https://${accountSubdomain}.wazzup24.com` : '' }}
    </b-col>

    <template v-if="needShowCurrencyInfo">
      <div class="w-100"></div>&nbsp;<div class="w-100"></div>
      <b-col>
        {{ `${$t('affiliate.transfer.recipientCurrency')}:` }}
      </b-col>
      <b-col style="text-align: right;">
        {{ accountCurrency ? $t(`clients.${accountCurrency}`) : '' }}
      </b-col>
    </template>

    <div class="w-100"></div>&nbsp;<div class="w-100"></div>
    <b-col>
      {{ `${$t('affiliate.transfer.howMuch')}:` }}
    </b-col>
    <b-col>
      <b-input-group :append="accountCurrency ? $t(accountCurrency) : ''">
        <b-input-group-prepend>
          <b-btn variant="outline-info" @click="allThatIs"> {{ $t('affiliate.transfer.allThatIs') }} </b-btn>
        </b-input-group-prepend>
        <input v-model="sum" placeholder="0" name="sum" class="form-control"/>
      </b-input-group>
    </b-col>

    <template v-if="needShowDiscountInfo">
      <div class="w-100"></div>&nbsp;<div class="w-100"></div>
      <b-col>
        {{ `${$t('affiliate.transfer.yourDiscount')}:` }}
      </b-col>
      <b-col style="text-align: right;">
        {{ `${discount*100} %` }}
      </b-col>
    </template>

    <template v-if="needShowCurrencyInfo">
      <div class="w-100"></div>&nbsp;<div class="w-100"></div>
      <b-col>
        {{ `${$t('affiliate.transfer.exchangeRateToday')}:` }}
      </b-col>
      <b-col style="text-align: right;">
        {{ rate }}
      </b-col>

      <div class="w-100"></div>&nbsp;<div class="w-100"></div>
      <b-col>
        {{ `${$t('affiliate.transfer.willBeDebited')}:` }}
      </b-col>
      <b-col style="text-align: right;">
        {{ `${amountCharged} ${currentCurrency ? $t(currentCurrency) : ''}` }}
      </b-col>
    </template>

    <div class="w-100"></div>&nbsp;<div class="w-100"></div>
    <b-col>
      <b-button @click="onSubmit" variant="success" style="width: 100%" :disabled="!canTransfer">
        {{ $t(`affiliate.transfer.makeTransfer`) }}
      </b-button>
    </b-col>
    <b-col>
      <b-button @click="onCancel" variant="success" style="width: 100%">
        {{ $t(`common.cancel`) }}
      </b-button>
    </b-col>
  </b-row>

  </b-modal>
</template>

<script>
  import { mask } from 'vue-the-mask'

  export default {
    name: 'TransferPaymentForm',
    directives: { mask },
    props: {
      name: {
        type: String,
        default: null
      }
    },
    data: () => ({
      transferError: null,
      accountIdError: null,
      currentCurrency: null,
      inputAccountId: null,
      accountId: null,
      sum: null,
      amountCharged: 0,
      showConfirmMessage: false,
      cachedAccounts: {},
      exchangeRates: {},
      rate: null,
      discount: 0
    }),
    computed: {
      balanceString () {
        const balance = this.$store.getters['backend/affiliate_balance']
        return balance ? balance.toString() : '0'
      },
      needShowCurrencyInfo () {
        return (this.currentCurrency && this.accountCurrency && (this.currentCurrency !== this.accountCurrency))
      },
      needShowDiscountInfo () {
        return (this.discount > 0)
      },
      canTransfer () {
        return (this.amountCharged > 0)
      },
      accountCurrency () {
        return this.accountId && this.cachedAccounts[this.accountId] && this.cachedAccounts[this.accountId].currency
      },
      accountName () {
        return this.accountId && this.cachedAccounts[this.accountId] && this.cachedAccounts[this.accountId].name
      },
      accountSubdomain () {
        return this.accountId && this.cachedAccounts[this.accountId] && this.cachedAccounts[this.accountId].subdomain
      },
      isIntegratorAccount () {
        return this.$store.getters['backend/account'].type === 'integrator'
      }
    },
    watch: {
      'sum' () {
        this.sum = parseInt(this.sum) || 0
        this.calculateAmountCharged()
      },
      'inputAccountId' () {
        this.onChangeAccount()
      }
    },
    methods: {
      setDefaults () {
        if (window.__wz_debug) {
          console.log(this.$store.getters['backend/account'])
        }
        const account = this.$store.getters['backend/account']
        this.discount = (account.details && account.details.discount) || 0
        this.currentCurrency = account.currency
        this.transferError = null
        this.accountIdError = null
        this.inputAccountId = null
        this.accountId = null
        this.sum = 0
        this.amountCharged = 0
        this.$store.dispatch('backend/getExchangeRates').then(res => {
          this.exchangeRates = res.data
        }).catch(e => {
          this.transferError = e.errors[0]
        })
      },
      transferMyself () {
        this.inputAccountId = this.$f.accId(this.$store.getters['backend/account'].id)
      },
      allThatIs () {
        const balance = this.$store.getters['backend/affiliate_balance']
        this.sum = Math.floor(balance / ((1 - this.discount) * (this.rate || 1))) || 0
      },
      async onChangeAccount () {
        let parsedAccountId = parseInt(this.inputAccountId.replace('-', ''))
        if (parsedAccountId !== this.accountId) {
          this.accountId = null
          this.accountIdError = null
          this.amountCharged = 0
          this.rate = null
          if (parsedAccountId && (parsedAccountId >= 10000000) && (parsedAccountId <= 99999999)) {
            if (this.cachedAccounts[parsedAccountId]) {
              this.accountId = parsedAccountId
              this.calculateAmountCharged()
            }
            this.$store.dispatch('backend/getSpecificAccount', parsedAccountId).then(res => {
              this.accountId = parsedAccountId
              this.cachedAccounts[this.accountId] = res
              if (!res.currency) {
                this.accountIdError = this.$t('__old__.accountEmptyCurrency')
              } else {
                this.calculateAmountCharged()
              }
            }).catch(e => {
              if (e.status === 404) {
                this.accountIdError = this.$t('__old__.accountDoesntExist')
              } else {
                this.accountIdError = e.errors[0]
              }
            })
          }
        }
      },
      calculateAmountCharged () {
        if (this.currentCurrency === this.accountCurrency) {
          this.rate = 1
        } else {
          this.rate = this.exchangeRates[`${this.accountCurrency}_${this.currentCurrency}`]
        }
        if (this.rate) {
          this.amountCharged = Math.floor(parseInt(this.sum) * this.rate * (1 - this.discount), -2) || 0
        } else {
          this.amountCharged = 0
        }
      },
      onSubmit () {
        this.transferError = null
        this.$store.dispatch('backend/transferPayment', {
          data: {
            accountId: this.accountId,
            amountCharged: this.amountCharged,
            sum: parseInt(this.sum)
          },
          errorArguments: {
            balance: this.balanceString,
            currency: this.$t(this.currentCurrency)
          }
        }).then(() => {
          this.$refs.transferPayment.hide()
        }).catch(e => {
          this.transferError = e.errors[0]
        })
      },
      onCancel () {
        this.$refs.transferPayment.hide()
      }
    }
  }
</script>
