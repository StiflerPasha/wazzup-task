<template>
  <b-card>
    <template v-if="offs.length > 0 && Object.keys(channels).length > 0">
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
    computed: {
      channels () {
        return this.$store.getters['backend/channels']
      },
      offs () {
        return this.$store.getters['backend/offs']
      },
      fields () {
        const startArray = [{
          key: 'date',
          label: this.$t(`__old__.date`)
        }]
        startArray.push({
          key: 'payed_off',
          label: this.$t(`billing.payment_off`)
        })
        startArray.push({
          key: 'description',
          label: this.$t(`billing.description`)
        })
        return startArray
      },
      fields_views () {
        let array = []
        const offs = this.offs
        offs.forEach(payment => {
          const object = {
            date: this.GET_TIME_FORMATED(payment.dateTime, true),
            payed_off: payment.sum,
            description: this.$t('__old__.payments_channel_false', { tarif: payment.details.tariff ? this.$t(`__old__.tariffs.whatsapp_${payment.details.tariff}`) : '' || '...', channel: this.channels[payment.details.channel] ? this.channels[payment.details.channel].name : '...' })
          }
          array.push(object)
        })
        return array
      }
    },
    beforeMount () {
      this.$store.dispatch('backend/get_history_payments_offs')
      this.$store.dispatch('backend/get_channels')
    }
  }
</script>

<style>

</style>
