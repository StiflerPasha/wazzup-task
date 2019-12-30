<template>
    <div>
      <settings-header />
      <settings-sidebar />
      <settings-main-view />
    </div>
</template>

<script>
  import SettingsHeader from './views/SettingsHeader.vue'
  import SettingsSidebar from './views/SettingsSidebar.vue'
  import SettingsMainView from './views/SettingsMainView.vue'
  export default {
    components: {
      SettingsHeader,
      SettingsSidebar,
      SettingsMainView
    },
    beforeMount () {
      this.$store.commit('SET_APP', 'settings')
      const isAllowed = !this.$store.getters['auth/is_query_token']
      if (!isAllowed) {
        this.$router.push({
          name: 'chat-main',
          params: {
            app: 'chat'
          }
        })
      }
    }
  }
</script>

<style>

</style>
