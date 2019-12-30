<template>
    <div>
      <integrations :pending="pending"></integrations>
    </div>
</template>

<script>
  import integrations from '../components/integrations'
  export default {
    data: () => ({
      pending: false
    }),
    components: {
      integrations
    },
    computed: {
      integrations () {
        return this.$store.getters['backend/integrations']
      }
    },
    beforeMount () {
      this.pending = this.integrations.length === 0
      this.$store.dispatch('backend/get_integrations')
        .then(() => {
          this.pending = false
        })
      this.$store.dispatch('backend/get_channels')
        .then(res => {
          this.$store.commit('settings/SET_PAGE_NAME', {
            name: this.$t(`integrations.common.integrations`),
            back: true
          })
        })
    }
  }
</script>

<style>

</style>
