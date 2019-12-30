<template>
    <div>
      <b-row>
        <b-col>
          <channels-list :pending="channelsPending"></channels-list>
        </b-col>
      </b-row>
    </div>
</template>

<script>
  import channelsList from 'settings_components/channelsList/index'
  export default {
    data: () => ({
      channelsPending: false
    }),
    components: {
      channelsList
    },
    beforeMount () {
      this.channelsPending = Object.keys(this.$store.getters['backend/channels']).length === 0
      this.$store.commit('settings/SET_PAGE_NAME', {
        name: this.$t(`__old__.channels_view`),
        back: true
      })
      this.$store.dispatch('backend/get_channels')
        .then(() => {
          this.channelsPending = false
        })
    }
  }
</script>

<style lang="scss">
  .channels_table {
    .icon_to_center {
      text-align: center;
      font-size: 2.5rem
    }
    th {
      text-align: center;
      line-height: 1.5rem;
    }
    td {
      font-size: 1.2rem;
      line-height: 1.5rem;
      text-align: center;
      padding-left: 15px;
      vertical-align: middle !important;
    }
    .table-light, .table-light > th, .table-light > td {
      background-color: #fdfdfe !important;
    }
  }
</style>
