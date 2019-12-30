<template>
    <b-card :title="$t(`billing.bigger_bonus`)">
      <div class="mt-4 mb-4" v-if="this.account.currency === 'RUR'">
        {{ $t(`billing.finance_rur_info_eur_1`) }} <br>
        {{ $t(`billing.finance_rur_info_eur_2`) }} <br><br>
        {{ $t(`billing.finance_rur_info_eur_3`) }}
      </div>
      <b-form-radio-group class="mt-4 mb-4"
                          v-model="selected"
                          :options="options"
                          stacked
                          name="radiosStacked">
      </b-form-radio-group>
      <b-form-input v-if="selected === '7'"
                    style="max-width: 300px"
                    ref="additional"
                    @keydown.native="isNumber"
                    v-model="additional"
                    type="text">
      </b-form-input>
      <div :is="paymentMethod" :data="paymentData" v-show="selected !== '7' || selected === '7' && +additional >= 1 "></div>
      <b-alert show class="mt-4" v-if="this.account.currency === 'RUR'">
        Для оплаты по безналу, присылайте реквизиты на почту <a href="mailto:support@wazzup24.com">support@wazzup24.com</a> или в WhatsApp на номер телефона <a href="https://web.whatsapp.com/send?phone=79856256113" target="_blank" rel="noopener noreferrer">+7 (985) 625-61-13</a>.<!-- eslint-disable-line max-len -->
        <br>
        Не забудьте указать номер аккаунта (8 цифр в верхнем левом углу) и сумму пополнения.<br> Минимальная сумма пополнения по безналу - 10000 рублей.<!-- eslint-disable-line max-len -->
      </b-alert>
      <b-alert show class="mt-4" v-if="this.account.currency === 'EUR'">
        <div v-html="$t(`billing.paypal_description_for_business_accounts`)" class="mb-4"></div>
      </b-alert>
    </b-card>
</template>d

<script>
  import yandex from './yandex.vue'
  import paypal from './paypal.vue'
  export default {
    data: () => ({
      selected: '4',
      additional: ''
    }),
    components: {
      yandex,
      paypal
    },
    watch: {
      selected (n) {
        if (n === '7') {
          this.$nextTick(function () {
            this.$refs.additional.focus()
          })
        }
      }
    },
    methods: {
      onlyNumber (text) {
        this.$set(this, 'additional', text.replace(/[a-zA-Z]+/ig, ''))
      },
      isNumber (evt) {
        if (+evt.key || evt.key === 'Backspace' || evt.key === '0') { // eslint-disable-line no-mixed-operators
          return true
        } else {
          evt.preventDefault()
        }
      }
    },
    computed: {
      paymentData () {
        const types = {
          RUR: {
            '1': 2400,
            '2': 5000,
            '3': 10000,
            '4': 25000,
            '5': 50000,
            '6': 100000
          },
          EUR: {
            '1': 60,
            '2': 120,
            '3': 250,
            '4': 500,
            '5': 1000,
            '6': 2000
          }
        }
        return {
          amount: types[this.account.currency][this.selected] || +this.additional,
          account: this.account
        }
      },
      paymentMethod () {
        return this.account.currency === 'RUR' ? 'yandex' : 'paypal'
      },
      account () {
        return this.$store.getters['backend/account']
      },
      options () {
        return [
          {
            value: '1',
            text: this.$t(`__old__.finance_option_1_${this.account.currency}`)
          },
          {
            value: '2',
            text: this.$t(`__old__.finance_option_2_${this.account.currency}`)
          },
          {
            value: '3',
            text: this.$t(`__old__.finance_option_3_${this.account.currency}`)
          },
          {
            value: '4',
            text: this.$t(`__old__.finance_option_4_${this.account.currency}`)
          },
          {
            value: '5',
            text: this.$t(`__old__.finance_option_5_${this.account.currency}`)
          },
          {
            value: '6',
            text: this.$t(`__old__.finance_option_6_${this.account.currency}`)
          },
          {
            value: '7',
            text: this.$t(`__old__.finance_option_7`)
          }
        ]
      }
    }
  }
</script>

<style>

</style>
